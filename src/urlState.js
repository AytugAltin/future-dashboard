/**
 * Bookmarkable filter state in the URL (search params).
 * tab=reporting | (omit for home)
 * q, venue, city, from, to
 */

export function parseDashboardURL() {
  const p = new URLSearchParams(window.location.search)
  return {
    page: p.get('tab') === 'reporting' ? 'reporting' : 'home',
    q: p.get('q') ?? '',
    venue: p.get('venue') ?? '',
    city: p.get('city') ?? '',
    from: p.get('from') ?? '',
    to: p.get('to') ?? '',
  }
}

export function serializeDashboardURL(state) {
  const p = new URLSearchParams()
  if (state.page === 'reporting') p.set('tab', 'reporting')
  if (state.q) p.set('q', state.q)
  if (state.venue) p.set('venue', state.venue)
  if (state.city) p.set('city', state.city)
  if (state.from) p.set('from', state.from)
  if (state.to) p.set('to', state.to)
  return p.toString()
}

export function hrefFromState(state) {
  const q = serializeDashboardURL(state)
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  return q ? `${path}?${q}` : path
}

export function replaceUrlWithState(state) {
  window.history.replaceState({ ...state }, '', hrefFromState(state))
}
