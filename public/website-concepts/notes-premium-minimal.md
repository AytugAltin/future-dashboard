# Premium minimal concept — notes

**HTML:** `/home/x/.openclaw/workspace/projects/BelgianComedyNetwork/BCN-dashboard/public/website-concepts/bcn-concept-premium-minimal.html`

## Changes from archive
- moved city filtering into a sticky top-of-viewport bar
- removed aggregate metrics / vanity proof blocks from the public surface
- reduced the hero to one primary ticket path plus one secondary schedule path
- simplified visible event cards to one clear ticket CTA each
- shortened copy across hero, cards, and detail areas to keep the premium feel calm

## Rationale
A restrained, dark, hierarchy-led BCN direction for a more premium night-out signal.
It keeps the conversion path flat, but removes the busier card-wall feeling.
The goal is: immediate trust, immediate next-show action, calmer typography, less visual noise.

## Structure
1. Sticky header with inline BCN logo and anchor nav
2. Hero with next show, direct Eventbrite CTA, and compact city newsletter signup
3. Trust strip with real BCN stats
4. Three upcoming featured shows with visible ticket buttons
5. City filter cards + instant city filter pills
6. Schedule list + in-page show detail panel with share button
7. Newsletter section with city picker
8. About + contact + social links
9. Footer with required links/tagline

## Click complexity
- **Path 1 — Homepage → nearest event ticket:** 2 actions
  1. Click hero CTA
  2. External redirect to Eventbrite
- **Path 2 — “I want Brussels shows” → ticket:** 3 actions
  1. Click Brussels filter
  2. Click Brussels ticket CTA
  3. External redirect to Eventbrite
- **Path 3 — “I want Antwerp shows” → ticket:** 3 actions
  1. Click Antwerp filter
  2. Click Antwerp ticket CTA
  3. External redirect to Eventbrite
- **Path 4 — Homepage → newsletter signup submitted:** 3 actions
  1. Fill email
  2. Choose city
  3. Submit
- **Average:** 2.75

## Strengths
- Premium tone without adding navigation depth
- Hero answers what / when / where / what to do immediately
- Real trust layer from BCN venue/show/ticket history
- Honest handling of Ghent/Leuven empty upcoming states
- No backend or build dependency

## Weaknesses
- Premium feel will land much better with real BCN crowd/stage photography
- Ghent and Leuven feel more waitlist-led than show-led because the supplied snapshot has no upcoming dates there
- Slightly less energetic than a more editorial or media-heavy concept
- Share/detail interactions are prototype-level, not production-integrated

## Media dependency
**Medium.**
The layout works with CSS/SVG art plus mood photography, but launch quality would improve a lot with rights-cleared BCN images.

## Upkeep burden
**Low to medium.**
Updating event data is simple because the schedule is flat and detail content is generated from the same dataset.
The main upkeep burden is swapping in better real BCN media over time.

## Launch-readiness notes
- Replace prototype Unsplash mood images with BCN-owned/cleared photos
- Connect newsletter form to a real ESP or CRM
- Optional: enrich detail copy with real descriptions/lineups from Eventbrite when available
- Optional: add analytics on city filter usage and CTA clicks

## Ticket-link realism
All show CTAs use the real Eventbrite URLs from the supplied BCN snapshot:
- `https://www.eventbrite.be/e/1979661782683`
- `https://www.eventbrite.be/e/1892066374459`
- `https://www.eventbrite.be/e/1980258240705`
- `https://www.eventbrite.be/e/1979661786695`
- `https://www.eventbrite.be/e/1984641303564`
- `https://www.eventbrite.be/e/1980258241708`
- `https://www.eventbrite.be/e/1984641304567`
- `https://www.eventbrite.be/e/1980258242711`

## Data source used
- Real BCN event snapshot from the design sprint brief
- Real historical venue/ticket stats from the brief
- Real BCN contact email, Instagram, and Eventbrite org link from the brief
- Prototype mood imagery from Unsplash; decorative graphics are inline SVG/CSS
