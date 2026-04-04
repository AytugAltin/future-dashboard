# BCN concept note — City network

**File:** `/home/x/.openclaw/workspace/projects/BelgianComedyNetwork/BCN-dashboard/public/website-concepts/bcn-concept-city-network.html`

## Changes from archive
- moved city switching into a sticky top-of-viewport bar
- removed vanity stats and public reservation-count style proof
- stripped scenic / tourism-like city emphasis out of the concept
- reduced card copy to date, title, venue, and ticket CTA
- kept Ghent and Leuven as short honest empty states rather than heavy city sections

## Rationale
This direction treats BCN as what it actually is: a comedy network spread across multiple Belgian cities, not one venue with a generic event list. Brussels, Ghent, Leuven, and Antwerp become the primary navigation model, while events sit inside each city context.

## Structure
1. Sticky topbar with inline BCN logo + core nav
2. Hero with city switcher, network route graphic, and next-3 upcoming shows
3. Dynamic city spotlight card with direct ticket CTA or waitlist CTA
4. Trust strip with real BCN stats and crowd-proof image
5. Four city identity cards
6. Filtered shows section with visible ticket buttons + sticky in-page detail panel
7. Newsletter section with city picker
8. About section + venue trust matrix
9. Footer with shows / cities / about / newsletter / contact links

## Click complexity
- **Path 1: Homepage → nearest event ticket:** 1 action
- **Path 2: “I want Brussels shows” → ticket:** 2 actions
- **Path 3: “I want Antwerp shows” → ticket:** 2 actions
- **Path 4: Homepage → newsletter signup submitted:** 3 actions
- **Average complexity score:** 2.0

## Strengths
- Cities are genuinely primary, not cosmetic tabs.
- Direct ticket buttons stay visible on event cards and in the hero spotlight.
- Ghent and Leuven still have useful states even with no current upcoming events.
- Uses real BCN event data, real Eventbrite links, real venue proof, and real BCN contact/social links.
- Low backend dependency: one HTML file, inline CSS/JS, no build step.

## Weaknesses
- Ghent and Leuven views depend on waitlist logic until fresh live dates exist.
- Slightly more UI/state complexity than a pure conversion-only landing page.
- The concept still uses atmosphere imagery from Unsplash rather than BCN-owned media.
- Needs browser QA at 375px / 768px / 1280px before anything launch-adjacent.

## Media dependency
**Low–medium.** The concept works mostly on typography, SVG/CSS graphics, and city accents. Only a small number of remote Unsplash images are used for mood layers.

## Upkeep burden
**Medium-low.** Weekly upkeep is mostly updating the static event array and occasionally refreshing city proof copy if venue history changes.

## Launch-readiness notes
- Replace the prototype newsletter success state with the real mailing flow.
- QA responsive behavior in a browser and refine spacing if needed.
- Swap in BCN-owned imagery later if available/cleared.
- Optional future improvement: move the static event array into a JSON snapshot shared by all concepts.

## Ticket-link realism
All live event CTAs in the concept point to the real Eventbrite URLs provided in the brief. No fake ticket links were added. Ghent and Leuven use signup/waitlist CTAs because the supplied snapshot has no current upcoming events for those cities.

## Data source used
- Upcoming events: the 8-event BCN static snapshot embedded in the sprint brief
- Trust/proof stats: the historical venue table and derived stats from the sprint brief
- Brand/contact references: BCN logo SVG, Instagram URL, Eventbrite org URL, emails, and brand palette from the sprint brief
