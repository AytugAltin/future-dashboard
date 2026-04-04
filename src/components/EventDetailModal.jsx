import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { euro, intFmt } from '../formatters.js'
import { buildSalesLeadCurveContext } from '../utils/leadCurve.js'
import { eventbriteEventUrl, findOccurrenceHistory } from '../utils/metrics.js'

export function EventDetailModal({ event, data, title = 'Event details', onClose }) {
  const [axisMode, setAxisMode] = useState('days')

  const eventbriteUrls = Array.isArray(event?.eventbrite_urls) && event.eventbrite_urls.length
    ? event.eventbrite_urls
    : [event?.eventbrite_url || eventbriteEventUrl(event?.primary_eventbrite_event_id || event?.event_id)].filter(Boolean)
  const occurrenceHistory = useMemo(
    () => findOccurrenceHistory(event, data?.occurrenceReservationHistory),
    [data?.occurrenceReservationHistory, event]
  )
  const occurrenceNotes = useMemo(
    () => buildOccurrenceHistoryNotes(occurrenceHistory, data?.occurrenceReservationHistory?.assumptions ?? []),
    [data?.occurrenceReservationHistory?.assumptions, occurrenceHistory]
  )
  const leadCurve = useMemo(
    () => buildSalesLeadCurveContext({ event, data, axisMode }),
    [axisMode, data, event]
  )

  if (!event) return null

  return (
    <div className="modalBackdrop" role="presentation" onClick={onClose}>
      <div
        className="modalPanel modalPanelWide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalHeader">
          <h3 id="event-detail-title">{title}</h3>
          <button type="button" className="modalClose" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modalBody">
          {eventbriteUrls.length ? (
            <div className="modalLinkList">
              {eventbriteUrls.map((url, index) => (
                <p key={url} className="modalLinkRow">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {eventbriteUrls.length === 1 ? 'Open on Eventbrite' : `Open Eventbrite listing ${index + 1}`}
                  </a>
                  <span className="subtle"> (public listing)</span>
                </p>
              ))}
            </div>
          ) : null}

          {occurrenceHistory ? (
            <section className="modalChartSection">
              <div className="modalChartTop">
                <div>
                  <h4 className="modalChartTitle">Per-show reservation history</h4>
                  <p className="modalChartCopy">
                    Cumulative Eventbrite reservations leading up to this occurrence. When multiple Eventbrite links resolve to the same venue + time,
                    they are merged into one show curve.
                  </p>
                </div>
              </div>

              <div className="leadCurveMeta">
                <span className="metaChip">Reservations: {intFmt.format(occurrenceHistory.final_reservations ?? 0)}</span>
                <span className="metaChip">Orders: {intFmt.format(occurrenceHistory.final_eventbrite_orders ?? 0)}</span>
                <span className="metaChip">Merged listings: {intFmt.format(occurrenceHistory.source_event_count ?? 1)}</span>
                <span className="metaChip">Mode: {occurrenceHistory.history_mode === 'summary_fallback' ? 'summary fallback' : 'daily orders'}</span>
              </div>

              {occurrenceHistory.points?.length ? (
                <div className="chartWrap modalLeadCurveWrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={occurrenceHistory.points} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#24304e" />
                      <XAxis dataKey="order_date" stroke="#a5b4fc" minTickGap={28} />
                      <YAxis allowDecimals={false} stroke="#a5b4fc" />
                      <Tooltip content={<OccurrenceHistoryTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="reservations_cumulative"
                        name="Reservations"
                        stroke="#f59e0b"
                        fill="#f59e0b33"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="eventbrite_orders_cumulative"
                        name="Orders"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="subtle">No order-level reservation history is available for this occurrence yet.</p>
              )}

              {occurrenceNotes.length ? (
                <ul className="modalNotesList">
                  {occurrenceNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : (
            <p className="subtle">
              Per-show reservation history needs <code>occurrence_reservation_history.json</code>. UI support is wired; re-run the export to populate it.
            </p>
          )}

          {leadCurve ? (
            <section className="modalChartSection">
              <div className="modalChartTop">
                <div>
                  <h4 className="modalChartTitle">Sales curve vs benchmark</h4>
                  <p className="modalChartCopy">
                    Using <strong>cumulative reservations</strong> because the current JSON model exposes
                    <code> reservation_count </code>
                    totals, not pre-bucket deltas. Tooltip still shows reservations <em>added</em> inside each day/week bucket.
                  </p>
                </div>
                <div className="segmentedControl" role="tablist" aria-label="Lead curve axis toggle">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={axisMode === 'days'}
                    className={axisMode === 'days' ? 'segmentedBtn active' : 'segmentedBtn'}
                    onClick={() => setAxisMode('days')}
                  >
                    Days until show
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={axisMode === 'weeks'}
                    className={axisMode === 'weeks' ? 'segmentedBtn active' : 'segmentedBtn'}
                    onClick={() => setAxisMode('weeks')}
                  >
                    Weeks until show
                  </button>
                </div>
              </div>

              <div className="leadCurveMeta">
                <span className="metaChip">Metric: {leadCurve.metricLabel}</span>
                <span className="metaChip">Benchmark: {leadCurve.benchmarkLabel}</span>
                <span className="metaChip">Comparable shows: {intFmt.format(leadCurve.comparableCount)}</span>
                <span className="metaChip">Venue class: {leadCurve.venueClass}</span>
              </div>

              <div className="chartWrap modalLeadCurveWrap">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={leadCurve.points} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#24304e" />
                    <XAxis
                      type="number"
                      dataKey="bucket"
                      reversed
                      allowDecimals={false}
                      domain={[0, 'dataMax']}
                      stroke="#a5b4fc"
                      label={{ value: leadCurve.axisLabel, position: 'insideBottom', offset: -2, fill: '#94a3b8' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke="#a5b4fc"
                      label={{ value: 'Reservations', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                    />
                    <Tooltip content={<LeadCurveTooltip axisLabel={leadCurve.axisLabel} />} />
                    <ReferenceLine x={0} stroke="#475569" strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="benchmarkAccumulated"
                      name="Historical average"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="6 6"
                      dot={false}
                      connectNulls
                      opacity={0.7}
                    />
                    <Line
                      type="monotone"
                      dataKey="actualAccumulated"
                      name="This show"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={false}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="subtle leadCurveFootnote">
                Benchmark fallback ladder: same series/title family + venue class → same series/title family → same venue class → global average.
                Source: {leadCurve.sourceLabel}.
              </p>
            </section>
          ) : (
            <p className="subtle">
              Lead-up sales chart needs populated <code>occurrence_reservation_history.json</code>
              {' '}or an optional precomputed <code>sales_lead_curves.json</code> export. The current snapshot does not include enough curve data yet.
            </p>
          )}

          <dl className="detailGrid">
            {Object.entries(event).map(([key, value]) => (
              <div key={key} className="detailRow">
                <dt>{key}</dt>
                <dd>{formatDetailValue(key, value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

function OccurrenceHistoryTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  const row = payload[0]?.payload
  if (!row) return null

  return (
    <div className="leadCurveTooltip">
      <div className="leadCurveTooltipTitle">
        {label} · <strong>{formatDaysUntilShow(row.days_until_show)}</strong>
      </div>
      <div>Reservations: {intFmt.format(Math.round(row.reservations_cumulative ?? 0))} cumulative</div>
      <div>Added that day: {intFmt.format(Math.round(row.reservations_added ?? 0))}</div>
      <div>Orders: {intFmt.format(Math.round(row.eventbrite_orders_cumulative ?? 0))} cumulative</div>
      <div>Orders added: {intFmt.format(Math.round(row.eventbrite_orders_added ?? 0))}</div>
    </div>
  )
}

function buildOccurrenceHistoryNotes(occurrenceHistory, fallbackAssumptions) {
  if (!occurrenceHistory) return []

  const notes = []
  if ((occurrenceHistory.source_event_count ?? 0) > 1) {
    notes.push(
      `Merged ${intFmt.format(occurrenceHistory.source_event_count)} Eventbrite listing${occurrenceHistory.source_event_count === 1 ? '' : 's'} for the same occurrence.`
    )
  }
  if (occurrenceHistory.used_summary_adjustment) {
    notes.push('Final point was adjusted to match exported totals because the order-level history did not fully cover the current snapshot.')
  }
  if (occurrenceHistory.history_mode === 'summary_fallback') {
    notes.push('Only the final exported totals were available here, so the curve falls back to a show-day point instead of a full daily trail.')
  }
  if (!notes.length && fallbackAssumptions?.length) {
    notes.push(fallbackAssumptions[0])
  }
  return notes.slice(0, 3)
}

function LeadCurveTooltip({ active, payload, label, axisLabel }) {
  if (!active || !payload?.length) return null

  const row = payload[0]?.payload
  if (!row) return null

  return (
    <div className="leadCurveTooltip">
      <div className="leadCurveTooltipTitle">
        {axisLabel}: <strong>{label}</strong>
      </div>
      <div>This show: {intFmt.format(Math.round(row.actualAccumulated ?? 0))} cumulative</div>
      <div>Added in bucket: {intFmt.format(Math.round(row.actualAdded ?? 0))}</div>
      {row.benchmarkAccumulated != null ? (
        <>
          <div>Historical average: {intFmt.format(Math.round(row.benchmarkAccumulated))} cumulative</div>
          <div>Average added in bucket: {intFmt.format(Math.round(row.benchmarkAdded ?? 0))}</div>
        </>
      ) : null}
    </div>
  )
}

function formatDaysUntilShow(value) {
  if (value == null) return 'Unknown lead time'
  if (value === 0) return 'show day'
  if (value === 1) return '1 day before show'
  return `${intFmt.format(value)} days before show`
}

function formatDetailValue(key, value) {
  if (value == null) return '—'
  if (typeof value === 'number') {
    if (key.includes('amount') || key.includes('income') || key.includes('fee') || key.includes('revenue')) {
      return euro.format(value)
    }
    if (Number.isInteger(value) && (key.includes('count') || key.includes('capacity') || key.includes('order'))) {
      return intFmt.format(value)
    }
    return String(value)
  }
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
