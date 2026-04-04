# BCN-dashboard

Thin read-only frontend for reporting exports (package name may still show `future-dashboard`).

## Data source

JSON snapshots copied into `public/data/`. The export script currently still lives under `BCN-Backend/OLDSTUFF/`:

```bash
cd ../BCN-Backend/OLDSTUFF
python scripts/export_dashboard_data.py
cp dashboard_exports/*.json ../BCN-dashboard/public/data/
# Keep venue_economics.json — it encodes Walliwer / La Troupe deal rules for reporting.
```

## Occurrence model (2026-04-04)

The dashboard no longer treats raw Eventbrite listing rows as the canonical event unit.

Canonical unit now = **one logical occurrence**:

- same **venue/location** + same **start datetime** ⇒ same occurrence
- duplicate Eventbrite listings collapse under one `occurrence_id`
- `events_overview.json`, `upcoming_events.json`, `venues.json`, `sales_timeseries.json`, `occurrence_reservation_history.json`, optional `sales_lead_curves.json`, and headline counts are occurrence-based
- each occurrence keeps its underlying Eventbrite listing ids/urls in `eventbrite_event_ids` / `eventbrite_urls`

Relevant fields now present on occurrence rows:

- `occurrence_id` — canonical stable id derived from venue + local start datetime
- `primary_eventbrite_event_id` — representative listing id for compatibility only
- `eventbrite_event_ids` — all merged Eventbrite listing ids for that occurrence
- `eventbrite_urls` — public Eventbrite links for those listings
- `eventbrite_titles` — underlying listing titles merged into the occurrence
- `merged_event_count` — number of Eventbrite listings collapsed into that row

Migration notes for consumers: see `docs/OCCURRENCE_MODEL.md`.

## Run

```bash
npm install
npm run dev
```

## Refreshing data

After you copy new JSON into `public/data/`, use **Reload data** in the header (fetches with cache-busting) or hard-refresh the browser so you are not seeing a cached `overview.json`. Optional **Auto-refresh (5 min)** re-fetches JSON on a timer (uses the same cache-busted loader).

## `series_tracked.json`

Still available for future title-family / series comparisons, but it no longer drives a global **Standalone** label on Home. The Home page now renders logical occurrences only.

## `venue_economics.json`

Config-backed venue/deal rules for reporting:

- **Walliwer** — approximate income discount, no-SumUp split, low-ad-budget guidance.
- **La Troupe** — €100 per-show BCN cost plus cadence/ops reminders.

Schema lives beside it at `public/data/venue_economics.schema.json`.

Important: this config is for **reporting + assumptions only**. Invoice workflow stays **backlog only** in this repo pass.

## URL filters (bookmarkable)

Query parameters are updated as you change filters (share or bookmark the URL):

| Param | Meaning |
|--------|---------|
| `tab=reporting` | Open the reporting tab (omit for Home) |
| `q` | Search substring on event names |
| `city` | Exact `venue_city` (city pills on Home; dropdown on Reporting) |
| `venue` | Exact venue name (from dropdown) |
| `from`, `to` | Reporting tab: date range for time-series charts (`YYYY-MM-DD`; empty = full range) |

Home hero metrics follow the **filtered** upcoming list except **Tracked net income**, which stays the export total. Reporting summary cards stay global; charts and tables respect filters.

## `occurrence_reservation_history.json`

Powers the per-show cumulative reservations view in the event detail modal.

- keyed by the same `occurrence_id` / logical occurrence model as `events_overview.json`
- points are daily cumulative Eventbrite reservations/orders leading up to the show
- when order-level history is imperfect, the export can annotate/fallback so the UI still lands on the current exported total instead of breaking

## `sales_lead_curves.json`

Optional precomputed lead-curve export for the days/weeks benchmark chart.

- loaded opportunistically from `public/data/`
- keyed by the same `occurrence_id`
- supports future exporter-side bucket generation without changing the dashboard fetch path again
- current UI can also derive the comparison chart from `occurrence_reservation_history.json` when that file is populated

## Scope

- 2025+ reporting window
- Eventbrite reservations / orders / upcoming occurrences
- SumUp tracked income
- venue and occurrence comparisons
- data quality snapshot
- minimal finance ledger / unmarked queue scaffolding for §7 bookkeeping work

No provider API access lives here.

## Finance ledger scaffolding

Optional extra JSON files can now live beside the existing dashboard export files:

- `public/data/ledger_snapshot.json`
- `public/data/unmarked_transactions_queue.json`

They are loaded through `src/loadDashboardData.js` and documented in `docs/FINANCE_LEDGER.md`.
The ledger model stores money in **integer cents** (`amount_minor`) so later reconciliation work can stay cent-accurate.

## BCN website concept previews

Static mock website concepts live under `public/website-concepts/`.

When running the Vite app locally, open:

- `/website-concepts/`

Concepts included:

- A — conversion-first
- B — show-first editorial
- C — city network
- D — media-rich proof
- E — premium minimal

They use filler content and placeholder media blocks so structure can be reviewed before real copy/assets are dropped in.
