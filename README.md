# BCN-dashboard

Thin read-only frontend for reporting exports (package name may still show `future-dashboard`).

## Data source

JSON snapshots copied into `public/data/`. The export script lives under `COMEDY-ORG-BACKEND/OLDSTUFF/`:

```bash
cd ../COMEDY-ORG-BACKEND/OLDSTUFF
python scripts/export_dashboard_data.py
cp dashboard_exports/*.json ../BCN-dashboard/public/data/
# Keep series_tracked.json (or edit it) — it drives Series vs Standalone labels on Home.
```

## Run

```bash
npm install
npm run dev
```

## Refreshing data

After you copy new JSON into `public/data/`, use **Reload data** in the header (fetches with cache-busting) or hard-refresh the browser so you are not seeing a cached `overview.json`. Optional **Auto-refresh (5 min)** re-fetches JSON on a timer (uses the same cache-busted loader).

## `series_tracked.json`

Defines which Eventbrite listing titles count as **Series** (substring match). Everything else is labeled **Standalone** on Home. Align entries with `COMEDY-ORG-BACKEND/config/eventbrite_tracked_series.json` when you add tracked series.

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

## Scope

- 2025+ reporting window
- Eventbrite reservations / orders / upcoming events
- SumUp tracked income
- venue and event comparisons
- data quality snapshot

No provider API access lives here.

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
