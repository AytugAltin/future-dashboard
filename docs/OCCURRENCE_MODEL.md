# Occurrence model migration notes

Scope: BCN dashboard/event export identity changes from 2026-04-04 requirements §3 + §8.

## Why this changed

Raw Eventbrite listings were not a safe canonical event unit.

A single real-world show could appear as multiple Eventbrite URLs/listings for the same venue and same start datetime, which caused:

- duplicate upcoming rows
- inflated `events_total` / `upcoming_events`
- misleading "standalone" surfacing in the UI

The canonical unit is now **one logical occurrence**.

Rule:

- same **location/venue** + same **start datetime** => same occurrence

## Canonical identifier

Each occurrence row now carries:

- `occurrence_id`

It is derived from:

- normalized venue name (+ city for stability)
- event date
- local start time
- timezone

Example shape:

```json
{
  "occurrence_id": "latroupe-grote-markt-bruxelles__2026-04-16t20-00__europe-brussels"
}
```

## Row shape changes

Occurrence-oriented exports now expose these fields on each logical event row:

```json
{
  "occurrence_id": "latroupe-grote-markt-bruxelles__2026-04-16t20-00__europe-brussels",
  "primary_eventbrite_event_id": "1979661782683",
  "eventbrite_event_ids": ["1979661782683", "1986321843103"],
  "eventbrite_urls": [
    "https://www.eventbrite.com/e/1979661782683",
    "https://www.eventbrite.com/e/1986321843103"
  ],
  "eventbrite_titles": [
    "Academy Comedy Nights – Free English Stand-Up in Brussels"
  ],
  "merged_event_count": 2,
  "event_date": "2026-04-16",
  "local_time": "20:00",
  "venue_name": "Latroupe Grote Markt",
  "venue_city": "Bruxelles",
  "reservation_count": 1,
  "event_capacity": 80
}
```

## Compatibility notes

- `event_id` may still be present on occurrence rows, but it is only a **representative Eventbrite listing id**.
- Do **not** use `event_id` as canonical identity anymore.
- Use `occurrence_id` for joins, dedupe, attribution, and UI keys.
- Use `eventbrite_event_ids` / `eventbrite_urls` when you need the underlying Eventbrite listings.

## File-level expectations

These exports should now be interpreted as occurrence-based:

- `overview.json`
- `events_overview.json`
- `occurrences.json`
- `upcoming_events.json`
- `venues.json`
- `sales_timeseries.json`

Legacy note:

- `events.json` is still written for compatibility, but it is **not** the canonical occurrence identity export.

## Consumer migration checklist

1. Replace UI/table keys based on `event_id` with `occurrence_id`.
2. Stop rendering any global "Standalone" state from absence of a tracked series match.
3. Treat `merged_event_count > 1` as a same-occurrence Eventbrite merge, not as multiple real shows.
4. When opening Eventbrite, prefer `eventbrite_urls` over constructing a single URL from `event_id`.
5. Use occurrence-level totals/counts for dashboard KPIs and venue rollups.

## Front-end backstop

`src/loadDashboardData.js` also collapses duplicate venue+datetime rows client-side, so older snapshots still render as logical occurrences until fresh exports are copied in.
