import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const euro = new Intl.NumberFormat('en-BE', { style: 'currency', currency: 'EUR' })
const intFmt = new Intl.NumberFormat('en-BE')

function Card({ label, value, subtext, children }) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {subtext ? <div className="subtext">{subtext}</div> : null}
      {children}
    </div>
  )
}

function Section({ title, children, actions }) {
  return (
    <section className="section">
      <div className="sectionHeader">
        <h2>{title}</h2>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}

function pillClass(value) {
  if (value == null) return 'pill neutral'
  if (value >= 60) return 'pill good'
  if (value >= 25) return 'pill warn'
  return 'pill bad'
}

function deltaClass(value) {
  if (value == null) return 'delta neutral'
  if (value > 0) return 'delta good'
  if (value < 0) return 'delta bad'
  return 'delta neutral'
}

function ProgressBar({ percent }) {
  const safe = Math.max(0, Math.min(100, percent ?? 0))
  const cls = safe >= 60 ? 'good' : safe >= 25 ? 'warn' : 'bad'
  return (
    <div className="progressTrack">
      <div className={`progressFill ${cls}`} style={{ width: `${safe}%` }} />
    </div>
  )
}

function avg(values) {
  if (!values.length) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function buildUpcomingMetrics(eventsOverview) {
  const today = new Date().toISOString().slice(0, 10)
  const completed = eventsOverview.filter((row) => row.event_status === 'completed' && row.event_date < today)
  const upcoming = eventsOverview.filter((row) => row.event_status === 'live' && row.event_date >= today)

  return upcoming
    .map((row) => {
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

      return {
        ...row,
        currentFill,
        rollingAvgReservations,
        rollingAvgFill,
        yearAvgReservations,
        deltaVsRolling: rollingAvgReservations == null ? null : row.reservation_count - rollingAvgReservations,
      }
    })
    .sort((a, b) => {
      const aDate = a.event_date.localeCompare(b.event_date)
      if (aDate !== 0) return aDate
      return b.reservation_count - a.reservation_count
    })
}

function HomePage({ data }) {
  const upcomingMetrics = useMemo(() => buildUpcomingMetrics(data.eventsOverview), [data.eventsOverview])
  const upcomingShows = upcomingMetrics.length
  const upcomingReservations = upcomingMetrics.reduce((sum, row) => sum + row.reservation_count, 0)
  const avgUpcomingFill = avg(upcomingMetrics.filter((row) => row.currentFill != null).map((row) => row.currentFill))
  const avgDelta = avg(upcomingMetrics.filter((row) => row.deltaVsRolling != null).map((row) => row.deltaVsRolling))

  return (
    <div className="pageStack">
      <div className="grid cards heroCards">
        <Card label="Upcoming shows" value={intFmt.format(upcomingShows)} subtext={`${intFmt.format(upcomingReservations)} total reservations`} />
        <Card label="Average fill" value={avgUpcomingFill == null ? '—' : `${Math.round(avgUpcomingFill)}%`} subtext="Across upcoming shows with capacity" />
        <Card label="Vs venue rolling avg" value={avgDelta == null ? '—' : `${avgDelta > 0 ? '+' : ''}${Math.round(avgDelta)}`} subtext="Average reservation delta vs last 5 shows at that venue" />
        <Card label="Tracked net income" value={euro.format(data.overview.total_linked_net_income)} subtext="2025+ SumUp linked net income" />
      </div>

      <Section title="Upcoming shows">
        <div className="upcomingSummary">
          <div className="summaryText">
            Scroll this card for all upcoming duplicated shows. For now this uses Eventbrite reservations, capacity, and venue-based historical averages.
          </div>
          <div className="summaryMeta">
            <span className="metaChip">{intFmt.format(upcomingShows)} upcoming</span>
            <span className="metaChip">{intFmt.format(upcomingReservations)} reservations</span>
          </div>
        </div>

        <div className="upcomingScroller">
          {upcomingMetrics.map((row) => {
            const fillPercent = row.currentFill == null ? null : Math.round(row.currentFill)
            return (
              <div className="upcomingRow" key={row.event_id}>
                <div className="upcomingTop">
                  <div>
                    <div className="rowTitle">{row.event_name}</div>
                    <div className="rowMeta">{row.event_date} · {row.venue_name}{row.venue_city ? ` · ${row.venue_city}` : ''}</div>
                  </div>
                  <div className="rowNumbers">
                    <div className="bigNumber">{intFmt.format(row.reservation_count)}{row.event_capacity ? ` / ${intFmt.format(row.event_capacity)}` : ''}</div>
                    <div className="smallMuted">reservations{row.event_capacity ? ' / limit' : ''}</div>
                  </div>
                </div>

                <div className="progressBlock">
                  <ProgressBar percent={fillPercent ?? 0} />
                  <div className="progressMeta">
                    <span className={pillClass(fillPercent)}>{fillPercent == null ? 'No limit set' : `${fillPercent}% full`}</span>
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
                    <span>Tracked net so far</span>
                    <strong>{euro.format(row.sumup_net_amount)}</strong>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

function ReportingPage({ data }) {
  const topEvents = useMemo(() => (data.eventsOverview ?? []).slice().sort((a, b) => b.sumup_net_amount - a.sumup_net_amount).slice(0, 10), [data.eventsOverview])
  const topVenues = useMemo(() => (data.venues ?? []).slice().sort((a, b) => b.net_amount - a.net_amount).slice(0, 10), [data.venues])

  return (
    <div className="pageStack">
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
    </div>
  )
}

export default function App() {
  const [data, setData] = useState(null)
  const [page, setPage] = useState('home')

  useEffect(() => {
    const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
    const dataUrl = (file) => `${base}data/${file}`

    Promise.all([
      fetch(dataUrl('overview.json')).then((r) => r.json()),
      fetch(dataUrl('events_overview.json')).then((r) => r.json()),
      fetch(dataUrl('venues.json')).then((r) => r.json()),
      fetch(dataUrl('sales_timeseries.json')).then((r) => r.json()),
      fetch(dataUrl('quality.json')).then((r) => r.json()),
      fetch(dataUrl('upcoming_events.json')).then((r) => r.json()),
    ]).then(([overview, eventsOverview, venues, salesTimeseries, quality, upcomingEvents]) => {
      setData({ overview, eventsOverview, venues, salesTimeseries, quality, upcomingEvents })
    })
  }, [])

  if (!data) return <div className="shell"><p>Loading dashboard…</p></div>

  return (
    <div className="shell">
      <header className="header">
        <div>
          <h1>I2 Comedy Organisation Dashboard</h1>
          <p>Reservations, tracked income, and event health.</p>
        </div>
        <div className="stamp">
          <div>From {data.overview.report_start_date}</div>
          <div>Export generated {new Date(data.overview.generated_at).toLocaleString()}</div>
          <div>Linked payouts TSV {new Date(data.overview.source_timestamps.linked_links_tsv_mtime).toLocaleString()}</div>
          <div>Eventbrite query {new Date(data.overview.source_timestamps.eventbrite_query_generated_at).toLocaleString()}</div>
        </div>
      </header>

      <div className="tabs">
        <button className={page === 'home' ? 'tab active' : 'tab'} onClick={() => setPage('home')}>Home</button>
        <button className={page === 'reporting' ? 'tab active' : 'tab'} onClick={() => setPage('reporting')}>Current reporting page</button>
      </div>

      {page === 'home' ? <HomePage data={data} /> : <ReportingPage data={data} />}
    </div>
  )
}
