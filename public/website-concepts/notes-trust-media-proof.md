# Trust / media / proof concept — notes

**HTML:** `/home/x/.openclaw/workspace/projects/BelgianComedyNetwork/BCN-dashboard/public/website-concepts/bcn-concept-trust-media-proof.html`

## Rationale

This direction is built around the idea that BCN converts faster when the room already feels socially validated.
Instead of hiding proof in a late-page footer, it puts venue repetition, reservation signals, quote-style proof, Instagram/Eventbrite links, and city credibility directly next to ticket CTAs.

Important honesty choice: there was no verified attendee-review corpus in the brief, so the quote wall uses real BCN Eventbrite listing language rather than invented testimonials.

## Structure / section order

1. Sticky top nav + inline BCN logo
2. Hero with nearest-show CTA, trust strip, immediate proof chips
3. Media rail with crowd/venue collage + visible newsletter form
4. Upcoming shows section with instant city filter and live Eventbrite CTAs
5. In-page show detail section with share button and venue context
6. Proof section with quote wall, city proof stats, and secondary CTA cluster
7. City network cards for Brussels / Ghent / Leuven / Antwerp
8. About section with contact + real social links
9. Footer with Shows / Cities / About / Newsletter / Contact

## Click complexity

- **Path 1 — Homepage → nearest event ticket:** 2 actions
  1. Click hero CTA
  2. External redirect to Eventbrite
- **Path 2 — “I want Brussels shows” → ticket:** 3 actions
  1. Click Brussels filter
  2. Click visible Brussels ticket CTA
  3. External redirect to Eventbrite
- **Path 3 — “I want Antwerp shows” → ticket:** 3 actions
  1. Click Antwerp filter
  2. Click visible Antwerp ticket CTA
  3. External redirect to Eventbrite
- **Path 4 — Homepage → newsletter signup submitted:** 3 actions
  1. Fill email
  2. Select city
  3. Click Join

**Average complexity score:** `2.75`

## Strengths

- Trust signals are physically close to ticket buttons.
- Honest handling of uneven city data: Brussels/Antwerp get events, Ghent/Leuven get proof + waitlist CTA.
- Real BCN venue stats make the network feel established fast.
- Visible newsletter form keeps fallback conversion short.
- In-page detail section preserves context instead of forcing page hops.

## Weaknesses

- Without real BCN audience/stage photography, the proof layer is still prototype-grade.
- Quote wall uses live listing copy, not public attendee testimonials.
- This direction is visually denser than a pure conversion-first V1.
- Remote mood images increase dependence on media quality and load discipline.

## Media dependency

**Medium-high.**
The layout works structurally without fresh assets, but it becomes significantly more convincing once real BCN crowd, stage, and venue photography replaces the Unsplash stand-ins.

## Weekly upkeep burden

**Medium.**
Event cards and detail content are easy to update from a static snapshot, but the proof layer benefits from periodic swaps of featured photos, reservation signals, and approved quotes.

## Launch-readiness notes

- Ticket CTAs are launch-realistic already.
- Newsletter submit is still prototype-only and needs a real endpoint/provider.
- Replace stand-in visuals with approved BCN media before launch.
- Add verified attendee quotes or curated Instagram post embeds if rights/usage are cleared.
- If possible, browser-test the file at 375px / 768px / 1280px before review.

## Ticket-link realism

All primary event CTAs use the real Eventbrite URLs from the brief:
- `https://www.eventbrite.be/e/1979661782683`
- `https://www.eventbrite.be/e/1892066374459`
- `https://www.eventbrite.be/e/1980258240705`
- `https://www.eventbrite.be/e/1979661786695`
- `https://www.eventbrite.be/e/1984641303564`
- `https://www.eventbrite.be/e/1980258241708`
- `https://www.eventbrite.be/e/1984641304567`
- `https://www.eventbrite.be/e/1980258242711`

I also used live-fetched Eventbrite listing copy for the Brussels / Woluwe / Antwerp description layers, but kept lineup fields labeled `[PLACEHOLDER]` because no lineup data was available in the supplied brief/fetches.

## Data source used

- Static upcoming-event snapshot from `bcn-website-design-sprint.md`
- Real venue totals / trust stats from the same brief
- Live public Eventbrite page fetches on 2026-04-04 for:
  - Academy Comedy Nights – Brussels
  - Friday Night Stand-Up Comedy In English For FREE!
  - English Stand-Up Comedy Antwerp: Best of Belgium
- Visual stand-ins from Unsplash direct image URLs allowed by the brief
