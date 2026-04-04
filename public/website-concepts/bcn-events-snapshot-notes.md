# BCN events snapshot — freshness and source note

- **Generated:** 2026-04-04 (Europe/Brussels)
- **Dataset file:** `BCN-dashboard/public/website-concepts/bcn-events-snapshot.json`
- **Primary baseline:** the static upcoming-events JSON embedded in `BCN-Track/projects/website-job/bcn-website-design-sprint.md`

## What was verified

- All 8 provided per-date Eventbrite links resolved live on 2026-04-04.
- Ticket links were normalized to Eventbrite's canonical slugged URLs while keeping the original per-date `eventbrite_id` and raw short URL.
- Eventbrite recurring-series landing pages were also identified for the 3 surfaced BCN series:
  - Academy Comedy Nights – Free English Stand-Up in Brussels
  - Friday Night Stand-Up Comedy In English For FREE!
  - English Stand-Up Comedy Antwerp: Best of Belgium
- Accessible Eventbrite search pages surfaced date counts that match the provided snapshot:
  - Academy: **4 dates**
  - Friday Night: **1 date**
  - Antwerp Best of Belgium: **3 dates**

## Organizer-page check

- BCN organizer page fetch showed **4 upcoming activities** and **63 past**.
- The readable organizer-page extraction did **not** expose the titles of all 4 upcoming activities.
- Because of that, I did **not** add a speculative 9th event. The JSON stays conservative and only includes events confidently tied to the brief + verified live Eventbrite pages.

## Enrichment added

- Canonical ticket URLs
- Recurring-series URLs / master Eventbrite IDs where surfaced
- Description copy from public Eventbrite pages
- Venue address details where exposed
- Duration / doors-open info where exposed
- Ticketing-model notes (for example: Antwerp = free reservation online, **€5 paid at the door**)
- Lineup summaries when the public copy described the lineup style

## Known limits / uncertainty

- No reliable Eventbrite image URLs were exposed through the available web tools, so image fields are left `null` with notes.
- No named comedian lineups were exposed in the accessible fetches, so lineup fields are summary-only.
- Academy Comedy Nights pages exposed venue name and city, but not a clear street address in the readable fetch.
- Friday Night copy references **GC Kontakt** while the baseline venue name is **Av. Orban 54**; both are preserved as venue/address context rather than flattened into one unverified label.

## Practical use

This file is suitable for static website concepts and prototypes. For production publishing, re-check Eventbrite shortly before launch in case series dates, images, or lineup details change.
