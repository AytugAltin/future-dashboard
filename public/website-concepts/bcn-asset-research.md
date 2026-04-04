# BCN asset and image research

_Last updated: 2026-04-04 (Europe/Brussels)_

## What this is

Asset shortlist for the BCN website design sprint.

Purpose:
- give the concept workstreams real BCN public media to prototype with
- separate **strong trust-building live photos** from **poster-style promo art**
- flag what is **prototype-safe** vs **maybe reusable later**
- explicitly **not** pretend anything here is production-cleared

## Important rights / usage warning

**Do not treat any scraped/publicly visible asset here as production-cleared.**

Even when the source is BCN’s own public Instagram/Eventbrite presence:
- copyright may still sit with the original photographer / videographer / designer
- comedian likeness / venue permissions may matter
- Instagram and Eventbrite CDN URLs may be transient or platform-scoped
- poster art may contain third-party design elements or event-specific copy that should not be repurposed blindly

So the safe rule is:
- **prototype use:** yes
- **production clearance:** unknown until BCN confirms ownership/permission/original files

## Context from the current concepts folder

I checked the existing concept workspace first.

Current state:
- `BCN-dashboard/public/website-concepts/index.html` = 5 static filler mock sites
- all current concepts still use placeholder content / placeholder visuals
- `shared.css` still uses generic placeholder typography and styling

Most relevant asset holes:
- `concept-b-editorial.html`
  - needs: **feature hero**, **lineup poster**, **backstage still**
- `concept-d-media-proof.html`
  - needs: **crowd image**, **stage reaction**, **BTS setup**, **short clip covers**

So the main practical need is **1–2 real BCN trust images** plus **a few supporting promo tiles / clip covers**.

## Research method

Sources requested in the brief:
- Instagram: `https://instagram.com/belgiancomedynetwork`
- Eventbrite org: `https://www.eventbrite.be/o/belgian-comedy-network-66817651253`

What was actually accessible with available tools:
- Eventbrite pages were accessible via normal fetch + raw proxy fetch
- Instagram main profile page was login-gated in normal fetch
- Instagram **embed view** exposed profile metadata, profile pic, and several visible post/reel cover images
- Visual assessment was done from the public image URLs and page screenshots where possible

Limitations:
- I could not reliably enumerate the full Instagram grid
- some CDN asset URLs may expire
- ratings below are based on publicly visible renderings, not original uploads

## Platform-level signals worth borrowing into the website

### Instagram profile signal
Observed via embed:
- handle: `@belgiancomedynetwork`
- follower count visible at fetch time: **5,198 followers**
- visible posts in embed slice: **31 posts**

Useful for design:
- BCN already has enough public activity to justify a **social proof / “seen on Instagram”** layer
- but the usable assets are mixed: some are strong, some are very poster-heavy

### Eventbrite organizer signal
Observed via organizer page / event pages:
- organizer followers visible at fetch time: **696**
- total events visible at fetch time: **258**
- organizer page shows BCN as active with upcoming + past events

Useful for design:
- good fit for trust strip / proof block
- Eventbrite imagery contains both **authentic room photos** and **poster-style art**

## Quick shortlist by usefulness

### Best lead assets for the website
1. **EB-ANTWERP-LIVE-HERO** — strongest all-round trust / hype / social proof image
2. **IG-LATROUPE-CLIP-COVER** — best human/perfomer-centric supporting image if used carefully
3. **EB-ACADEMY-LIVE-PHOTO** — decent secondary real-show image, more intimate and less polished

### Best supporting assets
- **IG-CHEVAL-MARIN-CROWDWORK-COVER** — good for a reels/social-proof strip
- **EB-GHENT-ALLSTARS-COLLAGE** — good for a proof tile or secondary event card
- **EB-BELGIUM-IS-A-JOKE-BANNER** — good event-card art, not a hero

### Mostly prototype-only / reference-only
- **IG-ACADEMY-PROMO**
- **IG-ANTWERP-PROMO**
- **IG-LEFRIDGE-PROMO**
- **IG-BRUSSELS-IS-A-JOKE-PROMO**
- **EB-FRIDAY-ILLUSTRATED-CROWD**

Reason: too much baked-in text, too poster-like, or not enough real human atmosphere for homepage trust.

---

## Candidate asset assessments

### 1) IG-AVATAR-BCN
- **Source:** Instagram embed profile image
- **Source page:** https://www.instagram.com/belgiancomedynetwork/
- **Asset URL:** public Instagram CDN avatar (captured in manifest)
- **Type:** social avatar / logo reference
- **What it is:** bold yellow `BCN` lettering on black with a circular yellow ring
- **Quality / clarity:** good for avatar-scale reference, but it is a raster social avatar rather than a clean vector master
- **Crop friendliness:** excellent for square / circle; not meant for wide lockup use
- **BCN relevance:** high
- **Baked-in text issue:** none beyond the mark itself
- **Trust / hype / social proof:** brand recognition only, not trust proof
- **Best use:** prototype favicon/social badge/reference while recreating a cleaner vector lockup
- **Use status:** **potentially reusable as a reference, not as final brand master**
- **Rights note:** likely BCN-controlled brand usage, but still better to use the proper source SVG/logo rather than a scraped avatar

### 2) IG-ACADEMY-PROMO
- **Source:** Instagram embed post cover
- **Source page:** https://www.instagram.com/belgiancomedynetwork/
- **Type:** designed square poster over theater/stage seating background
- **Visible composition:** colorful seats + dark stage, stacked headline blocks (`Stand-Up Comedy`, `In English`, `Brussels`, `Free Entry`, `Tonight`, `8PM`)
- **Quality / clarity:** clean enough as a social tile; not premium as site media
- **Crop friendliness:**
  - hero: poor
  - event card: middling
  - square proof tile: good
- **BCN relevance:** high, clearly BCN event comms
- **Baked-in text problem:** **high**
- **Trust / hype / social proof:** low trust, medium hype, weak social proof
- **Best use:** archive/promo tile only
- **Use status:** **prototype-only**
- **Rights note:** public BCN promo art, but not assumed cleared for broader reuse

### 3) IG-ANTWERP-PROMO
- **Source:** Instagram embed post cover
- **Source page:** https://www.instagram.com/belgiancomedynetwork/
- **Type:** designed square poster with mic stand / stool / spotlight look
- **Visible composition:** black stage-like background, orange-red floor, big event copy, venue/date info
- **Quality / clarity:** visually readable, but generic-poster feeling
- **Crop friendliness:**
  - hero: poor
  - event card: okay
  - square proof tile: good
- **BCN relevance:** high
- **Baked-in text problem:** **very high**
- **Trust / hype / social proof:** weak trust, low-medium hype, weak social proof
- **Best use:** event archive tile / schedule card art
- **Use status:** **prototype-only**
- **Rights note:** public event poster art; ownership/reuse still unconfirmed

### 4) IG-LEFRIDGE-PROMO
- **Source:** Instagram embed post cover
- **Source page:** https://www.instagram.com/belgiancomedynetwork/
- **Type:** highly designed square poster
- **Visible composition:** blue brick-wall background, dense type, Le Fridge branding, playful cutout elements
- **Quality / clarity:** strong as social campaign art, not as flexible site imagery
- **Crop friendliness:**
  - hero: poor
  - event card: medium-poor
  - square proof tile: best fit
- **BCN relevance:** medium-high (partner / collab signal)
- **Baked-in text problem:** **very high**
- **Trust / hype / social proof:** low-medium trust, medium hype, weak social proof
- **Best use:** supporting promo archive tile in editorial / past-events sections
- **Use status:** **prototype/reference only**
- **Rights note:** partner branding likely involved; do not assume clean reuse rights

### 5) IG-BRUSSELS-IS-A-JOKE-PROMO
- **Source:** Instagram embed post cover
- **Source page:** https://www.instagram.com/belgiancomedynetwork/
- **Type:** illustrated concept poster
- **Visible composition:** bold headline, hat/mic/Belgian iconography, strong graphic hierarchy
- **Quality / clarity:** more polished than some other posters; still poster art, not documentary media
- **Crop friendliness:**
  - hero: medium-poor
  - event card: medium
  - square proof tile: good
- **BCN relevance:** high for campaign personality
- **Baked-in text problem:** **high**
- **Trust / hype / social proof:** low trust, medium-high hype, low social proof
- **Best use:** event-card artwork, campaign tile, editorial insert
- **Use status:** **prototype/reference only**
- **Rights note:** event-specific art; reuse should be treated as uncertain

### 6) IG-LATROUPE-CLIP-COVER
- **Source:** Instagram embed reel cover
- **Source page:** https://www.instagram.com/belgiancomedynetwork/
- **Type:** candid stage/video frame with text overlay
- **Visible composition:** comedian mid-shot with microphone, dark green curtain, audience heads low in frame, overlaid social text box
- **Quality / clarity:** reasonably clean; performer reads well
- **Crop friendliness:**
  - hero: decent but not ideal
  - event card: good
  - square proof tile: good
- **BCN relevance:** very high
- **Baked-in text problem:** medium (social overlay across torso)
- **Trust / hype / social proof:** strong trust, moderate hype, moderate social proof, decent editorial mood
- **Best use:** performer/event card, social proof strip, supporting editorial image
- **Use status:** **potentially reusable if BCN can export a clean frame from the original video; current scraped cover is safer for prototype**
- **Rights note:** likely BCN-posted video frame, but still not assumed production-cleared as-is

### 7) IG-CHEVAL-MARIN-CROWDWORK-COVER
- **Source:** Instagram embed reel cover
- **Source page:** https://www.instagram.com/belgiancomedynetwork/
- **Type:** candid crowdwork clip frame with meme-style text overlays
- **Visible composition:** comedian full-body on small stage, audience heads foreground, venue background, multiple meme captions / flags
- **Quality / clarity:** authentic social-native energy, but visually busy
- **Crop friendliness:**
  - hero: weak
  - event card: fair to weak
  - square proof tile: fair
- **BCN relevance:** high
- **Baked-in text problem:** high
- **Trust / hype / social proof:** moderate trust, moderate-strong hype, strong social-native proof
- **Best use:** “clips / reels / crowdwork” strip only
- **Use status:** **prototype-first; maybe reusable only if a clean frame can be exported**
- **Rights note:** same caution as above

### 8) EB-ANTWERP-LIVE-HERO
- **Source:** Eventbrite event page primary image
- **Source page:** https://www.eventbrite.be/e/english-stand-up-comedy-antwerp-best-of-belgium-tickets-1980258240705
- **Type:** real live event photo
- **Visible composition:** comedian on stage in a vaulted brick venue, large audience visible, warm lights + blue/purple ambience
- **Quality / clarity:** **high**; strongest real-photo asset found
- **Crop friendliness:**
  - hero: good
  - event card: decent with controlled zoom
  - square proof tile: excellent
- **BCN relevance:** very high
- **Baked-in text problem:** none / negligible
- **Trust / hype / social proof:** high trust, medium-high hype, **very high social proof**
- **Best use:** homepage hero, proof block lead image, about/community section, Antwerp city view
- **Use status:** **best “potentially reusable later” candidate, but still un-cleared**
- **Rights note:** do not assume BCN owns broad reuse rights just because it is on Eventbrite

### 9) EB-ACADEMY-LIVE-PHOTO
- **Source:** Eventbrite event page / organizer card image
- **Source page:** https://www.eventbrite.be/e/academy-comedy-nights-free-english-stand-up-in-brussels-tickets-1979661782683
- **Type:** real live event photo
- **Visible composition:** comedian against brick backdrop, audience silhouettes foreground, darker intimate room
- **Quality / clarity:** medium; authentic but less polished than Antwerp image
- **Crop friendliness:**
  - hero: weak to fair
  - event card: fair
  - square proof tile: okay
- **BCN relevance:** high
- **Baked-in text problem:** moderate venue graphics/signage in scene, but not poster text
- **Trust / hype / social proof:** medium trust, low-medium hype, medium-low social proof
- **Best use:** secondary gallery image, Brussels event detail support, “academy / intimate room” slot
- **Use status:** **potentially reusable with caution**
- **Rights note:** production reuse still uncertain

### 10) EB-FRIDAY-ILLUSTRATED-CROWD
- **Source:** Eventbrite organizer page primary image for Friday Night Stand-Up
- **Source page:** https://www.eventbrite.be/o/belgian-comedy-network-66817651253
- **Type:** illustrated/stylized crowd poster
- **Visible composition:** large laughing crowd faces with central `Stand-Up Comedy Free Show` text
- **Quality / clarity:** visually punchy, not documentary
- **Crop friendliness:**
  - hero: moderate at best
  - event card: fair to good
  - square proof tile: weak to fair
- **BCN relevance:** high
- **Baked-in text problem:** medium-high
- **Trust / hype / social proof:** low-medium trust, high hype, medium implied social proof but low credibility as real proof
- **Best use:** energetic event-card art, not homepage proof
- **Use status:** **prototype-only**
- **Rights note:** graphic poster reuse uncertain

### 11) EB-BELGIUM-IS-A-JOKE-BANNER
- **Source:** Eventbrite organizer page primary image for interactive show
- **Source page:** https://www.eventbrite.be/o/belgian-comedy-network-66817651253
- **Type:** landscape banner / poster graphic
- **Visible composition:** title at top-left, mic + hat + Belgian iconography, strong flat-color concept art
- **Quality / clarity:** clean for listing use
- **Crop friendliness:**
  - hero: fair
  - event card: good
  - square proof tile: poor
- **BCN relevance:** high for event branding personality
- **Baked-in text problem:** medium
- **Trust / hype / social proof:** medium trust as an organized event identity, medium hype, low social proof
- **Best use:** event card / schedule listing / campaign strip
- **Use status:** **prototype/reference only**
- **Rights note:** event-specific graphic asset, rights unverified

### 12) EB-GHENT-ALLSTARS-COLLAGE
- **Source:** Eventbrite organizer page primary image for Ghent show
- **Source page:** https://www.eventbrite.be/o/belgian-comedy-network-66817651253
- **Type:** photo collage with large promo text
- **Visible composition:** multiple laughing audience shots separated by dark bars, big `English Stand-Up Comedy` text in center
- **Quality / clarity:** warm and human, but busy
- **Crop friendliness:**
  - hero: poor to mediocre
  - event card: decent
  - square proof tile: good
- **BCN relevance:** high, especially for Ghent city view
- **Baked-in text problem:** high
- **Trust / hype / social proof:** moderate trust, good hype, **strongest value = social proof**
- **Best use:** proof tile, event card, city-specific supporting asset
- **Use status:** **prototype-first; maybe reusable if BCN owns the composite**
- **Rights note:** still uncertain

---

## Non-file platform references worth using

### REF-EVENTBRITE-ORGANIZER-BRAND-CARD
- **Source page:** https://www.eventbrite.be/o/belgian-comedy-network-66817651253
- **Why it matters:** the organizer page itself is useful as a design reference
- **Visible cues:**
  - circular yellow-on-black BCN avatar
  - blurred black/yellow banner backdrop
  - clear organizer name treatment
  - follower/event counts
  - upcoming/past segmentation
- **Use on website:** not as a literal screenshot, but as a reference for:
  - trust strip
  - social proof module
  - black/yellow accent layer
  - organizer credibility card

### REF-INSTAGRAM-EMBED-METADATA
- **Source page:** https://www.instagram.com/belgiancomedynetwork/
- **Why it matters:** supports a “find us on Instagram / clips / crowdwork” layer
- **Visible cues:**
  - 5,198 followers at fetch time
  - 31 visible post count in embed
  - mixed media strategy: posters + show clips + event promo tiles
- **Use on website:** a compact `Seen on Instagram` strip or proof module, not a full embed wall

---

## Recommended mapping to the current concept workstreams

### For Concept D — media / proof
Use these first:
1. **EB-ANTWERP-LIVE-HERO** as main proof image
2. **IG-LATROUPE-CLIP-COVER** as performer/clip card
3. **IG-CHEVAL-MARIN-CROWDWORK-COVER** as reels/social proof tile
4. **EB-ACADEMY-LIVE-PHOTO** as secondary room image

Avoid for lead slots:
- the heavy poster assets
- anything with too much baked-in event text

### For Concept B — editorial show-first
Use these first:
1. **EB-ANTWERP-LIVE-HERO** for feature hero or editorial opener
2. **IG-LATROUPE-CLIP-COVER** for performer-led supporting image
3. **EB-BELGIUM-IS-A-JOKE-BANNER** or **IG-BRUSSELS-IS-A-JOKE-PROMO** as a lineup/campaign insert

### For Concept C — city network
- Antwerp: **EB-ANTWERP-LIVE-HERO**
- Brussels: **EB-ACADEMY-LIVE-PHOTO** + **IG-ACADEMY-PROMO**
- Ghent: **EB-GHENT-ALLSTARS-COLLAGE**
- Brussels alt / campaign layer: **EB-BELGIUM-IS-A-JOKE-BANNER**

### For Concept E — premium minimal
Use very sparingly:
- **EB-ANTWERP-LIVE-HERO** only
- maybe **IG-AVATAR-BCN** as a small brand badge/reference

Do **not** use the busy posters as hero media in the premium route.

---

## Practical guidance for the designers

### Safe rule of thumb
- **Real room photo beats poster art** for homepage trust
- **Poster art beats empty placeholder boxes** for secondary event cards
- **Clip covers are useful only in small doses** because the overlaid social text gets messy fast

### Best website combinations
- homepage hero: **one real room photo**
- proof strip: **1 real crowd photo + 1 clip cover + 1 poster tile max**
- event cards: poster art is acceptable if the UI itself stays clean
- avoid stacking 3–4 baked-in-text posters next to each other

### If BCN can obtain originals later
Priority originals to request:
1. clean original of the **Antwerp live venue photo**
2. clean stills/exports from the **Latroupe** and **Cheval Marin** clips without overlay text
3. official vector / SVG source for the **BCN avatar/logo system**
4. any higher-res **Brussels / Ghent crowd photos** with visible audience reaction

## Bottom line

For the current sprint, the strongest real-media direction is:
- **lead with Eventbrite’s Antwerp live photo**
- support with **1–2 Instagram clip/stage stills**
- use the poster-heavy assets only as **secondary tiles/cards**, not as primary trust-building imagery

That gives the site real BCN energy without turning it into a wall of baked-in text.
