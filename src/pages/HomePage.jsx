import { useMemo, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../components/Card.jsx'
import { Section } from '../components/Section.jsx'
import { ProgressBar } from '../components/ProgressBar.jsx'
import { euro, intFmt } from '../formatters.js'
import { avg, buildUpcomingMetrics, deltaClass, pillClass } from '../utils/metrics.js'

export function HomePage({ data, filters, onFiltersChange, onSelectEvent }) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const upcomingMetrics = useMemo(
    () => buildUpcomingMetrics(data.eventsOverview, data.seriesTracked ?? { series: [] }),
    [data.eventsOverview, data.seriesTracked]
  )

  const cityOptions = useMemo(() => {
    const s = new Set(upcomingMetrics.map((r) => r.venue_city).filter(Boolean))
    return [...s].sort((a, b) => a.localeCompare(b))
  }, [upcomingMetrics])

  const filteredUpcoming = useMemo(() => {
    let rows = upcomingMetrics
    if (filters.city) rows = rows.filter((r) => (r.venue_city || '') === filters.city)
    const q = filters.q.trim().toLowerCase()
    if (q) rows = rows.filter((r) => (r.event_name || '').toLowerCase().includes(q))
    if (filters.venue) rows = rows.filter((r) => (r.venue_name || '') === filters.venue)
    return rows
  }, [upcomingMetrics, filters.city, filters.q, filters.venue])

  const venueOptions = useMemo(() => {
    let rows = upcomingMetrics
    if (filters.city) rows = rows.filter((r) => (r.venue_city || '') === filters.city)
    const set = new Set(rows.map((r) => r.venue_name).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [upcomingMetrics, filters.city])

  const citySnapshot = useMemo(() => {
    const m = new Map()
    for (const row of filteredUpcoming) {
      const c = row.venue_city || '—'
      if (!m.has(c)) m.set(c, { city: c, shows: 0, tickets: 0, fills: [] })
      const b = m.get(c)
      b.shows += 1
      b.tickets += row.reservation_count
      if (row.currentFill != null) b.fills.push(row.currentFill)
    }
    return [...m.values()]
      .map((x) => ({
        city: x.city,
        shows: x.shows,
        tickets: x.tickets,
        avgFill: x.fills.length ? avg(x.fills) : null,
      }))
      .sort((a, b) => b.tickets - a.tickets)
  }, [filteredUpcoming])

  const upcomingShows = filteredUpcoming.length
  const upcomingReservations = filteredUpcoming.reduce((sum, row) => sum + row.reservation_count, 0)
  const avgUpcomingFill = avg(filteredUpcoming.filter((row) => row.currentFill != null).map((row) => row.currentFill))
  const avgTrendVsPrev = avg(filteredUpcoming.filter((row) => row.trendVsPrev != null).map((row) => row.trendVsPrev))

  return (
    <div className="pageStack">
      <div className="cityStrip">
        <span className="cityStripLabel">City</span>
        <div className="cityPills" role="tablist" aria-label="Filter by city">
          <button
            type="button"
            role="tab"
            aria-selected={!filters.city}
            className={`cityPill ${!filters.city ? 'active' : ''}`}
            onClick={() => onFiltersChange({ city: '' })}
          >
            All
          </button>
          {cityOptions.map((city) => (
            <button
              type="button"
              key={city}
              role="tab"
              aria-selected={filters.city === city}
              className={`cityPill ${filters.city === city ? 'active' : ''}`}
              onClick={() => onFiltersChange({ city })}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="heroSimple grid cards heroCards3">
        <Card label="Upcoming shows" value={intFmt.format(upcomingShows)} subtext={`${intFmt.format(upcomingReservations)} tickets`} />
        <Card label="Average fill" value={avgUpcomingFill == null ? '—' : `${Math.round(avgUpcomingFill)}%`} subtext="Filtered upcoming with capacity" />
        <Card
          label="Vs last same show"
          value={avgTrendVsPrev == null ? '—' : `${avgTrendVsPrev > 0 ? '+' : ''}${Math.round(avgTrendVsPrev)}`}
          subtext="Avg ticket delta vs previous date (same title + venue + city)"
        />
      </div>
      <p className="heroFootnote">
        Tracked net income (export total): <strong>{euro.format(data.overview.total_linked_net_income)}</strong>
        {' · '}
        Series vs standalone uses <code>series_tracked.json</code> (match tracked Eventbrite series titles).
      </p>

      <button type="button" className="filterToggle" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen}>
        {filtersOpen ? '▼ Hide search & venue' : '▶ Search & venue filters'}
      </button>

      {filtersOpen ? (
        <div className="filterBar">
          <label className="filterField">
            <span>Search events</span>
            <input
              type="search"
              value={filters.q}
              onChange={(e) => onFiltersChange({ q: e.target.value })}
              placeholder="Event name…"
              autoComplete="off"
            />
          </label>
          <label className="filterField">
            <span>Venue</span>
            <select value={filters.venue} onChange={(e) => onFiltersChange({ venue: e.target.value })}>
              <option value="">All venues{cityOptions.length ? ' (in city scope)' : ''}</option>
              {venueOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <Section title="Upcoming shows">
        <div className="upcomingSummary">
          <div className="summaryText">
            <strong>Series</strong> = title matches a tracked series in config. <strong>Standalone</strong> = everything else. Same title + venue rows are grouped for ticket totals.
          </div>
          <div className="summaryMeta">
            <span className="metaChip">{intFmt.format(upcomingShows)} shown</span>
            <span className="metaChip">{intFmt.format(upcomingReservations)} tickets</span>
          </div>
        </div>

        <div className="upcomingScroller">
          {filteredUpcoming.map((row) => {
            const fillPercent = row.currentFill == null ? null : Math.round(row.currentFill)
            const listing = row.listing
            return (
              <button
                type="button"
                key={row.event_id}
                className="upcomingRow upcomingRowButton"
                onClick={() => onSelectEvent(row)}
              >
                <div className="upcomingTop">
                  <div>
                    <div className="rowTitleRow">
                      <span className={`listingBadge ${listing.kind === 'series' ? 'series' : 'standalone'}`}>{listing.shortLabel}</span>
                      {row.groupSize > 1 ? (
                        <span className="groupBadge" title="Same show line (title + venue + city)">
                          ×{row.groupSize} dates · {intFmt.format(row.groupReservationsTotal)} tickets total
                        </span>
                      ) : null}
                    </div>
                    <div className="rowTitle">{row.event_name}</div>
                    <div className="rowMeta">{row.event_date} · {row.venue_name}{row.venue_city ? ` · ${row.venue_city}` : ''}</div>
                  </div>
                  <div className="rowNumbers">
                    <div className="bigNumber">{intFmt.format(row.reservation_count)}{row.event_capacity ? ` / ${intFmt.format(row.event_capacity)}` : ''}</div>
                    <div className="smallMuted">tickets{row.event_capacity ? ' / cap' : ''}</div>
                  </div>
                </div>

                <div className="trendStrip">
                  {row.prevShowDate != null ? (
                    <span className="trendLine">
                      Last same show {row.prevShowDate}: {intFmt.format(row.prevShowReservations)} tickets
                      {row.trendVsPrev != null ? (
                        <span className={`trendDelta ${deltaClass(row.trendVsPrev)}`}>
                          {' '}
                          ({row.trendVsPrev > 0 ? '+' : ''}
                          {row.trendVsPrev} vs now
                          {row.trendPct != null ? ` · ${row.trendPct > 0 ? '+' : ''}${Math.round(row.trendPct)}%` : ''})
                        </span>
                      ) : null}
                    </span>
                  ) : (
                    <span className="trendLine muted">No prior same show in export</span>
                  )}
                </div>

                {row.historyTrail?.length >= 2 ? (
                  <div className="miniSparkWrap">
                    <span className="sparkLabel">Ticket trend (last {row.historyTrail.length} past shows)</span>
                    <div className="miniSpark">
                      <ResponsiveContainer width="100%" height={48}>
                        <LineChart data={row.historyTrail} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <XAxis dataKey="date" hide />
                          <YAxis hide domain={['auto', 'auto']} />
                          <Tooltip
                            contentStyle={{ background: '#0f172a', border: '1px solid #23304f' }}
                            labelFormatter={(d) => String(d)}
                          />
                          <Line type="monotone" dataKey="reservations" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : null}

                <div className="progressBlock">
                  <ProgressBar percent={fillPercent ?? 0} />
                  <div className="progressMeta">
                    <span className={pillClass(fillPercent)}>{fillPercent == null ? 'No cap' : `${fillPercent}% full`}</span>
                    <span className={`delta ${deltaClass(row.deltaVsRolling)}`}>
                      {row.deltaVsRolling == null ? 'No rolling baseline' : `${row.deltaVsRolling > 0 ? '+' : ''}${Math.round(row.deltaVsRolling)} vs venue rolling avg`}
                    </span>
                  </div>
                </div>

                <div className="metricsGrid">
                  <div className="metricBox">
                    <span>Venue rolling avg</span>
                    <strong>{row.rollingAvgReservations == null ? '—' : intFmt.format(Math.round(row.rollingAvgReservations))}</strong>
                  </div>
                  <div className="metricBox">
                    <span>Venue rolling fill</span>
                    <strong>{row.rollingAvgFill == null ? '—' : `${Math.round(row.rollingAvgFill)}%`}</strong>
                  </div>
                  <div className="metricBox">
                    <span>Venue year avg</span>
                    <strong>{row.yearAvgReservations == null ? '—' : intFmt.format(Math.round(row.yearAvgReservations))}</strong>
                  </div>
                  <div className="metricBox">
                    <span>Tracked net</span>
                    <strong>{euro.format(row.sumup_net_amount)}</strong>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </Section>

      <details className="insightsPanel">
        <summary>City snapshot (current filters)</summary>
        <div className="insightsTableWrap">
          <table className="insightsTable">
            <thead>
              <tr>
                <th>City</th>
                <th>Shows</th>
                <th>Tickets</th>
                <th>Avg fill</th>
              </tr>
            </thead>
            <tbody>
              {citySnapshot.map((row) => (
                <tr key={row.city}>
                  <td>{row.city}</td>
                  <td>{intFmt.format(row.shows)}</td>
                  <td>{intFmt.format(row.tickets)}</td>
                  <td>{row.avgFill == null ? '—' : `${Math.round(row.avgFill)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
