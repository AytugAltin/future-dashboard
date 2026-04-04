import { useMemo, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../components/Card.jsx'
import { Section } from '../components/Section.jsx'
import { ProgressBar } from '../components/ProgressBar.jsx'
import { euro, intFmt } from '../formatters.js'
import { avg, buildLogicalUpcomingRows, buildUpcomingMetrics, deltaClass, pillClass } from '../utils/metrics.js'

const fullDateFmt = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const monthLabelFmt = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
})

const rangeDateFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
})

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function parseYmd(ymd) {
  const [year, month, day] = String(ymd || '').split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function toYmd(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function startOfWeekMonday(date) {
  const day = (date.getDay() + 6) % 7
  return addDays(date, -day)
}

function endOfWeekSunday(date) {
  const day = (date.getDay() + 6) % 7
  return addDays(date, 6 - day)
}

function formatFullDate(eventDate) {
  const parsed = parseYmd(eventDate)
  return parsed ? fullDateFmt.format(parsed) : eventDate
}

function formatRangeDate(eventDate) {
  const parsed = parseYmd(eventDate)
  return parsed ? rangeDateFmt.format(parsed) : eventDate
}

function daysUntilLabel(daysUntil) {
  if (daysUntil == null) return '—'
  if (daysUntil < 0) return `${Math.abs(daysUntil)}d ago`
  if (daysUntil === 0) return 'Today'
  if (daysUntil === 1) return '1 day'
  return `${daysUntil} days`
}

function countdownText(daysUntil) {
  if (daysUntil == null) return 'countdown unavailable'
  if (daysUntil === 0) return 'today'
  if (daysUntil > 0) return `in ${daysUntilLabel(daysUntil)}`
  return daysUntilLabel(daysUntil)
}

function buildCalendarMonths(rows) {
  if (!rows.length) return []

  const byDate = new Map()
  for (const row of rows) {
    if (!byDate.has(row.event_date)) byDate.set(row.event_date, [])
    byDate.get(row.event_date).push(row)
  }

  const firstDate = parseYmd(rows[0].event_date)
  const lastDate = parseYmd(rows[rows.length - 1].event_date)
  if (!firstDate || !lastDate) return []

  const months = []
  let cursor = startOfMonth(firstDate)
  const finalMonth = startOfMonth(lastDate)

  while (cursor <= finalMonth) {
    const monthStart = startOfMonth(cursor)
    const monthEnd = endOfMonth(cursor)
    const gridStart = startOfWeekMonday(monthStart)
    const gridEnd = endOfWeekSunday(monthEnd)
    const days = []
    let dayCursor = gridStart

    while (dayCursor <= gridEnd) {
      const ymd = toYmd(dayCursor)
      days.push({
        key: ymd,
        ymd,
        date: new Date(dayCursor),
        inMonth: dayCursor.getMonth() === monthStart.getMonth(),
        events: byDate.get(ymd) ?? [],
      })
      dayCursor = addDays(dayCursor, 1)
    }

    months.push({
      key: `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`,
      label: monthLabelFmt.format(cursor),
      eventCount: rows.filter((row) => {
        const rowDate = parseYmd(row.event_date)
        return rowDate && rowDate.getFullYear() === cursor.getFullYear() && rowDate.getMonth() === cursor.getMonth()
      }).length,
      days,
    })

    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
  }

  return months
}

export function HomePage({ data, filters, onFiltersChange, onSelectEvent }) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const upcomingMetrics = useMemo(
    () => buildUpcomingMetrics(data.eventsOverview),
    [data.eventsOverview]
  )

  const cityOptions = useMemo(() => {
    const s = new Set(upcomingMetrics.map((r) => r.venue_city).filter(Boolean))
    return [...s].sort((a, b) => a.localeCompare(b))
  }, [upcomingMetrics])

  const filteredUpcomingRows = useMemo(() => {
    let rows = upcomingMetrics
    if (filters.city) rows = rows.filter((r) => (r.venue_city || '') === filters.city)
    const q = filters.q.trim().toLowerCase()
    if (q) rows = rows.filter((r) => (r.event_name || '').toLowerCase().includes(q))
    if (filters.venue) rows = rows.filter((r) => (r.venue_name || '') === filters.venue)
    return rows
  }, [upcomingMetrics, filters.city, filters.q, filters.venue])

  const logicalUpcoming = useMemo(() => buildLogicalUpcomingRows(filteredUpcomingRows), [filteredUpcomingRows])

  const venueOptions = useMemo(() => {
    let rows = upcomingMetrics
    if (filters.city) rows = rows.filter((r) => (r.venue_city || '') === filters.city)
    const set = new Set(rows.map((r) => r.venue_name).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [upcomingMetrics, filters.city])

  const citySnapshot = useMemo(() => {
    const m = new Map()
    for (const row of logicalUpcoming) {
      const c = row.venue_city || '—'
      if (!m.has(c)) m.set(c, { city: c, shows: 0, tickets: 0, fills: [] })
      const bucket = m.get(c)
      bucket.shows += 1
      bucket.tickets += row.reservation_count
      if (row.currentFill != null) bucket.fills.push(row.currentFill)
    }
    return [...m.values()]
      .map((x) => ({
        city: x.city,
        shows: x.shows,
        tickets: x.tickets,
        avgFill: x.fills.length ? avg(x.fills) : null,
      }))
      .sort((a, b) => b.tickets - a.tickets)
  }, [logicalUpcoming])

  const calendarMonths = useMemo(() => buildCalendarMonths(logicalUpcoming), [logicalUpcoming])

  const visibleRangeLabel = useMemo(() => {
    if (!logicalUpcoming.length) return 'No upcoming shows in current filters'
    return `${formatRangeDate(logicalUpcoming[0].event_date)} → ${formatRangeDate(logicalUpcoming[logicalUpcoming.length - 1].event_date)}`
  }, [logicalUpcoming])

  const mergedListingCount = logicalUpcoming.filter((row) => row.isOccurrenceMerged).length
  const upcomingShows = logicalUpcoming.length
  const upcomingReservations = logicalUpcoming.reduce((sum, row) => sum + row.reservation_count, 0)
  const avgUpcomingFill = avg(logicalUpcoming.filter((row) => row.currentFill != null).map((row) => row.currentFill))
  const avgTrendVsPrev = avg(logicalUpcoming.filter((row) => row.trendVsPrev != null).map((row) => row.trendVsPrev))

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
        <Card label="Average fill" value={avgUpcomingFill == null ? '—' : `${Math.round(avgUpcomingFill)}%`} subtext="Logical upcoming shows with capacity" />
        <Card
          label="Vs last same show"
          value={avgTrendVsPrev == null ? '—' : `${avgTrendVsPrev > 0 ? '+' : ''}${Math.round(avgTrendVsPrev)}`}
          subtext="Avg ticket delta vs previous date when one title maps cleanly"
        />
      </div>
      <p className="heroFootnote">
        Tracked net income (export total): <strong>{euro.format(data.overview.total_linked_net_income)}</strong>
        {' · '}
        Canonical dashboard unit: one logical occurrence per venue + start datetime, with duplicate Eventbrite listings collapsed underneath it.
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
            <strong>Calendar first.</strong> The grid shows exact dates, visible gaps, and logical show lines collapsed by date + time + venue.
          </div>
          <div className="summaryMeta">
            <span className="metaChip">{intFmt.format(upcomingShows)} logical shows</span>
            <span className="metaChip">Range {visibleRangeLabel}</span>
            {mergedListingCount ? <span className="metaChip">{intFmt.format(mergedListingCount)} merged rows</span> : null}
          </div>
        </div>

        {logicalUpcoming.length ? (
          <div className="calendarStack">
            <div className="calendarMonths">
              {calendarMonths.map((month) => (
                <div key={month.key} className="calendarMonthCard">
                  <div className="calendarMonthHeader">
                    <h3>{month.label}</h3>
                    <span className="calendarMonthMeta">{intFmt.format(month.eventCount)} show{month.eventCount === 1 ? '' : 's'}</span>
                  </div>

                  <div className="calendarWeekdays" aria-hidden="true">
                    {weekdayLabels.map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>

                  <div className="calendarGrid">
                    {month.days.map((day) => (
                      <div
                        key={day.key}
                        className={`calendarDay ${day.inMonth ? '' : 'calendarDayOutside'} ${day.events.length ? 'calendarDayHasEvents' : ''}`}
                      >
                        <div className="calendarDayHeader">
                          <span className="calendarDayNumber">{day.date.getDate()}</span>
                        </div>

                        {day.inMonth ? (
                          <div className="calendarDayBody">
                            {day.events.length ? (
                              day.events.map((row) => (
                                <button
                                  type="button"
                                  key={row.occurrence_id}
                                  className="calendarEventChip"
                                  onClick={() => onSelectEvent(row)}
                                  title={`${row.event_name} — ${formatFullDate(row.event_date)} · ${row.local_time || 'time TBD'} · ${daysUntilLabel(row.daysUntil)}`}
                                >
                                  <span className="calendarEventTitle">{row.event_name}</span>
                                  <span className="calendarEventMeta">
                                    {row.local_time || 'TBD'} · {daysUntilLabel(row.daysUntil)}
                                  </span>
                                  <span className="calendarEventStats">
                                    {intFmt.format(row.reservation_count)} tickets{row.event_capacity ? ` / ${intFmt.format(row.event_capacity)} cap` : ''}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="calendarEmpty">No show</div>
                            )}
                          </div>
                        ) : (
                          <div className="calendarDayBody">
                            <div className="calendarEmpty calendarEmptyMuted">—</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="upcomingListLabel">Logical show lines</div>
            <div className="upcomingScroller">
              {logicalUpcoming.map((row) => {
                const fillPercent = row.currentFill == null ? null : Math.round(row.currentFill)
                return (
                  <button
                    type="button"
                    key={row.occurrence_id}
                    className="upcomingRow upcomingRowButton"
                    onClick={() => onSelectEvent(row)}
                  >
                    <div className="upcomingTop">
                      <div>
                        <div className="rowTitleRow">
                          {row.isOccurrenceMerged ? (
                            <span className="groupBadge" title="Collapsed same date + time + venue listings into one logical show line">
                              Merged {row.source_events_count} listings
                            </span>
                          ) : null}
                          {row.hasMergedTitles ? (
                            <span className="groupBadge" title="Paired titles are shown as one logical line for this occurrence">
                              {row.title_count} paired titles
                            </span>
                          ) : null}
                        </div>
                        <div className="rowTitle">{row.event_name}</div>
                        <div className="rowMeta">
                          {formatFullDate(row.event_date)} · {row.local_time || 'time TBD'} · {row.venue_name}
                          {row.venue_city ? ` · ${row.venue_city}` : ''}
                          {' · '}
                          {countdownText(row.daysUntil)}
                        </div>
                      </div>
                      <div className="rowNumbers">
                        <div className="bigNumber">{intFmt.format(row.reservation_count)}{row.event_capacity ? ` / ${intFmt.format(row.event_capacity)}` : ''}</div>
                        <div className="smallMuted">tickets{row.event_capacity ? ' / cap' : ''}</div>
                      </div>
                    </div>

                    <div className="trendStrip">
                      {row.hasMergedTitles ? (
                        <span className="trendLine">Merged related titles into one logical show line for this exact date, time, and venue.</span>
                      ) : row.isOccurrenceMerged ? (
                        <span className="trendLine">Collapsed duplicate Eventbrite listings into one occurrence line.</span>
                      ) : row.prevShowDate != null ? (
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
          </div>
        ) : (
          <div className="emptyUpcomingState">No upcoming shows match the current filters.</div>
        )}
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
