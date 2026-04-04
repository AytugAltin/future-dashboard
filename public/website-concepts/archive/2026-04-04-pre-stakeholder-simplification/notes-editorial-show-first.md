# Editorial show-first concept — notes

**File:** `/home/x/.openclaw/workspace/projects/BelgianComedyNetwork/BCN-dashboard/public/website-concepts/bcn-concept-editorial-show-first.html`

## Rationale
This version pushes BCN toward a magazine-for-going-out feel without sacrificing the ticket path. The homepage still leads with the next real BCN event and visible Eventbrite CTA, but the hierarchy, large display type, mood photography, poster-like detail blocks, and city bulletin make the experience feel more like a night-out publication than a schedule table.

## Structure
1. Sticky masthead with inline BCN logo and direct anchors
2. Hero feature with next real BCN show and visible ticket CTA
3. Above-the-fold newsletter card with city picker
4. City bulletin / editorial angle block
5. Trust strip with real BCN venue/show/ticket stats
6. Filterable programme grid with visible ticket buttons
7. In-page show-note detail blocks for every real event
8. About + contact panels
9. Footer with required links/tagline

## Click counts
- **Path 1 — homepage → nearest event ticket:** 2 actions
  - click visible hero CTA
  - external redirect to Eventbrite
- **Path 2 — “I want Brussels shows” → ticket:** 3 actions
  - click Brussels filter
  - click visible Brussels event ticket CTA
  - external redirect to Eventbrite
- **Path 3 — “I want Antwerp shows” → ticket:** 3 actions
  - click Antwerp filter
  - click visible Antwerp event ticket CTA
  - external redirect to Eventbrite
- **Path 4 — homepage → newsletter signup submitted:** 3 actions
  - fill email
  - choose city
  - click Join
- **Average complexity:** 2.75 actions

## Strengths
- Stronger atmosphere and perceived brand value than the existing filler editorial placeholder
- Real BCN data and real Eventbrite URLs throughout
- Above-the-fold newsletter keeps the signup path within target complexity
- Honest handling of Ghent/Leuven empty current schedule via trust + signup instead of fake listings
- In-page detail sections preserve “read more” without needing a separate routed page

## Weaknesses
- Mood relies on prototype Unsplash imagery rather than real BCN-owned crowd/stage proof
- More visual density than a pure conversion-first V1
- Repeated Brussels recurring dates can look editorially repetitive if real media/copy is not refreshed
- Static newsletter submission is simulated only; no real list integration yet

## Media dependency
**Medium.** The page works with prototype images and CSS/SVG art, but it gets materially better once real BCN crowd/stage/venue images are available.

## Upkeep burden
**Medium.** Event updates are straightforward because the structure is reusable, but keeping the editorial feel strong will benefit from fresh copy snippets and occasional image swaps.

## Launch-readiness notes
- Connect newsletter form to a real email platform and add consent copy
- Replace prototype atmosphere images with cleared BCN media where possible
- Add real lineup/show descriptions when available
- Consider reducing repeated imagery for recurring Brussels dates if launch cadence is high

## Ticket-link realism
All show CTAs use the real Eventbrite URL pattern from the provided BCN snapshot, with the real `eventbrite_id` values from the brief. No fake booking destinations were introduced.

## Data source used
- Real upcoming BCN event snapshot from `BCN-Track/projects/website-job/bcn-website-design-sprint.md`
- Real historical venue/show/ticket totals from the same brief
- Real BCN public links from the same brief: Instagram, Eventbrite org, contact emails
- Prototype mood imagery: direct Unsplash image URLs cited in the sprint brief
