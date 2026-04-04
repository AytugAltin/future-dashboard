# BCN design research

_Web design research track for the BCN website sprint_

Date: 2026-04-04
Reviewed: current concepts A–E + `shared.css` in `BCN-dashboard/public/website-concepts/`
Reference sites reviewed: 10

---

## 1) What this should do for the concept designers

Use this as a **reference bank**, not a style mandate.

The goal is to help each concept feel more intentional:
- more category-native
- less generic AI/SaaS
- stronger on trust + energy
- still fast to maintain weekly

It should **not** make all five concepts converge into one look.

---

## 2) Quick workspace read: what already exists

The existing BCN concepts already separate the **information architecture** pretty well:
- A = conversion-first
- B = editorial
- C = city-network
- D = proof/media
- E = premium minimal

But visually, they are still too related.

### Main pattern in the current workspace
`shared.css` currently makes many pages feel like siblings because it reuses:
- the same glassy panel language
- the same pill/button shapes
- the same border radius rhythm
- the same gradient treatment
- the same shadow stack
- **Inter** as both display and body font

### What to push harder in the next pass
To make the five directions feel genuinely different, vary:
- grid logic
- type system
- image ratios
- density of sections
- nav pattern
- edge treatment/dividers
- CTA shape/placement
- how city colors are used

### Practical takeaway
Keep the strategic direction of A–E.
Break the shared visual shell.

---

## 3) No-regret design rules for BCN specifically

These showed up repeatedly in the best reference patterns.

1. **Above the fold must answer the booking question immediately.**
   - What is this?
   - When is the next show?
   - Where is it?
   - What do I click?

2. **At least one ticket CTA should be visible without opening a modal or detail page.**
   BCN is not a browse-forever product.

3. **Proof should sit close to conversion.**
   Real venues, crowd energy, real counts, real city names.

4. **Cities should act as wayfinding, not decoration only.**
   Brussels / Ghent / Leuven / Antwerp should feel like useful filters.

5. **Use one strong organizing principle per concept.**
   Not all of: city tabs + giant story feed + heavy gallery + full schedule + testimonials above the fold.

6. **Use real imagery sparingly but confidently.**
   One strong crowd/stage image is better than six weak ones.

7. **Mobile should not pay a hamburger penalty unless truly necessary.**
   BCN has a small enough nav to use tabs, chips, or a sticky action bar.

---

## 4) Reference sites reviewed

## 4.1 DICE
URL: https://dice.fm/

### What is strong
- Extremely clear value proposition: live events, easy ticketing, upfront pricing.
- Short, confident blocks.
- Product trust is built through **friction-reduction copy** rather than long explanation.
- Good use of “relevant recommendations” framing.

### Worth borrowing for BCN
- Copy style that reduces hesitation: “Upfront pricing”, “Get tickets fast”, “Relevant shows in your city”.
- One clear CTA per block.
- Tight feature/trust strip near the top.
- Strong mobile scan rhythm: short headline, short deck, obvious action.

### Avoid
- Don’t make BCN feel like an app marketing page.
- Don’t over-productize simple comedy discovery.
- Avoid generic “platform” language.

### BCN translation
Best influence on:
- Concept A (conversion-first)
- parts of C (city discovery)

---

## 4.2 RED MIC
URL: https://red-mic.com/

### What is strong
- Very direct schedule-led presentation.
- City, date, venue structure is instantly legible.
- Gives “real touring network” credibility through breadth.
- Strong benchmark for a category competitor.

### Worth borrowing for BCN
- Direct city/date/venue stacks.
- Network proof: many shows across many places.
- Strong practical language over cleverness.
- Homepage schedule content that proves activity immediately.

### Avoid
- Don’t copy the flatness.
- Don’t let long lists become visually dead.
- BCN should feel warmer and more designed than this.

### BCN translation
Best influence on:
- Concept A schedule cards
- Concept C city logic
- trust strip wording

---

## 4.3 Soho Theatre
URL: https://www.sohotheatre.com/

### What is strong
- Clear cultural identity without losing practical navigation.
- Local hubs/locations are visible early.
- Membership and mailing list are treated as meaningful, not footer leftovers.
- Strong “great night out” framing.

### Worth borrowing for BCN
- Short mission statement near top.
- Localized entry points.
- Membership/newsletter positioned as a real second conversion path.
- Tone that feels human and rooted in going out.

### Avoid
- Don’t inherit institutional theatre complexity.
- BCN should stay lighter and faster than a venue program site.

### BCN translation
Best influence on:
- Concept C city hubs
- Concept E trust tone
- newsletter placement

---

## 4.4 Edinburgh Festival Fringe
URL: https://www.edfringe.com/

### What is strong
- “Browse and book” language is brutally clear.
- Scale is communicated fast.
- Discovery feels like a first-class task.
- Good precedent for category/tag/filter mental models.

### Worth borrowing for BCN
- Clear browse verbs.
- Filter-first thinking.
- Category chips or city chips that immediately narrow choice.
- High-visibility “book now” language.

### Avoid
- BCN should not feel like a giant directory.
- Too much taxonomy would add friction for a smaller schedule.

### BCN translation
Best influence on:
- city filters
- category chips for free/paid/this week
- compact schedule modules

---

## 4.5 Fever
URL: https://feverup.com/en

### What is strong
- Strong scale/trust positioning.
- “Experience your city” is a useful emotional framing.
- Categories are broad, visually easy, and inviting.
- Social proof and global scale do a lot of work quickly.

### Worth borrowing for BCN
- City-as-experience framing, not just city-as-filter.
- Trust stat bands.
- Category chips or highlight modules.
- Confidence in showing large proof numbers early.

### Avoid
- Don’t become marketplace-generic.
- Don’t bury BCN’s point of view under too many generic experiences.
- BCN is a promoter, not a mega-discovery app.

### BCN translation
Best influence on:
- trust/proof modules
- city-led homepage messaging
- “what kind of night are you after?” blocks

---

## 4.6 Songkick
URL: https://www.songkick.com/

### What is strong
- Personalization and local relevance are obvious.
- Trends/popularity add social signal.
- Good use of rankings and popularity as navigation help.
- Supports “near you” thinking well.

### Worth borrowing for BCN
- “Near you” logic.
- “Popular this month” / “next up in Brussels” labels.
- Lightweight trend markers on event cards.
- Follow / get alerts patterns for secondary conversion.

### Avoid
- Don’t make BCN look overly data-heavy.
- Comedy discovery should stay warmer and more social than music analytics.

### BCN translation
Best influence on:
- Concept C city-specific alerts
- proof badges like “selling fast” or “recurring favorite”
- next-up modules

---

## 4.7 The Moth
URL: https://themoth.org/

### What is strong
- Excellent blend of live events, editorial storytelling, and membership.
- Homepage balances events with content without losing emotional tone.
- Feels human and cultural, not transactional only.
- Repeats a recognizable motif: mic/story/community.

### Worth borrowing for BCN
- Live events strip near editorial content.
- One cultural sentence that says what BCN actually is.
- Emotional proof through real quotes and lived moments.
- Membership/newsletter blocks that feel native to the brand.

### Avoid
- Don’t let editorial layers push tickets too far down.
- BCN is more immediate and nightlife-driven than this.

### BCN translation
Best influence on:
- Concept B editorial pacing
- Concept D testimonial handling
- About section tone

---

## 4.8 Secret Cinema
URL: https://www.secretcinema.com/

### What is strong
- Strong world-building.
- Big emotional promise.
- Testimonial framing and cultural credibility feel premium.
- Good reminder that entertainment brands can sell atmosphere before details.

### Worth borrowing for BCN
- One immersive section per page.
- High-confidence testimonial or quote treatment.
- Hero mood that feels like a real night out, not a dashboard.
- Bigger use of image, contrast, and controlled mystery.

### Avoid
- Don’t obscure logistics.
- BCN must stay clearer on date/time/venue/CTA.
- Avoid overdramatic copy that doesn’t match stand-up’s warmth.

### BCN translation
Best influence on:
- Concept D mood sections
- Concept E premium atmosphere
- large pull-quote blocks

---

## 4.9 Time Out
URL: https://www.timeout.com/

### What is strong
- Strong editorial energy.
- Big image-led hierarchy.
- Immediate sense of local authority and cultural relevance.
- Good pacing between major feature stories and smaller discovery modules.

### Worth borrowing for BCN
- Magazine-like rhythm.
- Feature block + smaller secondary cards.
- Headlines that sound like a nightlife editor, not a template.
- Strong image crops with short supporting text.

### Avoid
- Don’t create feed sprawl.
- Too many competing stories would weaken ticket conversion.
- BCN should use editorial richness selectively.

### BCN translation
Best influence on:
- Concept B homepage hierarchy
- event-feature modules
- stronger headline voice

---

## 4.10 A24
URL: https://a24films.com/

### What is strong
- Strong art direction through restraint.
- Typography, spacing, and cropping do more than decoration.
- Feels designed because it commits to a point of view.
- Uses negative space intelligently.

### Worth borrowing for BCN
- Cleaner premium compositions.
- Fewer but more deliberate elements.
- Large image crops with room to breathe.
- Typography doing brand work instead of endless UI chrome.

### Avoid
- Don’t become too aloof or cool-to-click.
- BCN still needs obvious conversion actions and warmth.

### BCN translation
Best influence on:
- Concept E premium minimal
- poster-style hero compositions
- calmer section pacing

---

## 5) Cross-site synthesis: strongest patterns worth borrowing

## 5.1 Layout systems

### Best recurring pattern
A **clear anchor block** + supporting modules.

Examples:
- one featured event + 2–3 supporting cards
- one city chooser band + one schedule row
- one media-proof block + one immediate CTA strip

### Good for BCN
- Asymmetric 60/40 or 65/35 hero grids
- One full-bleed feature followed by tighter card rows
- City tiles in a 2x2 rhythm for desktop, stacked on mobile
- Alternating dense/light sections to avoid a wall of equal cards

### Avoid
- Endless same-size cards
- every section in the same rounded frosted box
- uniform padding/radius/shadow everywhere

---

## 5.2 Hero sections

### Best patterns
1. **Split hero**: text left, next event card or media right
2. **Text-over-image hero** with a strong dark scrim
3. **City chooser hero** where the four city choices are the visual centerpiece
4. **Feature-story hero** with an editorial deck and CTA

### BCN guidance
For BCN, the hero should always show:
- next event or next relevant city event
- date + time
- venue + city
- ticket CTA

### Avoid
- abstract hero art with no event data
- autoplay background video as the only proof
- long intro copy before the first action

---

## 5.3 Card systems

### Strong card traits in this category
- visible date first
- city/venue label close to title
- one dominant CTA
- small badge system for free/paid/selling fast/recurring
- cards that do not require opening another page to understand the offer

### BCN card recommendation
Use 3 main card modes only:
- **featured event card**
- **standard event card**
- **city card**

Do not invent 7–8 card types unless the concept is explicitly editorial.

---

## 5.4 Color systems

### Strongest category pattern
Dark base + controlled accents.

### BCN-specific recommendation
Keep BCN’s dark base.
Use accent color with purpose:
- orange/lime for CTA emphasis
- city colors for filters, borders, map dots, or section labels
- not full-page color explosions everywhere

### Best use of city colors
Use city color as:
- top border
- tab underline
- date badge fill
- small spotlight glow behind card/image
- newsletter select accent

### Avoid
- recoloring whole layouts by city in a way that breaks brand unity
- using all four city colors at equal strength in the same viewport

---

## 5.5 Social proof blocks

### Best patterns
- trust numbers near the top
- one real quote, not five fake-looking ones
- crowd/stage image adjacent to ticket area
- logos/venues as secondary proof, not the headline

### BCN proof stack that should work well
1. `14 venues · 164+ shows · 11,900+ tickets`
2. real venue names
3. one real crowd or stage image
4. one short quote or line about atmosphere

### Avoid
- giant testimonial carousels
- anonymous quotes
- proof blocks without concrete venue/city names

---

## 5.6 Gallery and image treatments

### Best category patterns
- one strong anchor image
- short stacks of supporting images
- poster-style portrait crops mixed with landscape crowd shots
- masonry only when image quality is strong

### BCN recommendation
Prefer:
- 1 hero image
- 2–3 support images max per section
- portrait crops for posters/comedians
- landscape crops for crowd + venue context

### Avoid
- busy 6–12 image grids on the homepage
- stock nightlife shots with no BCN reality nearby
- posters with too much baked-in text shrunk to unreadable cards

---

## 5.7 CTA placement

### Strongest recurring patterns
- CTA in hero
- CTA on every event card
- sticky mobile action bar or persistent “next show” strip
- newsletter CTA as backup conversion, not footer exile

### BCN recommendation
Best practical stack:
- Hero CTA = nearest ticket
- Secondary CTA = choose city / see all shows
- Sticky bar on mobile = next show + ticket button
- Newsletter CTA = below upcoming shows or after first proof block

### Avoid
- “Learn more” as the primary action everywhere
- hiding ticket links inside detail drawers only
- forcing users through a modal when a direct Eventbrite click is enough

---

## 5.8 Mobile navigation patterns

### Best-fit patterns for BCN
- top nav on desktop
- segmented city tabs/chips
- sticky bottom bar on mobile
- detail drawers/inline expanders instead of full subpages where useful

### Best alternative to hamburger
If there are only a few routes, use:
- Shows
- Cities
- About
- Join

This is often better than a hamburger.

### Avoid
- hamburger + hidden city filters + hidden CTA
- top nav with too many same-weight links

---

## 6) Patterns to actively avoid

These are the fastest routes to “generic AI event site”.

- A hero with nice gradients but no real next-show information
- Too many frosted glass panels with identical radii and shadows
- Overuse of pills/badges to the point they lose meaning
- Endless equal-weight cards
- Generic neon-on-dark without a clear brand point of view
- Stock crowd photos with no venue/date/city anchoring
- Long paragraphs explaining BCN before showing a show
- Filters hidden in dropdowns instead of visible chips/tabs
- Too many fonts or too little contrast between display/body roles
- Carousels that hide content people would have clicked if it were simply visible

---

## 7) Image and graphic treatments that create energy + trust

## 7.1 Best image mix for BCN

### Energy images
Use for emotion:
- crowd laugh moments
- performer on mic mid-reaction
- warm venue lighting
- close crowd/stage compositions

### Trust images
Use for credibility:
- venue exterior/interior
- wider room shots showing audience density
- poster-at-venue or door/queue shots
- recognizable city context used sparingly

### Best balance
One energy image + one trust image near the top usually beats a large gallery.

---

## 7.2 Best image treatments

### 1. Dark scrim over real photo
Good for:
- hero readability
- clear white type
- strong CTA contrast

### 2. Duotone accent wash
Use orange, lime, or city accent at 10–25% opacity.
Good for making mixed-source imagery feel like one system.

### 3. Framed proof image with caption
Example caption style:
- `Brussels · Latroupe Grote Markt · 80-cap room`

This turns a photo into evidence, not decoration.

### 4. Poster stack + crowd crop
Combines editorial energy with realism.
One 2:3 portrait poster beside one 16:9 crowd image works very well.

### 5. Slight grain/noise overlay
Helps avoid overly clean AI-polished flatness.
Use lightly.

### Avoid
- heavy blur on the image itself
- overly saturated neon over every photo
- using only performer headshots with no room context

---

## 8) Practical CSS / SVG graphic ideas

These are intentionally low-tech and static-site friendly.

## 8.1 Spotlight glow behind hero copy
```css
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 22% 28%, rgba(255, 90, 54, 0.24), transparent 22%),
    radial-gradient(circle at 80% 18%, rgba(232, 255, 97, 0.14), transparent 18%);
  pointer-events: none;
}
```
Use when the hero needs stage energy without full video.

## 8.2 Ticket-stub edge divider
```css
.ticket-divider {
  height: 24px;
  background:
    radial-gradient(circle at 12px 12px, transparent 10px, rgba(255,255,255,0.08) 10.5px) repeat-x;
  background-size: 24px 24px;
}
```
Use between hero and schedule, or between event cards and newsletter.

## 8.3 Halftone dot field
```css
.halftone {
  background-image: radial-gradient(rgba(255,255,255,0.12) 0.8px, transparent 0.8px);
  background-size: 10px 10px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1), transparent);
}
```
Useful for editorial or poster-inspired concepts.

## 8.4 City accent rail
```css
.city-rail[data-city="ghent"] { --city: #7a5cff; }
.city-rail::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--city);
}
```
Small, practical, readable.

## 8.5 Angled section divider via SVG
Use an inline SVG polygon/path at section boundaries.
Good for:
- breaking stacked card fatigue
- adding motion without animation
- distinguishing editorial or nightlife concepts

## 8.6 Badge/stamp SVGs
Useful motifs:
- `FREE ENTRY`
- `SELLING FAST`
- `THIS WEEK IN BRUSSELS`
- `BEST OF BELGIUM`
- `80-CAP ROOM`

Make them look like poster stickers, not app tags.

## 8.7 Marquee strip
A thin full-width strip can carry:
- city names
- trust stats
- venue names
- “English-language comedy nights across Belgium”

Use in motion only if subtle.
Even static, it adds rhythm.

## 8.8 Mic / spotlight / skyline icon set
Simple inline SVG set to repeat across sections:
- microphone
- stool or spotlight cone
- speech bubble burst
- Brussels/Ghent/Leuven/Antwerp skyline fragments

Keep stroke weight consistent.
Each icon should look like part of one family.

---

## 9) Section transition ideas

These help concepts feel designed rather than box-stacked.

### 1. Spotlight fade
Dark hero fades into a lighter proof band through a soft radial gradient.
Good for premium + media concepts.

### 2. Ticket-stub notch transition
Use perforation/notch logic between sections.
Good for conversion-first and event-card concepts.

### 3. Poster overlap
Let one portrait image overlap the next section by 32–56px.
Good for editorial concepts.

### 4. City-color underline band
A narrow band changes accent color as the user moves into a city-specific zone.
Good for city-network concepts.

### 5. Diagonal slice / hard angle
A bold angular divider adds nightlife energy.
Good for more energetic concepts.
Use sparingly.

### 6. Grain-to-clean transition
A textured hero can give way to a cleaner schedule section.
Good when you want mood first, clarity second.

---

## 10) CTA and navigation patterns worth testing

## 10.1 Best overall CTA stack for BCN

### Desktop
- top-right `Get tickets` or `See upcoming shows`
- hero primary CTA = nearest ticket
- hero secondary CTA = choose city / explore schedule
- visible CTA on each of the first 2–3 event cards

### Mobile
- top chips for city filters
- visible ticket button before first big scroll
- sticky bottom bar with next event + CTA

---

## 10.2 Good CTA copy for BCN

More direct:
- Get tickets
- Reserve free spot
- See Brussels shows
- Next Antwerp date
- Get city updates

Less effective as primary CTA:
- Learn more
- Discover
- Explore now
- View details

Use “details” as a secondary action only.

---

## 10.3 Navigation patterns by concept type

### Conversion-first
- Shows
- Cities
- Join
- About

### Editorial
- Featured
- This week
- Cities
- Journal / About

### City-network
- Brussels
- Ghent
- Leuven
- Antwerp
- Join

### Proof/media
- Next show
- Proof
- Cities
- Join

### Premium minimal
- Curated shows
- Schedule
- About
- Join

---

## 11) Typography recommendations

All pairings below are Google Fonts.
None use Inter, Roboto, or Space Grotesk.

## 11.1 Syne + Manrope
- **Use for:** conversion-first with more edge
- **Why it works:** Syne gives character without becoming novelty; Manrope stays clean and efficient
- **Best fit:** Concept A or a bolder version of C
- **Notes:** use Syne 700–800 for headlines only

## 11.2 Bricolage Grotesque + Plus Jakarta Sans
- **Use for:** proof-led, modern, energetic BCN
- **Why it works:** friendly but sharp; strong brand energy; good on dark backgrounds
- **Best fit:** Concept D
- **Notes:** great for expressive numerals and stat blocks

## 11.3 DM Serif Display + Source Sans 3
- **Use for:** editorial/comedy-night magazine tone
- **Why it works:** high contrast between feature headlines and practical body copy
- **Best fit:** Concept B
- **Notes:** use serif only for large headlines, not small UI

## 11.4 Chivo + IBM Plex Sans
- **Use for:** city-network / utilitarian cultural brand
- **Why it works:** sturdy, urban, slightly poster-like, very readable
- **Best fit:** Concept C
- **Notes:** IBM Plex Sans also works well with small city/date metadata

## 11.5 Fraunces + Public Sans
- **Use for:** premium minimal
- **Why it works:** Fraunces adds elegance and warmth; Public Sans keeps utilities clean
- **Best fit:** Concept E
- **Notes:** use a restrained color palette so the type can carry tone

## 11.6 Bebas Neue + DM Sans
- **Use for:** louder nightlife/poster direction
- **Why it works:** instantly event-like; strong poster DNA; high-impact headlines
- **Best fit:** a more campaign-like variant of A or D
- **Notes:** all-caps only in controlled doses; support with generous spacing

## 11.7 Unbounded + Work Sans
- **Use for:** experimental or youth-leaning city/event concept
- **Why it works:** strong personality, high differentiation, good for limited use
- **Best fit:** bolder city or nightlife concept only
- **Notes:** headlines only; can become tiring if overused

## 11.8 Playfair Display + Sora
- **Use for:** polished editorial/premium hybrid
- **Why it works:** classic-meets-modern without going corporate
- **Best fit:** premium editorial variant of B or E
- **Notes:** good if BCN wants a more date-night, less club-night tone

### Short shortlist by concept
- **A Conversion-first:** Syne + Manrope
- **B Editorial:** DM Serif Display + Source Sans 3
- **C City-network:** Chivo + IBM Plex Sans
- **D Proof/media:** Bricolage Grotesque + Plus Jakarta Sans
- **E Premium minimal:** Fraunces + Public Sans

---

## 12) How to make each concept feel designed, not generated

## 12.1 Pick one dominant motif per concept
Examples:
- ticket stub / perforation
- spotlight cone
- city stripe / route map
- poster collage
- elegant frame / gallery rail

Then repeat it with discipline.

## 12.2 Limit each concept to 2–3 signature moves
For example:
- editorial concept = serif headlines + portrait poster crops + overlap sections
- city concept = strong tabs + accent rails + map-like dotted connectors
- premium concept = quiet spacing + restrained color + refined image frames

## 12.3 Use real BCN facts in the microcopy
Examples:
- `14 venues across 4 cities`
- `Latroupe Grote Markt · Brussels`
- `English Stand-Up Comedy Antwerp: Best of Belgium`
- `Free entry` vs `Paid ticket`

Specificity instantly reduces template feeling.

## 12.4 Vary image ratios on purpose
Don’t make every media slot the same rounded 16:9 box.
Use:
- 16:9 for crowd/context
- 4:5 for venue/people
- 2:3 for posters
- full-width crop for editorial features

## 12.5 Let typography do some of the heavy lifting
Not every section needs extra gradients, borders, and stickers.
If the type hierarchy is strong, the site already feels more authored.

---

## 13) Suggested translation into the five BCN concepts

These are **direction guards**, not strict rules.

## Concept A — conversion-first
Lean into:
- DICE clarity
- RED MIC schedule directness
- sticky mobile CTA
- ticket-stub or stub-notch motif
- Syne + Manrope or Chivo + IBM Plex Sans

Avoid:
- too much gallery/media
- too much explanation

## Concept B — editorial show-first
Lean into:
- Time Out pacing
- The Moth emotional tone
- portrait poster crops + full-bleed crowd image
- serif display typography
- overlap transitions

Avoid:
- making it read like a blog before showing ticket actions

## Concept C — city-network
Lean into:
- Soho Theatre locality
- Fever “experience your city” framing
- Songkick “near you” logic
- visible city tabs/chips
- accent rails and city color system

Avoid:
- turning each city into a completely different brand

## Concept D — trust/media/proof
Lean into:
- Secret Cinema atmosphere
- Bricolage/Plus Jakarta or similar modern expressive type
- one strong proof image per section
- venue/crowd captions
- stats close to ticket CTA

Avoid:
- heavy galleries and lazy carousels
- weak or repetitive assets

## Concept E — premium minimal
Lean into:
- A24 restraint
- Soho trust tone
- Fraunces + Public Sans or Playfair + Sora
- fewer cards, cleaner schedule rows
- subtle grain, elegant image framing

Avoid:
- hiding breadth so much that BCN feels inactive

---

## 14) Strongest practical recommendations for BCN V1 concepts

If the team only implements a few research findings, make it these:

1. **Replace Inter-based sameness with concept-specific type pairings.**
2. **Keep a visible ticket CTA on the first screen.**
3. **Use one strong real image near the first conversion point.**
4. **Show trust stats early and concretely.**
5. **Use city color as navigation logic, not random decoration.**
6. **Break the current shared glass-card visual sameness.**
7. **Use 1–2 custom graphic motifs per concept so each one has a signature.**

---

## 15) Reference count

Reference sites reviewed for this document: **10**

1. DICE — https://dice.fm/
2. RED MIC — https://red-mic.com/
3. Soho Theatre — https://www.sohotheatre.com/
4. Edinburgh Festival Fringe — https://www.edfringe.com/
5. Fever — https://feverup.com/en
6. Songkick — https://www.songkick.com/
7. The Moth — https://themoth.org/
8. Secret Cinema — https://www.secretcinema.com/
9. Time Out — https://www.timeout.com/
10. A24 — https://a24films.com/

---

## 16) Bottom line

The best BCN concepts will probably share a few fundamentals:
- clear ticket path
- strong city logic
- visible proof
- one memorable visual motif
- more deliberate typography

But they should **not** share the same shell.

The next pass should keep the existing strategic split between A/B/C/D/E while pushing much harder on:
- type personality
- section rhythm
- graphic language
- image framing
- CTA behavior

That is the difference between “five variants” and “five real choices.”
