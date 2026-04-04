# Editorial show-first concept — notes

**File:** `/home/x/.openclaw/workspace/projects/BelgianComedyNetwork/BCN-dashboard/public/website-concepts/bcn-concept-editorial-show-first.html`

## Latest pass

Aligned this concept to the approved **Figma Make — Event Marketing Site V1** direction using the existing static concept stack in `BCN-dashboard/public/website-concepts/`.

## Changes from previous pass

### Content updates
- switched the page to load from `bcn-events-snapshot.json` instead of relying only on hardcoded inline mock data
- kept the real BCN event titles, dates, cities, venues, and canonical Eventbrite ticket links from the current snapshot
- mapped the hero/cards to BCN public Eventbrite imagery where available instead of generic mood-only photography
- kept Ghent and Leuven as honest no-date states instead of inventing listings
- kept newsletter/signup secondary and lower on the page

### Design / UX updates
- tightened the page around one Figma-aligned editorial structure instead of a more experimental concept mix
- kept the city filter sticky and high-visibility
- removed hero metrics and avoided public reservation/ticket counters
- simplified the hierarchy: hero → cards → city blocks → selected show → lower-page proof → alerts
- strengthened text-on-image readability with heavier scrims and cleaner overlays
- kept rounded panel shapes, large display rhythm, and ticket-first CTA emphasis

## Short changelog

- **Figma supersedes older recommendation wording:** this file is now the clearest current direction for the BCN event-marketing site, even though earlier index copy had city-network framed as the recommended V1 base.
- **No change to stakeholder constraints:** less text, no emojis, no hero stats, city filter stays high, proof stays lower.

## Rationale

This version is meant to feel current and ticket-ready rather than like a gallery concept. It keeps the editorial tone, but trims the page to the main actions:

1. choose a city
2. see the next real date
3. click the canonical ticket link

## Structure

1. Sticky masthead with BCN brand and short nav
2. Sticky city filter rail directly under the header
3. Split hero with large editorial headline and real BCN featured event image
4. Upcoming event grid with direct ticket CTA on every card
5. City blocks for Brussels / Ghent / Leuven / Antwerp
6. Selected-show detail panel fed by the active card/filter
7. Lower-page proof / BCN links section
8. City-alert signup section
9. Footer

## Click counts

- **Path 1 — homepage → nearest event ticket:** 2 actions
  - click visible hero CTA
  - external redirect to Eventbrite
- **Path 2 — “I want Brussels shows” → ticket:** 3 actions
  - click Brussels filter
  - click visible Brussels ticket CTA
  - external redirect to Eventbrite
- **Path 3 — “I want Antwerp shows” → ticket:** 3 actions
  - click Antwerp filter
  - click visible Antwerp ticket CTA
  - external redirect to Eventbrite
- **Path 4 — homepage → city alert signup submitted:** 3 actions
  - fill email
  - choose city
  - click Join
- **Average complexity:** 2.75 actions

## Strengths

- real BCN event data now comes from the shared snapshot JSON
- real BCN/Eventbrite visuals are used where available for hero/card atmosphere
- city filter stays highly visible and useful on mobile
- no fake urgency, no vanity metrics, no brochure-like hero clutter
- honest empty states for cities without live dates in the snapshot

## Weaknesses

- proof imagery still uses public reference assets; BCN-owned originals should replace them before any launch-like use
- signup remains prototype-only
- repeated Academy dates still need richer real media variation if this becomes a live marketing surface

## Launch-readiness notes

- connect the signup form to the real mailing flow
- replace public reference imagery with BCN-cleared originals
- run browser QA across mobile/tablet/desktop widths
- if this becomes the chosen live route, consider moving shared UI tokens into `shared.css` or a dedicated website stylesheet
