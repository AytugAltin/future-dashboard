import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const euro = new Intl.NumberFormat('en-BE', { style: 'currency', currency: 'EUR' })
const intFmt = new Intl.NumberFormat('en-BE')

function Card({ label, value, subtext }) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {subtext ? <div className="subtext">{subtext}</div> : null}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export default function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/data/overview.json').then((r) => r.json()),
      fetch('/data/events_overview.json').then((r) => r.json()),
      fetch('/data/venues.json').then((r) => r.json()),
      fetch('/data/sales_timeseries.json').then((r) => r.json()),
      fetch('/data/quality.json').then((r) => r.json()),
      fetch('/data/upcoming_events.json').then((r) => r.json()),
    ]).then(([overview, eventsOverview, venues, salesTimeseries, quality, upcomingEvents]) => {
      setData({ overview, eventsOverview, venues, salesTimeseries, quality, upcomingEvents })
    })
  }, [])

  const topEvents = useMemo(() => (data?.eventsOverview ?? []).slice().sort((a, b) => b.sumup_net_amount - a.sumup_net_amount).slice(0, 10), [data])
  const topVenues = useMemo(() => (data?.venues ?? []).slice().sort((a, b) => b.net_amount - a.net_amount).slice(0, 10), [data])

  if (!data) return <div className="shell"><p>Loading dashboard…</p></div>

  return (
    <div className="shell">
      <header className="header">
        <div>
          <h1>Future Dashboard</h1>
          <p>2025+ view. Eventbrite = reservations. SumUp = tracked income.</p>
        </div>
        <div className="stamp">
          <div>From {data.overview.report_start_date}</div>
          <div>Export generated {new Date(data.overview.generated_at).toLocaleString()}</div>
          <div>Linked payouts TSV {new Date(data.overview.source_timestamps.linked_links_tsv_mtime).toLocaleString()}</div>
          <div>Eventbrite query {new Date(data.overview.source_timestamps.eventbrite_query_generated_at).toLocaleString()}</div>
        </div>
      </header>

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
              <AreaChart data={data.salesTimeseries}>
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
              <LineChart data={data.salesTimeseries}>
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
        <Section title="Upcoming events (sorted by reservations)">
          <div className="tableWrap">
            <table>
              <thead>
                <tr><th>Date</th><th>Event</th><th>Venue</th><th>Reservations</th></tr>
              </thead>
              <tbody>
                {data.upcomingEvents.slice(0, 10).map((row) => (
                  <tr key={row.event_id}>
                    <td>{row.event_date}</td>
                    <td>{row.event_name}</td>
                    <td>{row.venue_name}</td>
                    <td>{intFmt.format(row.reservation_count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

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
      </div>

      <div className="grid two-up">
        <Section title="Top events by tracked net income">
          <div className="tableWrap">
            <table>
              <thead>
                <tr><th>Date</th><th>Event</th><th>Reservations</th><th>Net</th></tr>
              </thead>
              <tbody>
                {topEvents.map((row) => (
                  <tr key={row.event_id}>
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

        <Section title="Top venues by tracked net income">
          <div className="chartWrap">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topVenues} layout="vertical" margin={{ left: 30 }}>
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

      <Section title="Reservation vs income samples">
        <div className="tableWrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Event</th><th>Reservations</th><th>Capacity</th><th>Fill</th><th>Tracked net</th><th>€/reservation</th></tr>
            </thead>
            <tbody>
              {data.eventsOverview.slice().sort((a, b) => b.reservation_count - a.reservation_count).slice(0, 12).map((row) => (
                <tr key={row.event_id}>
                  <td>{row.event_date}</td>
                  <td>{row.event_name}</td>
                  <td>{intFmt.format(row.reservation_count)}</td>
                  <td>{row.event_capacity ? intFmt.format(row.event_capacity) : '—'}</td>
                  <td>{row.reservation_fill_ratio != null ? `${Math.round(row.reservation_fill_ratio * 100)}%` : '—'}</td>
                  <td>{euro.format(row.sumup_net_amount)}</td>
                  <td>{euro.format(row.income_per_reservation)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}
