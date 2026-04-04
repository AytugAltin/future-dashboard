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

/** Stable key for "same show line" (title + venue + city). */
export function showKey(row) {
  const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim()
  return `${norm(row.event_name)}|${norm(row.venue_name)}|${norm(row.venue_city)}`
}

/**
 * Match event titles against series_tracked.json (sync with backend tracked series).
 * Events that do not match are treated as standalone / other listings for grouping labels.
 */
export function classifyListing(eventName, seriesTracked) {
  const name = (eventName || '').toLowerCase()
  for (const s of seriesTracked?.series ?? []) {
    const needles = [s.name, ...(s.match || [])].filter(Boolean)
    for (const needle of needles) {
      const n = needle.toLowerCase().trim()
      if (n.length >= 5 && name.includes(n)) {
        return { kind: 'series', seriesId: s.series_id, shortLabel: 'Series' }
      }
    }
  }
  return { kind: 'standalone', shortLabel: 'Standalone' }
}

/** Eventbrite uses US spelling `canceled`; exclude from upcoming lists. */
function isCanceledStatus(status) {
  const s = (status || '').toLowerCase()
  return s === 'canceled' || s === 'cancelled'
}

export function buildUpcomingMetrics(eventsOverview, seriesTracked = { series: [] }) {
  const today = new Date().toISOString().slice(0, 10)
  const completed = eventsOverview.filter((row) => row.event_status === 'completed' && row.event_date < today)
  const upcoming = eventsOverview.filter((row) => {
    if (row.event_date < today) return false
    if (isCanceledStatus(row.event_status)) return false
    if (row.event_status !== 'live') return false
    if (/\bcancel(l)?ed\b/i.test(row.event_name || '')) return false
    return true
  })

  const rows = upcoming.map((row) => {
    const listing = classifyListing(row.event_name, seriesTracked)
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
      listing,
      showKey: sk,
      currentFill,
      rollingAvgReservations,
      rollingAvgFill,
      yearAvgReservations,
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
    return b.reservation_count - a.reservation_count
  })
}

/** Eventbrite public event pages use the numeric event id in the URL path. */
export function eventbriteEventUrl(eventId) {
  if (eventId == null || eventId === '') return null
  return `https://www.eventbrite.com/e/${eventId}`
}
