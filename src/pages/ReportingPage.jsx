import { useMemo } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../components/Card.jsx'
import { Section } from '../components/Section.jsx'
import { euro, intFmt } from '../formatters.js'

export function ReportingPage({ data, filters, onFiltersChange, onSelectEvent }) {
  const tsBounds = useMemo(() => {
    const ts = data.salesTimeseries ?? []
    if (!ts.length) return { min: '', max: '' }
    return { min: ts[0].date, max: ts[ts.length - 1].date }
  }, [data.salesTimeseries])

  const filteredTimeseries = useMemo(() => {
    const rows = data.salesTimeseries ?? []
    const from = filters.from || tsBounds.min
    const to = filters.to || tsBounds.max
    if (!from || !to) return rows
    return rows.filter((r) => r.date >= from && r.date <= to)
  }, [data.salesTimeseries, filters.from, filters.to, tsBounds.min, tsBounds.max])

  const filteredTopEvents = useMemo(() => {
    let rows = [...(data.eventsOverview ?? [])]
    if (filters.city) rows = rows.filter((r) => (r.venue_city || '') === filters.city)
    const q = filters.q.trim().toLowerCase()
    if (q) rows = rows.filter((r) => (r.event_name || '').toLowerCase().includes(q))
    if (filters.venue) {
      rows = rows.filter((r) => (r.venue_name || '') === filters.venue)
    }
    return rows.sort((a, b) => b.sumup_net_amount - a.sumup_net_amount).slice(0, 10)
  }, [data.eventsOverview, filters.q, filters.venue, filters.city])

  const filteredTopVenues = useMemo(() => {
    let rows = [...(data.venues ?? [])].sort((a, b) => b.net_amount - a.net_amount)
    if (filters.city) {
      rows = rows.filter((r) => (r.venue_city || '') === filters.city)
    }
    if (filters.venue) {
      rows = rows.filter((r) => (r.venue_name || '') === filters.venue)
    }
    return rows.slice(0, 10)
  }, [data.venues, filters.venue, filters.city])

  const venueOptions = useMemo(() => {
    let rows = data.eventsOverview ?? []
    if (filters.city) rows = rows.filter((r) => (r.venue_city || '') === filters.city)
    const set = new Set(rows.map((r) => r.venue_name).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [data.eventsOverview, filters.city])

  const cityOptions = useMemo(() => {
    const set = new Set((data.eventsOverview ?? []).map((r) => r.venue_city).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [data.eventsOverview])

  return (
    <div className="pageStack">
      <div className="filterBar">
        <label className="filterField">
          <span>Search events</span>
          <input
            type="search"
            value={filters.q}
            onChange={(e) => onFiltersChange({ q: e.target.value })}
            placeholder="Filter top events table…"
            autoComplete="off"
          />
        </label>
        <label className="filterField">
          <span>City</span>
          <select value={filters.city} onChange={(e) => onFiltersChange({ city: e.target.value })}>
            <option value="">All cities</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label className="filterField">
          <span>Venue</span>
          <select
            value={filters.venue}
            onChange={(e) => onFiltersChange({ venue: e.target.value })}
          >
            <option value="">All venues</option>
            {venueOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="filterField">
          <span>From</span>
          <input
            type="date"
            value={filters.from}
            min={tsBounds.min}
            max={tsBounds.max}
            onChange={(e) => onFiltersChange({ from: e.target.value })}
          />
        </label>
        <label className="filterField">
          <span>To</span>
          <input
            type="date"
            value={filters.to}
            min={tsBounds.min}
            max={tsBounds.max}
            onChange={(e) => onFiltersChange({ to: e.target.value })}
          />
        </label>
        <button type="button" className="filterReset" onClick={() => onFiltersChange({ from: '', to: '' })}>
          Reset date range
        </button>
        <p className="filterHint">
          Summary cards use the full export. Charts and tables respect filters; time charts use the date range (empty = full range).
        </p>
      </div>

      <div className="grid cards">
        <Card label="Tracked net income" value={euro.format(data.overview.total_linked_net_income)} />
        <Card label="Reservations" value={intFmt.format(data.overview.total_reservations)} subtext={`${intFmt.format(data.overview.total_eventbrite_orders)} Eventbrite orders`} />
        <Card label="Upcoming events" value={intFmt.format(data.overview.upcoming_events)} subtext={`${intFmt.format(data.overview.events_total)} total events`} />
        <Card label="Unmatched net" value={euro.format(data.overview.unmatched_net_amount)} subtext={`${intFmt.format(data.overview.unmatched_payouts)} payouts`} />
      </div>

      <div className="grid two-up">
        <Section title="Tracked income over time">
          <div className="chartWrap">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={filteredTimeseries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#24304e" />
                <XAxis dataKey="date" stroke="#a5b4fc" />
                <YAxis stroke="#a5b4fc" />
                <Tooltip />
                <Area type="monotone" dataKey="sumup_net_amount" stroke="#60a5fa" fill="#60a5fa33" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Reservations over time">
          <div className="chartWrap">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={filteredTimeseries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#24304e" />
                <XAxis dataKey="date" stroke="#a5b4fc" />
                <YAxis stroke="#a5b4fc" />
                <Tooltip />
                <Line type="monotone" dataKey="reservations" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <div className="grid two-up">
        <Section title="Confidence snapshot">
          <div className="qualityList">
            {Object.entries(data.quality.summary).map(([key, value]) => (
              <div key={key} className="qualityRow">
                <span>{key}</span>
                <strong>{intFmt.format(value)}</strong>
              </div>
            ))}
          </div>
          <p className="subtle">Ignored legacy Eventbrite revenue: {euro.format(data.overview.ignored_eventbrite_revenue_total)}</p>
        </Section>

        <Section title="Top venues by tracked net income">
          <div className="chartWrap">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={filteredTopVenues} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#24304e" />
                <XAxis type="number" stroke="#a5b4fc" />
                <YAxis dataKey="venue_name" type="category" width={140} stroke="#a5b4fc" />
                <Tooltip />
                <Bar dataKey="net_amount" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <Section title="Top events by tracked net income">
        <div className="tableWrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Event</th><th>Reservations</th><th>Net</th></tr>
            </thead>
            <tbody>
              {filteredTopEvents.map((row) => (
                <tr
                  key={row.event_id}
                  className="tableRowClickable"
                  onClick={() => onSelectEvent(row)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectEvent(row)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <td>{row.event_date}</td>
                  <td>{row.event_name}</td>
                  <td>{intFmt.format(row.reservation_count)}</td>
                  <td>{euro.format(row.sumup_net_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}
