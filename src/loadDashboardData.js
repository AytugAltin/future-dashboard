import {
  createEmptyLedgerSnapshot,
  createEmptyUnmarkedTransactionQueue,
  hydrateLedgerSnapshot,
  hydrateUnmarkedTransactionQueue,
} from './finance/ledgerSchema.js'
import { buildOccurrenceOverview, buildSalesTimeseries, buildVenueRollup, collapseEventOccurrences } from './utils/occurrences.js'

/**
 * Loads dashboard JSON from public/data with cache-busting so replaced files
 * are not served from a stale browser cache after export/copy.
 *
 * Occurrence normalization is also applied client-side so older exports that
 * still contain duplicate Eventbrite listings for the same venue+datetime are
 * collapsed before the dashboard renders them.
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

  const fetchOptionalJson = async (file, fallback) => {
    try {
      const r = await fetch(dataUrl(file))
      if (!r.ok) return fallback
      return r.json()
    } catch {
      return fallback
    }
  }

  const [
    overviewRaw,
    rawEventsOverview,
    quality,
    seriesTracked,
    venueEconomics,
    occurrenceReservationHistory,
    salesLeadCurves,
    ledgerSnapshotRaw,
    unmarkedQueueRaw,
  ] = await Promise.all([
    fetchJson('overview.json'),
    fetchJson('events_overview.json'),
    fetchJson('quality.json'),
    fetchOptionalJson('series_tracked.json', { series: [] }),
    fetchOptionalJson('venue_economics.json', { schema_version: 1, venues: [] }),
    fetchOptionalJson('occurrence_reservation_history.json', { occurrences: [], assumptions: [] }),
    fetchOptionalJson('sales_lead_curves.json', { curves: [] }),
    fetchOptionalJson('ledger_snapshot.json', createEmptyLedgerSnapshot()),
    fetchOptionalJson('unmarked_transactions_queue.json', createEmptyUnmarkedTransactionQueue()),
  ])

  const eventsOverview = collapseEventOccurrences(rawEventsOverview)
  const overview = buildOccurrenceOverview(overviewRaw, eventsOverview)
  const venues = buildVenueRollup(eventsOverview)
  const salesTimeseries = buildSalesTimeseries(eventsOverview)

  return {
    overview,
    eventsOverview,
    venues,
    salesTimeseries,
    quality,
    seriesTracked,
    venueEconomics,
    occurrenceReservationHistory,
    salesLeadCurves,
    ledgerSnapshot: hydrateLedgerSnapshot(ledgerSnapshotRaw),
    unmarkedTransactionsQueue: hydrateUnmarkedTransactionQueue(unmarkedQueueRaw),
  }
}
