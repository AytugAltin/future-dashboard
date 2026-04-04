# BCN concept note — conversion-first mobile

## File
- HTML: `/home/x/.openclaw/workspace/projects/BelgianComedyNetwork/BCN-dashboard/public/website-concepts/bcn-concept-conversion-mobile.html`

## Rationale
This direction treats the site like a mobile ticket launcher first and a brand surface second. The homepage is compressed around the real next show, city filters, visible ticket buttons, and a no-backend newsletter fallback. It is intentionally denser than the older placeholder concepts and uses the real BCN event snapshot instead of filler cards.

## Structure
1. Sticky header with inline BCN logo and anchor nav
2. Hero launchpad with next-live-date card and primary ticket CTA
3. Real trust strip: 14 venues · 164+ shows · 11,900+ tickets · 4 cities
4. Instant city filter chips in the hero
5. Compact newsletter block with city chips and local-storage prototype submission
6. Top 3 live-date cards with visible Eventbrite CTAs
7. In-page selected show detail block with share button
8. Full upcoming schedule using all 8 supplied events
9. About / network proof / contact links
10. Footer with required links and tagline
11. Sticky mobile ticket bar

## Click counts
- Path 1 — homepage → nearest event ticket: **1 action**
- Path 2 — “I want Brussels shows” → ticket: **2 actions**
- Path 3 — “I want Antwerp shows” → ticket: **2 actions**
- Path 4 — homepage → newsletter signup submitted: **3 actions**
- Average click complexity score: **2.0**

## Strengths
- Very short route from landing to real ticket link
- City filtering is above the fold and avoids hamburger/menu tax
- Real BCN data throughout; no fake shows or lorem ipsum
- Low media dependency because visuals are CSS/SVG-driven
- Sticky bottom CTA keeps a ticket path visible on mobile at all times

## Weaknesses
- Less emotional/mood-driven than editorial or media-heavy directions
- No real BCN photography yet, so social proof is mostly numeric and venue-based
- Ghent and Leuven currently resolve to empty-state capture because the supplied snapshot has no live dates there
- Newsletter submission is prototype-only and currently saves to localStorage instead of a real ESP

## Media dependency
- **Low**
- Uses inline SVG and CSS poster graphics instead of depending on fresh photography

## Upkeep burden
- **Low**
- Main weekly work is updating the in-file event array and, if needed, venue proof copy

## Launch-readiness notes
- UI is launch-shaped and fully static-file runnable
- Ticket links are real Eventbrite URLs from supplied IDs
- Before launch, connect newsletter submission to a real ESP and replace `[PLACEHOLDER]` lineup text when available
- Optional upgrade: add 1–2 approved BCN crowd photos if emotional proof is needed without changing the structure

## Ticket-link realism
- Uses the real direct Eventbrite pattern from the brief: `https://www.eventbrite.be/e/{eventbrite_id}`
- All 8 supplied events are wired to real BCN Eventbrite IDs
- No placeholder ticket links were used

## Data source used
- BCN sprint brief static upcoming-events snapshot
- BCN sprint brief historical venue totals / derived trust stats
- BCN inline SVG logo from the brief
- No live backend fetches; no external runtime dependency beyond Google Fonts CDN
