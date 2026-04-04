import { useCallback, useEffect, useRef, useState } from 'react'
import { EventDetailModal } from './components/EventDetailModal.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { ReportingPage } from './pages/ReportingPage.jsx'
import { loadDashboardData } from './loadDashboardData.js'
import { parseDashboardURL, replaceUrlWithState } from './urlState.js'

function useEscapeCloses(open, onClose) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
}

export default function App() {
  const [data, setData] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(() => parseDashboardURL())
  const [detailEvent, setDetailEvent] = useState(null)
  const closeDetail = useCallback(() => setDetailEvent(null), [])
  useEscapeCloses(!!detailEvent, closeDetail)

  const [autoRefresh, setAutoRefresh] = useState(() => sessionStorage.getItem('bcn-dash-auto') === '1')
  const runLoadRef = useRef(() => {})

  const runLoad = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const next = await loadDashboardData()
      setData(next)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setLoadError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  runLoadRef.current = runLoad

  useEffect(() => {
    runLoad()
  }, [runLoad])

  useEffect(() => {
    sessionStorage.setItem('bcn-dash-auto', autoRefresh ? '1' : '0')
    if (!autoRefresh) return
    const id = window.setInterval(() => runLoadRef.current(), 5 * 60 * 1000)
    return () => window.clearInterval(id)
  }, [autoRefresh])

  useEffect(() => {
    replaceUrlWithState(filters)
  }, [filters])

  const onFiltersChange = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const setPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  if (loadError) {
    return (
      <div className="shell">
        <p className="loadError">Could not load dashboard data.</p>
        <p className="loadErrorDetail">{loadError}</p>
        <p className="subtext">Ensure export JSON is present under <code>public/data/</code> and try Reload data.</p>
        <p className="subtext">
          <button type="button" className="reloadBtn" onClick={() => runLoad()} disabled={loading}>
            {loading ? 'Loading…' : 'Reload data'}
          </button>
        </p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="shell">
        <p>Loading dashboard…</p>
      </div>
    )
  }

  return (
    <div className="shell">
      <header className="header">
        <div>
          <h1>I2 Comedy Organisation Dashboard</h1>
          <p>Reservations, tracked income, and event health.</p>
        </div>
        <div className="headerRight">
          <div className="headerActions">
            <label className="autoRefreshLabel">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-refresh (5 min)
            </label>
            <button type="button" className="reloadBtn" onClick={() => runLoad()} disabled={loading} title="Fetch JSON again (cache-busted)">
              {loading ? 'Loading…' : 'Reload data'}
            </button>
          </div>
          <div className="stamp">
            <div>From {data.overview.report_start_date}</div>
            <div>Export generated {new Date(data.overview.generated_at).toLocaleString()}</div>
            <div>Linked payouts TSV {new Date(data.overview.source_timestamps.linked_links_tsv_mtime).toLocaleString()}</div>
            <div>Eventbrite query {new Date(data.overview.source_timestamps.eventbrite_query_generated_at).toLocaleString()}</div>
          </div>
        </div>
      </header>

      <div className="tabs">
        <button type="button" className={filters.page === 'home' ? 'tab active' : 'tab'} onClick={() => setPage('home')}>
          Home
        </button>
        <button type="button" className={filters.page === 'reporting' ? 'tab active' : 'tab'} onClick={() => setPage('reporting')}>
          Current reporting page
        </button>
      </div>

      {filters.page === 'home' ? (
        <HomePage data={data} filters={filters} onFiltersChange={onFiltersChange} onSelectEvent={setDetailEvent} />
      ) : (
        <ReportingPage data={data} filters={filters} onFiltersChange={onFiltersChange} onSelectEvent={setDetailEvent} />
      )}

      {detailEvent ? <EventDetailModal event={detailEvent} onClose={closeDetail} /> : null}
    </div>
  )
}
