/**
 * Loads dashboard JSON from public/data with cache-busting so replaced files
 * are not served from a stale browser cache after export/copy.
 */
export async function loadDashboardData() {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  const bust = `_=${Date.now()}`
  const dataUrl = (file) => `${base}data/${file}?${bust}`

  const fetchJson = async (file) => {
    const r = await fetch(dataUrl(file))
    if (!r.ok) throw new Error(`${file}: ${r.status} ${r.statusText}`)
    return r.json()
  }

  const fetchSeriesTracked = async () => {
    try {
      const r = await fetch(dataUrl('series_tracked.json'))
      if (!r.ok) return { series: [] }
      return r.json()
    } catch {
      return { series: [] }
    }
  }

  const [overview, eventsOverview, venues, salesTimeseries, quality, seriesTracked] = await Promise.all([
    fetchJson('overview.json'),
    fetchJson('events_overview.json'),
    fetchJson('venues.json'),
    fetchJson('sales_timeseries.json'),
    fetchJson('quality.json'),
    fetchSeriesTracked(),
  ])

  return { overview, eventsOverview, venues, salesTimeseries, quality, seriesTracked }
}
