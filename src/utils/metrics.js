export function avg(values) {
  if (!values.length) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function pillClass(value) {
  if (value == null) return 'pill neutral'
  if (value >= 60) return 'pill good'
  if (value >= 25) return 'pill warn'
  return 'pill bad'
}

export function deltaClass(value) {
  if (value == null) return 'delta neutral'
  if (value > 0) return 'delta good'
  if (value < 0) return 'delta bad'
  return 'delta neutral'
}

function norm(value) {
  return (value || '').toLowerCase().replace(/\s+/g, ' ').trim()
}

function parseYmd(ymd) {
  const [year, month, day] = String(ymd || '').split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function toYmdInTimeZone(date, timeZone = 'Europe/Brussels') {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function daysUntilDate(eventDate, timeZone = 'Europe/Brussels') {
  const target = parseYmd(eventDate)
  const today = parseYmd(toYmdInTimeZone(new Date(), timeZone))
  if (!target || !today) return null
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

/** Stable key for "same show line" (title + venue + city). */
export function showKey(row) {
  return `${norm(row.event_name)}|${norm(row.venue_name)}|${norm(row.venue_city)}`
}

/**
 * Canonical occurrence identity is venue/location + start datetime.
 * Prefer exported `occurrence_id`, but keep a deterministic fallback so older
 * JSON snapshots still collapse duplicate Eventbrite listings in the UI.
 */
export function occurrenceKey(row) {
  if (row?.occurrence_id) return row.occurrence_id
  return [norm(row.venue_name), norm(row.venue_city), row.event_date, row.local_time || '', row.timezone || ''].join('|')
}

export function findOccurrenceHistory(row, historyData) {
  const occurrences = historyData?.occurrences ?? []
  const key = occurrenceKey(row)
  const candidateEventIds = [
    ...(row?.eventbrite_event_ids?.length ? row.eventbrite_event_ids : []),
    ...(row?.source_event_ids?.length ? row.source_event_ids : []),
    row?.primary_eventbrite_event_id,
    row?.event_id,
  ]
    .filter(Boolean)
    .map((value) => String(value))

  return (
    occurrences.find((item) => item.occurrence_id === key || item.occurrence_key === key) ??
    occurrences.find((item) => {
      const sourceEventIds = (item.source_event_ids ?? []).map((value) => String(value))
      return candidateEventIds.some((eventId) => sourceEventIds.includes(eventId))
    }) ??
    null
  )
}

export function mergeEventNames(names) {
  const unique = [...new Set((names || []).map((name) => String(name || '').trim()).filter(Boolean))]
  if (!unique.length) return 'Untitled show'
  if (unique.length === 1) return unique[0]
  if (unique.length === 2) return `${unique[0]} + ${unique[1]}`
  return `${unique[0]} + ${unique.length - 1} more`
}

/** Eventbrite uses US spelling `canceled`; exclude from upcoming lists. */
function isCanceledStatus(status) {
  const s = (status || '').toLowerCase()
  return s === 'canceled' || s === 'cancelled'
}

export function buildUpcomingMetrics(eventsOverview) {
  const today = toYmdInTimeZone(new Date(), 'Europe/Brussels')
  const completed = eventsOverview.filter((row) => row.event_status === 'completed' && row.event_date < today)
  const upcoming = eventsOverview.filter((row) => {
    if (row.event_date < today) return false
    if (isCanceledStatus(row.event_status)) return false
    if (row.event_status !== 'live') return false
    if (/\bcancel(l)?ed\b/i.test(row.event_name || '')) return false
    return true
  })

  const rows = upcoming.map((row) => {
    const sk = showKey(row)
    const venuePast = completed
      .filter((past) => past.venue_name === row.venue_name && past.event_date < row.event_date)
      .sort((a, b) => b.event_date.localeCompare(a.event_date))

    const rolling = venuePast.slice(0, 5)
    const yearPast = venuePast.filter((past) => String(past.event_date).startsWith(String(row.event_date).slice(0, 4)))

    const currentFill = row.event_capacity ? (row.reservation_count / row.event_capacity) * 100 : null
    const rollingAvgReservations = avg(rolling.map((item) => item.reservation_count))
    const rollingAvgFill = avg(
      rolling
        .filter((item) => item.event_capacity)
        .map((item) => (item.reservation_count / item.event_capacity) * 100)
    )
    const yearAvgReservations = avg(yearPast.map((item) => item.reservation_count))

    const prevSameShow = completed
      .filter((p) => showKey(p) === sk && p.event_date < row.event_date)
      .sort((a, b) => b.event_date.localeCompare(a.event_date))
    const prevShow = prevSameShow[0] ?? null

    const historyTrail = completed
      .filter((p) => showKey(p) === sk)
      .sort((a, b) => a.event_date.localeCompare(b.event_date))
      .slice(-5)
      .map((p) => ({ date: p.event_date, reservations: p.reservation_count }))

    const trendVsPrev = prevShow == null ? null : row.reservation_count - prevShow.reservation_count
    const trendPct =
      prevShow == null || !prevShow.reservation_count
        ? null
        : ((row.reservation_count - prevShow.reservation_count) / prevShow.reservation_count) * 100

    return {
      ...row,
      showKey: sk,
      occurrence_id: row.occurrence_id ?? occurrenceKey(row),
      currentFill,
      rollingAvgReservations,
      rollingAvgFill,
      yearAvgReservations,
      daysUntil: daysUntilDate(row.event_date, row.timezone || 'Europe/Brussels'),
      deltaVsRolling: rollingAvgReservations == null ? null : row.reservation_count - rollingAvgReservations,
      prevShowDate: prevShow?.event_date ?? null,
      prevShowReservations: prevShow?.reservation_count ?? null,
      trendVsPrev,
      trendPct,
      historyTrail,
    }
  })

  const keyCount = new Map()
  const keyRes = new Map()
  for (const row of rows) {
    keyCount.set(row.showKey, (keyCount.get(row.showKey) || 0) + 1)
    keyRes.set(row.showKey, (keyRes.get(row.showKey) || 0) + row.reservation_count)
  }

  const enriched = rows.map((row) => ({
    ...row,
    groupSize: keyCount.get(row.showKey) || 1,
    groupReservationsTotal: keyRes.get(row.showKey) ?? row.reservation_count,
  }))

  return enriched.sort((a, b) => {
    const aDate = a.event_date.localeCompare(b.event_date)
    if (aDate !== 0) return aDate
    const timeCompare = String(a.local_time || '').localeCompare(String(b.local_time || ''))
    if (timeCompare !== 0) return timeCompare
    return b.reservation_count - a.reservation_count
  })
}

export function buildLogicalUpcomingRows(upcomingRows) {
  const groups = new Map()

  for (const row of upcomingRows) {
    const key = occurrenceKey(row)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(row)
  }

  return [...groups.entries()]
    .map(([key, rows]) => {
      const sortedRows = [...rows].sort((a, b) => b.reservation_count - a.reservation_count)
      const primary = sortedRows[0]
      const titles = [...new Set(sortedRows.flatMap((row) => row.eventbrite_titles?.length ? row.eventbrite_titles : [row.event_name]).filter(Boolean))]
      const sourceEventIds = [...new Set(sortedRows.flatMap((row) => row.eventbrite_event_ids?.length ? row.eventbrite_event_ids : [row.event_id]).filter(Boolean))]
      const sourceUrls = [...new Set(sortedRows.flatMap((row) => row.eventbrite_urls?.length ? row.eventbrite_urls : [row.eventbrite_url]).filter(Boolean))]
      const sourceEventsCount = sortedRows.reduce((sum, row) => sum + (row.merged_event_count || 1), 0)
      const reservationCount = sortedRows.reduce((sum, row) => sum + (row.reservation_count || 0), 0)
      const eventCapacity = sortedRows.reduce((max, row) => Math.max(max, row.event_capacity || 0), 0) || null
      const currentFill = eventCapacity ? (reservationCount / eventCapacity) * 100 : null
      const mergedTitles = titles.length > 1
      const mergedListings = sourceEventsCount > 1

      return {
        ...primary,
        occurrence_id: key,
        event_id: primary.event_id,
        primary_eventbrite_event_id: primary.primary_eventbrite_event_id ?? primary.event_id,
        eventbrite_event_ids: sourceEventIds,
        eventbrite_urls: sourceUrls,
        eventbrite_url: sourceUrls[0] ?? primary.eventbrite_url,
        event_name: mergeEventNames(titles),
        display_title: mergeEventNames(titles),
        source_event_ids: sourceEventIds,
        source_titles: titles,
        source_events_count: sourceEventsCount,
        merged_event_count: sourceEventsCount,
        title_count: titles.length,
        isOccurrenceMerged: mergedListings,
        hasMergedTitles: mergedTitles,
        reservation_count: reservationCount,
        event_capacity: eventCapacity,
        eventbrite_order_count: sortedRows.reduce((sum, row) => sum + (row.eventbrite_order_count || 0), 0),
        sumup_net_amount: sortedRows.reduce((sum, row) => sum + (row.sumup_net_amount || 0), 0),
        currentFill,
        reservation_fill_ratio: eventCapacity ? reservationCount / eventCapacity : null,
        daysUntil: daysUntilDate(primary.event_date, primary.timezone || 'Europe/Brussels'),
        prevShowDate: mergedTitles ? null : primary.prevShowDate,
        prevShowReservations: mergedTitles ? null : primary.prevShowReservations,
        trendVsPrev: mergedTitles ? null : primary.trendVsPrev,
        trendPct: mergedTitles ? null : primary.trendPct,
        historyTrail: mergedTitles ? [] : primary.historyTrail,
      }
    })
    .sort((a, b) => {
      const aDate = a.event_date.localeCompare(b.event_date)
      if (aDate !== 0) return aDate
      const timeCompare = String(a.local_time || '').localeCompare(String(b.local_time || ''))
      if (timeCompare !== 0) return timeCompare
      return b.reservation_count - a.reservation_count
    })
}

/** Eventbrite public event pages use the numeric event id in the URL path. */
export function eventbriteEventUrl(eventId) {
  if (eventId == null || eventId === '') return null
  return `https://www.eventbrite.com/e/${eventId}`
}
