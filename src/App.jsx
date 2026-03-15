import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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
      fetch('/data/events.json').then((r) => r.json()),
      fetch('/data/venues.json').then((r) => r.json()),
      fetch('/data/sales_timeseries.json').then((r) => r.json()),
      fetch('/data/quality.json').then((r) => r.json()),
    ]).then(([overview, events, venues, salesTimeseries, quality]) => {
      setData({ overview, events, venues, salesTimeseries, quality })
    })
  }, [])

  const topEvents = useMemo(() => (data?.events ?? []).slice().sort((a, b) => b.net_amount - a.net_amount).slice(0, 10), [data])
  const topVenues = useMemo(() => (data?.venues ?? []).slice().sort((a, b) => b.net_amount - a.net_amount).slice(0, 10), [data])

  if (!data) return <div className="shell"><p>Loading dashboard…</p></div>

  return (
    <div className="shell">
      <header className="header">
        <div>
          <h1>Future Dashboard</h1>
          <p>Read-only reporting layer from the sibling <code>future</code> repo.</p>
        </div>
        <div className="stamp">Generated {new Date(data.overview.generated_at).toLocaleString()}</div>
      </header>

      <div className="grid cards">
        <Card label="Linked net income" value={euro.format(data.overview.total_linked_net_income)} />
        <Card label="Linked payouts" value={intFmt.format(data.overview.linked_payouts)} />
        <Card label="Events with income" value={intFmt.format(data.overview.events_with_linked_income)} />
        <Card label="Unmatched net" value={euro.format(data.overview.unmatched_net_amount)} subtext={`${intFmt.format(data.overview.unmatched_payouts)} payouts`} />
      </div>

      <div className="grid two-up">
        <Section title="Linked net income over time">
          <div className="chartWrap">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.salesTimeseries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#24304e" />
                <XAxis dataKey="date" stroke="#a5b4fc" />
                <YAxis stroke="#a5b4fc" />
                <Tooltip />
                <Area type="monotone" dataKey="net_amount" stroke="#60a5fa" fill="#60a5fa33" />
              </AreaChart>
            </ResponsiveContainer>
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
        </Section>
      </div>

      <div className="grid two-up">
        <Section title="Top events by net income">
          <div className="tableWrap">
            <table>
              <thead>
                <tr><th>Date</th><th>Event</th><th>Venue</th><th>Net</th></tr>
              </thead>
              <tbody>
                {topEvents.map((row) => (
                  <tr key={row.event_id}>
                    <td>{row.event_date}</td>
                    <td>{row.event_name}</td>
                    <td>{row.venue_name}</td>
                    <td>{euro.format(row.net_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Top venues by net income">
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

      <Section title="Low-confidence / unmatched samples">
        <div className="grid two-up">
          <div className="tableWrap">
            <h3>Low confidence</h3>
            <table>
              <thead>
                <tr><th>Date</th><th>Event</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {data.quality.sample_low_confidence.slice(0, 8).map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.payout_date}</td>
                    <td>{row.event_name}</td>
                    <td>{euro.format(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="tableWrap">
            <h3>Unmatched</h3>
            <table>
              <thead>
                <tr><th>Date</th><th>Code</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {data.quality.sample_unmatched.slice(0, 8).map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.payout_date}</td>
                    <td>{row.transaction_code}</td>
                    <td>{euro.format(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  )
}
