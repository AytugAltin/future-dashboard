import { euro, intFmt } from '../formatters.js'

const EMPTY_CONFIG = { venues: [] }

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function hasToken(haystack, token) {
  const n = normalize(token)
  return n ? haystack.includes(n) : false
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + (Number(row?.[key]) || 0), 0)
}

export function matchesVenueEconomicsRule(row, rule) {
  const match = rule?.match ?? {}
  const venueName = normalize(row?.venue_name)
  const venueComposite = normalize(`${row?.venue_name || ''} ${row?.venue_city || ''}`)
  const eventName = normalize(row?.event_name)

  const checks = []

  for (const candidate of match.venue_names ?? []) {
    const normalizedCandidate = normalize(candidate)
    if (!normalizedCandidate) continue
    checks.push(venueName === normalizedCandidate || venueComposite === normalizedCandidate)
  }

  for (const alias of match.venue_aliases ?? []) {
    checks.push(hasToken(venueName, alias) || hasToken(venueComposite, alias))
  }

  for (const keyword of match.event_name_keywords ?? []) {
    checks.push(hasToken(eventName, keyword))
  }

  if (!checks.length) return false
  if (match.mode === 'all') return checks.every(Boolean)
  return checks.some(Boolean)
}

function buildEconomicsNotes(rule) {
  const economics = rule?.economics ?? {}
  const notes = []

  for (const item of economics.income_adjustments ?? []) {
    notes.push(
      `${item.confidence === 'approximate' ? 'Approx ' : ''}${euro.format(item.amount_eur)} ${item.adjustment_type} on ${item.applies_to || 'income'}${item.frequency ? ` (${item.frequency})` : ''}${item.notes ? ` — ${item.notes}` : ''}`
    )
  }

  for (const item of economics.fixed_costs ?? []) {
    const status = item.workflow_status === 'backlog_only' ? 'backlog only' : item.workflow_status
    notes.push(
      `${euro.format(item.amount_eur)} ${item.cost_type?.replace(/_/g, ' ') || 'fixed cost'}${item.frequency ? ` (${item.frequency})` : ''}${item.payable_by ? ` · payable by ${item.payable_by}` : ''}${status ? ` · ${status}` : ''}${item.notes ? ` — ${item.notes}` : ''}`
    )
  }

  if (economics.cash_split_when_no_sumup?.splits?.length) {
    const splitText = economics.cash_split_when_no_sumup.splits
      .map((split) => `${split.party} ${euro.format(split.amount_eur)}`)
      .join(' · ')
    notes.push(
      `If no SumUp: ${splitText}${economics.cash_split_when_no_sumup.notes ? ` — ${economics.cash_split_when_no_sumup.notes}` : ''}`
    )
  }

  if (economics.ad_budget_guidance) {
    const guidance = economics.ad_budget_guidance
    const parts = []
    if (guidance.target_eur != null) parts.push(`target ${euro.format(guidance.target_eur)}`)
    if (guidance.acceptable_max_eur != null) parts.push(`acceptable max ${euro.format(guidance.acceptable_max_eur)}`)
    notes.push(`Ad budget guidance: ${parts.join(' · ')}${guidance.notes ? ` — ${guidance.notes}` : ''}`)
  }

  return notes
}

function buildOpsNotes(rule) {
  const ops = rule?.ops ?? {}
  const notes = [...(ops.notes ?? [])]
  if (ops.cadence) {
    const cadence = []
    if (ops.cadence.typical_occurrences_per_month != null) {
      cadence.push(`${ops.cadence.typical_occurrences_per_month} shows/month`)
    }
    if (ops.cadence.weekday) cadence.push(ops.cadence.weekday)
    if (ops.cadence.dates_may_be_tbd) cadence.push('dates may still be TBD')
    if (cadence.length) notes.unshift(`Cadence: ${cadence.join(' · ')}`)
  }
  for (const task of ops.tasks ?? []) {
    notes.push(`${task.label}${task.timing ? ` (${task.timing})` : ''}${task.status ? ` · ${task.status}` : ''}`)
  }
  return notes
}

export function buildVenueEconomicsSummary(eventsOverview = [], config = EMPTY_CONFIG) {
  const today = new Date().toISOString().slice(0, 10)

  return (config?.venues ?? []).map((rule) => {
    const matchedRows = eventsOverview.filter((row) => matchesVenueEconomicsRule(row, rule))
    const matchedVenueNames = [...new Set(matchedRows.map((row) => row.venue_name).filter(Boolean))].sort((a, b) => a.localeCompare(b))
    const upcomingRows = matchedRows.filter((row) => row.event_date >= today && row.event_status === 'live')

    return {
      ...rule,
      notes: buildEconomicsNotes(rule),
      opsNotes: buildOpsNotes(rule),
      matchedEventCount: matchedRows.length,
      upcomingEventCount: upcomingRows.length,
      reservationCount: sum(matchedRows, 'reservation_count'),
      trackedNetAmount: sum(matchedRows, 'sumup_net_amount'),
      matchedVenueNames,
      exportSnapshotLabel:
        matchedRows.length > 0
          ? `${intFmt.format(matchedRows.length)} matched events in current export`
          : 'No matched events in current export yet',
    }
  })
}
