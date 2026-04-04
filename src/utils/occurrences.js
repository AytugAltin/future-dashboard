import { eventbriteEventUrl } from './metrics.js'

function round(value, decimals = 2) {
  const factor = 10 ** decimals
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(value, fallback = 'unknown') {
  const slug = normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || fallback
}

function normalizeLocalTime(value) {
  if (value == null || value === '') return ''
  const text = String(value).trim()
  if (/^\d{2}:\d{2}/.test(text)) return text.slice(0, 5)
  return text
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item != null && item !== '')
  if (value == null || value === '') return []
  return [value]
}

function toInt(value) {
  return Number.parseInt(value ?? 0, 10) || 0
}

function toFloat(value) {
  const parsed = Number.parseFloat(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function statusRank(status) {
  const s = String(status ?? '').toLowerCase()
  const rankMap = {
    live: 5,
    started: 4,
    completed: 3,
    ended: 2,
    draft: 1,
    canceled: 0,
    cancelled: 0,
  }
  return [rankMap[s] ?? 1, s]
}

function statusWins(next, current) {
  const [nextRank, nextKey] = statusRank(next)
  const [currentRank, currentKey] = statusRank(current)
  if (nextRank !== currentRank) return nextRank > currentRank
  return nextKey > currentKey
}

function pickPrimaryCandidate(candidates) {
  return [...candidates].sort((a, b) => {
    if (b.reservation_count !== a.reservation_count) return b.reservation_count - a.reservation_count
    if (b.eventbrite_order_count !== a.eventbrite_order_count) return b.eventbrite_order_count - a.eventbrite_order_count
    if (b.paid_order_count !== a.paid_order_count) return b.paid_order_count - a.paid_order_count
    if ((b.event_name || '').length !== (a.event_name || '').length) return (b.event_name || '').length - (a.event_name || '').length
    return String(a.event_id || '').localeCompare(String(b.event_id || ''))
  })[0] ?? null
}

function canonicalTitleOrder(stats) {
  return [...stats].sort((a, b) => {
    if (b.reservation_count !== a.reservation_count) return b.reservation_count - a.reservation_count
    if (b.eventbrite_order_count !== a.eventbrite_order_count) return b.eventbrite_order_count - a.eventbrite_order_count
    if (b.paid_order_count !== a.paid_order_count) return b.paid_order_count - a.paid_order_count
    if ((b.title || '').length !== (a.title || '').length) return (b.title || '').length - (a.title || '').length
    return String(a.title || '').localeCompare(String(b.title || ''))
  })
}

export function buildOccurrenceId(row) {
  if (row?.occurrence_id) return String(row.occurrence_id)
  const venuePart = slugify([row?.venue_name, row?.venue_city].filter(Boolean).join(' '), 'unknown-venue')
  const datePart = row?.event_date || 'unknown-date'
  const timePart = normalizeLocalTime(row?.local_time).replace(':', '-') || 'unknown-time'
  const timezonePart = slugify(row?.timezone || '', '')
  return [venuePart, `${datePart}t${timePart}`, timezonePart].filter(Boolean).join('__')
}

export function collapseEventOccurrences(rows = []) {
  const buckets = new Map()

  for (const row of rows) {
    const occurrenceId = buildOccurrenceId(row)
    const bucket = buckets.get(occurrenceId) ?? {
      occurrence_id: occurrenceId,
      event_id: row?.event_id ?? null,
      primary_eventbrite_event_id: row?.primary_eventbrite_event_id ?? row?.event_id ?? null,
      eventbrite_event_ids: [],
      eventbrite_urls: [],
      eventbrite_titles: [],
      merged_event_count: 0,
      event_date: row?.event_date ?? null,
      occurrence_start_local: row?.occurrence_start_local ?? ((row?.event_date && row?.local_time) ? `${row.event_date}T${normalizeLocalTime(row.local_time)}` : null),
      event_name: row?.event_name ?? null,
      event_status: row?.event_status ?? null,
      local_time: normalizeLocalTime(row?.local_time),
      timezone: row?.timezone ?? null,
      venue_name: row?.venue_name ?? null,
      venue_city: row?.venue_city ?? null,
      event_capacity: 0,
      eventbrite_order_count: 0,
      reservation_count: 0,
      eventbrite_reported_amount: 0,
      eventbrite_reported_amount_excluded: 0,
      has_ignored_eventbrite_revenue: false,
      paid_order_count: 0,
      sumup_payout_count: 0,
      sumup_gross_amount: 0,
      sumup_fee_amount: 0,
      sumup_net_amount: 0,
      sumup_high_count: 0,
      sumup_medium_count: 0,
      sumup_low_count: 0,
      income_per_reservation: 0,
      reservation_fill_ratio: null,
      _candidates: [],
      _titleStats: new Map(),
    }

    bucket.event_date = bucket.event_date || row?.event_date || null
    bucket.local_time = bucket.local_time || normalizeLocalTime(row?.local_time)
    bucket.timezone = bucket.timezone || row?.timezone || null
    bucket.venue_name = bucket.venue_name || row?.venue_name || null
    bucket.venue_city = bucket.venue_city || row?.venue_city || null
    bucket.occurrence_start_local = bucket.occurrence_start_local || row?.occurrence_start_local || ((bucket.event_date && bucket.local_time) ? `${bucket.event_date}T${bucket.local_time}` : null)

    bucket.event_capacity = Math.max(bucket.event_capacity, toInt(row?.event_capacity))
    bucket.eventbrite_order_count += toInt(row?.eventbrite_order_count)
    bucket.reservation_count += toInt(row?.reservation_count)
    bucket.eventbrite_reported_amount += toFloat(row?.eventbrite_reported_amount)
    bucket.eventbrite_reported_amount_excluded += toFloat(row?.eventbrite_reported_amount_excluded)
    bucket.has_ignored_eventbrite_revenue = bucket.has_ignored_eventbrite_revenue || Boolean(row?.has_ignored_eventbrite_revenue)
    bucket.paid_order_count += toInt(row?.paid_order_count)
    bucket.sumup_payout_count += toInt(row?.sumup_payout_count)
    bucket.sumup_gross_amount += toFloat(row?.sumup_gross_amount)
    bucket.sumup_fee_amount += toFloat(row?.sumup_fee_amount)
    bucket.sumup_net_amount += toFloat(row?.sumup_net_amount)
    bucket.sumup_high_count += toInt(row?.sumup_high_count)
    bucket.sumup_medium_count += toInt(row?.sumup_medium_count)
    bucket.sumup_low_count += toInt(row?.sumup_low_count)

    const rawEventIds = asArray(row?.eventbrite_event_ids)
    const rawUrls = asArray(row?.eventbrite_urls)
    const fallbackPrimaryId = row?.primary_eventbrite_event_id ?? row?.event_id
    const eventIds = rawEventIds.length ? rawEventIds : asArray(fallbackPrimaryId)
    const urls = rawUrls.length ? rawUrls : eventIds.map((eventId) => eventbriteEventUrl(eventId)).filter(Boolean)
    const titles = asArray(row?.eventbrite_titles).length ? asArray(row?.eventbrite_titles) : asArray(row?.event_name)
    const mergedCount = toInt(row?.merged_event_count) || Math.max(eventIds.length, 1)

    bucket.merged_event_count += mergedCount

    for (const eventId of eventIds.map(String)) {
      if (!bucket.eventbrite_event_ids.includes(eventId)) bucket.eventbrite_event_ids.push(eventId)
    }
    for (const url of urls) {
      if (url && !bucket.eventbrite_urls.includes(url)) bucket.eventbrite_urls.push(url)
    }
    for (const title of titles) {
      if (!title) continue
      const current = bucket._titleStats.get(title) ?? {
        title,
        reservation_count: 0,
        eventbrite_order_count: 0,
        paid_order_count: 0,
      }
      current.reservation_count += toInt(row?.reservation_count)
      current.eventbrite_order_count += toInt(row?.eventbrite_order_count)
      current.paid_order_count += toInt(row?.paid_order_count)
      bucket._titleStats.set(title, current)
    }

    bucket._candidates.push({
      event_id: fallbackPrimaryId,
      event_name: row?.event_name,
      reservation_count: toInt(row?.reservation_count),
      eventbrite_order_count: toInt(row?.eventbrite_order_count),
      paid_order_count: toInt(row?.paid_order_count),
    })

    if (statusWins(row?.event_status, bucket.event_status)) {
      bucket.event_status = row?.event_status ?? bucket.event_status
    }

    buckets.set(occurrenceId, bucket)
  }

  return [...buckets.values()]
    .map((bucket) => {
      const primary = pickPrimaryCandidate(bucket._candidates)
      const titleStats = canonicalTitleOrder([...bucket._titleStats.values()])
      const eventbriteEventIds = [...bucket.eventbrite_event_ids].sort((a, b) => String(a).localeCompare(String(b)))
      const eventbriteUrls = [...bucket.eventbrite_urls]
      const mergedEventCount = Math.max(bucket.merged_event_count || 0, eventbriteEventIds.length || 0, 1)
      const primaryEventId = primary?.event_id ?? bucket.primary_eventbrite_event_id ?? eventbriteEventIds[0] ?? null
      const eventName = primary?.event_name ?? titleStats[0]?.title ?? bucket.event_name ?? null

      return {
        occurrence_id: bucket.occurrence_id,
        event_id: primaryEventId,
        primary_eventbrite_event_id: primaryEventId,
        eventbrite_event_ids: eventbriteEventIds,
        eventbrite_urls: eventbriteUrls.length ? eventbriteUrls : eventbriteEventIds.map((eventId) => eventbriteEventUrl(eventId)).filter(Boolean),
        eventbrite_titles: titleStats.map((item) => item.title),
        merged_event_count: mergedEventCount,
        event_date: bucket.event_date,
        occurrence_start_local: bucket.occurrence_start_local,
        event_name: eventName,
        event_status: bucket.event_status,
        local_time: bucket.local_time,
        timezone: bucket.timezone,
        venue_name: bucket.venue_name,
        venue_city: bucket.venue_city,
        event_capacity: bucket.event_capacity,
        eventbrite_order_count: bucket.eventbrite_order_count,
        reservation_count: bucket.reservation_count,
        eventbrite_reported_amount: round(bucket.eventbrite_reported_amount),
        eventbrite_reported_amount_excluded: round(bucket.eventbrite_reported_amount_excluded),
        has_ignored_eventbrite_revenue: bucket.has_ignored_eventbrite_revenue,
        paid_order_count: bucket.paid_order_count,
        sumup_payout_count: bucket.sumup_payout_count,
        sumup_gross_amount: round(bucket.sumup_gross_amount),
        sumup_fee_amount: round(bucket.sumup_fee_amount),
        sumup_net_amount: round(bucket.sumup_net_amount),
        sumup_high_count: bucket.sumup_high_count,
        sumup_medium_count: bucket.sumup_medium_count,
        sumup_low_count: bucket.sumup_low_count,
        income_per_reservation: bucket.reservation_count > 0 ? round(bucket.sumup_net_amount / bucket.reservation_count) : 0,
        reservation_fill_ratio: bucket.event_capacity > 0 ? round(bucket.reservation_count / bucket.event_capacity, 3) : null,
        eventbrite_url: (eventbriteUrls[0] || eventbriteEventUrl(primaryEventId)),
      }
    })
    .sort((a, b) => {
      const dateCompare = String(a.event_date || '').localeCompare(String(b.event_date || ''))
      if (dateCompare !== 0) return dateCompare
      const timeCompare = String(a.local_time || '').localeCompare(String(b.local_time || ''))
      if (timeCompare !== 0) return timeCompare
      return String(a.event_name || '').localeCompare(String(b.event_name || ''))
    })
}

export function buildVenueRollup(rows = []) {
  const buckets = new Map()
  for (const row of rows) {
    const venueName = row?.venue_name || 'Unknown venue'
    const venueCity = row?.venue_city || ''
    const key = `${venueName}__${venueCity}`
    const bucket = buckets.get(key) ?? {
      venue_name: venueName,
      venue_city: venueCity,
      event_count: 0,
      ticket_count: 0,
      order_count: 0,
      payout_count: 0,
      gross_amount: 0,
      fee_amount: 0,
      net_amount: 0,
      gross_per_ticket: 0,
      net_per_ticket: 0,
      net_per_event: 0,
      high_count: 0,
      low_count: 0,
    }
    bucket.event_count += 1
    bucket.ticket_count += toInt(row?.reservation_count)
    bucket.order_count += toInt(row?.eventbrite_order_count)
    bucket.payout_count += toInt(row?.sumup_payout_count)
    bucket.gross_amount += toFloat(row?.sumup_gross_amount)
    bucket.fee_amount += toFloat(row?.sumup_fee_amount)
    bucket.net_amount += toFloat(row?.sumup_net_amount)
    bucket.high_count += toInt(row?.sumup_high_count)
    bucket.low_count += toInt(row?.sumup_low_count)
    buckets.set(key, bucket)
  }

  return [...buckets.values()]
    .map((row) => ({
      ...row,
      gross_amount: round(row.gross_amount),
      fee_amount: round(row.fee_amount),
      net_amount: round(row.net_amount),
      gross_per_ticket: row.ticket_count ? round(row.gross_amount / row.ticket_count) : 0,
      net_per_ticket: row.ticket_count ? round(row.net_amount / row.ticket_count) : 0,
      net_per_event: row.event_count ? round(row.net_amount / row.event_count) : 0,
    }))
    .sort((a, b) => {
      if (b.net_amount !== a.net_amount) return b.net_amount - a.net_amount
      const nameCompare = String(a.venue_name || '').localeCompare(String(b.venue_name || ''))
      if (nameCompare !== 0) return nameCompare
      return String(a.venue_city || '').localeCompare(String(b.venue_city || ''))
    })
}

export function buildSalesTimeseries(rows = []) {
  const buckets = new Map()
  for (const row of rows) {
    if (!row?.event_date) continue
    const bucket = buckets.get(row.event_date) ?? {
      date: row.event_date,
      sumup_gross_amount: 0,
      sumup_fee_amount: 0,
      sumup_net_amount: 0,
      reservations: 0,
      eventbrite_orders: 0,
      events: 0,
    }
    bucket.sumup_gross_amount += toFloat(row?.sumup_gross_amount)
    bucket.sumup_fee_amount += toFloat(row?.sumup_fee_amount)
    bucket.sumup_net_amount += toFloat(row?.sumup_net_amount)
    bucket.reservations += toInt(row?.reservation_count)
    bucket.eventbrite_orders += toInt(row?.eventbrite_order_count)
    bucket.events += 1
    buckets.set(row.event_date, bucket)
  }

  return [...buckets.values()]
    .map((row) => ({
      ...row,
      sumup_gross_amount: round(row.sumup_gross_amount),
      sumup_fee_amount: round(row.sumup_fee_amount),
      sumup_net_amount: round(row.sumup_net_amount),
    }))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
}

function isCanceledStatus(status) {
  const s = String(status ?? '').toLowerCase()
  return s === 'canceled' || s === 'cancelled'
}

export function buildOccurrenceOverview(overview = {}, rows = []) {
  const venues = buildVenueRollup(rows)
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = rows.filter((row) => row?.event_date && row.event_date >= today && row?.event_status === 'live' && !isCanceledStatus(row?.event_status))
  return {
    ...overview,
    events_total: rows.length,
    upcoming_events: upcoming.length,
    venues_with_linked_income: venues.filter((venue) => venue.event_count > 0).length,
    linked_payouts: rows.reduce((sum, row) => sum + toInt(row?.sumup_payout_count), 0),
    total_reservations: rows.reduce((sum, row) => sum + toInt(row?.reservation_count), 0),
    total_eventbrite_orders: rows.reduce((sum, row) => sum + toInt(row?.eventbrite_order_count), 0),
    total_linked_net_income: round(rows.reduce((sum, row) => sum + toFloat(row?.sumup_net_amount), 0)),
    total_linked_gross_income: round(rows.reduce((sum, row) => sum + toFloat(row?.sumup_gross_amount), 0)),
    total_linked_fees: round(rows.reduce((sum, row) => sum + toFloat(row?.sumup_fee_amount), 0)),
    ignored_eventbrite_revenue_total: round(rows.reduce((sum, row) => sum + toFloat(row?.eventbrite_reported_amount_excluded), 0)),
  }
}
