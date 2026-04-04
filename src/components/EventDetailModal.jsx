import { euro, intFmt } from '../formatters.js'
import { eventbriteEventUrl } from '../utils/metrics.js'

export function EventDetailModal({ event, title = 'Event details', onClose }) {
  if (!event) return null

  const url = event.eventbrite_url || eventbriteEventUrl(event.event_id)

  return (
    <div className="modalBackdrop" role="presentation" onClick={onClose}>
      <div
        className="modalPanel"
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
          {url ? (
            <p className="modalLinkRow">
              <a href={url} target="_blank" rel="noopener noreferrer">
                Open on Eventbrite
              </a>
              <span className="subtle"> (public listing)</span>
            </p>
          ) : null}
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
  return String(value)
}
