# BCN dashboard integration notes

Integration pass for `BCN-Track/projects/website-job/bcn-dashboard-ops-requirements-2026-04-04.md`.

## Requirement coverage

- **§2** — calendar-first upcoming view, exact dates, countdown, empty-day visibility, logical merged show lines
- **§3** + **§8** — canonical occurrence model (`occurrence_id` = venue + local start datetime), duplicate Eventbrite listings collapsed under one logical event
- **§4.1** — per-show cumulative reservation history modal wiring via `occurrence_reservation_history.json`
- **§4.2** — day/week lead-curve contract preserved with optional `sales_lead_curves.json`; dashboard can also derive curves from occurrence history when populated
- **§5** — ad attribution direction is documented/stubbed only; no connector/UI shipped in this pass
- **§6** — venue/deal economics config for Walliwer + La Troupe remains integrated in reporting
- **§7** — finance ledger + unmarked queue scaffolding remains additive and load-safe

## Files / data artifacts in play

### Front-end

- `src/loadDashboardData.js`
  - still collapses older listing-level snapshots client-side
  - now also loads optional `sales_lead_curves.json`
- `src/utils/metrics.js`
  - occurrence history lookup now prefers occurrence identity and checks merged Eventbrite ids
- `src/utils/leadCurve.js`
  - accepts occurrence-first lookup plus fallback eventbrite ids
  - accepts either `salesLeadCurves: []` or `salesLeadCurves: { curves: [] }`
- `src/components/EventDetailModal.jsx`
  - lead-curve empty state now documents the real blockers more precisely
- `README.md`
  - documents optional `sales_lead_curves.json`

### Dashboard data files

- `public/data/occurrence_reservation_history.json`
- `public/data/sales_lead_curves.json` *(stub placeholder committed so the fetch path is stable even before the exporter reruns)*
- existing additive files from adjacent workstreams remain supported:
  - `public/data/venue_economics.json`
  - `public/data/ledger_snapshot.json`
  - `public/data/unmarked_transactions_queue.json`

### Real exporter path currently in use

- `../BCN-Backend/OLDSTUFF/scripts/export_dashboard_data.py`
  - occurrence-based export already exists here
  - this integration pass adds `sales_lead_curves.json` generation here too so the live exporter path matches the dashboard contract better

## Implemented vs stubbed vs blocked

### Implemented now

- Occurrence-first identity is the effective dashboard model (**§3**, **§8**) even when public snapshot JSON is older and still listing-shaped.
- Calendar-first Home experience stays intact (**§2**).
- Venue economics and finance scaffolding remain additive and do not break the dashboard (**§6**, **§7**).
- Lead-curve data contract is now wired on both sides:
  - UI can consume optional `sales_lead_curves.json`
  - real exporter path now emits it
  - UI still works off occurrence history when that file is populated (**§4.2**)

### Stubbed / not implemented in this pass

- Meta/boosted-post ad attribution, occurrence spend allocation, cost-per-show, and return metrics (**§5**)
- Manual override workflow for attribution (**§5.1**)
- Invoice workflow / finance operations beyond the current reporting reminders and ledger scaffolding (**§6**, **§7**)

### Blocked / waiting on fresh data

- The committed dashboard snapshot still has placeholder/empty occurrence history data, so per-show history and benchmark curves will stay mostly empty until the exporter is rerun and copied into `public/data/`.
- I did **not** rerun the BigQuery-backed exporter in this pass, so exported JSON freshness is unchanged.

## Verification

### Verified here

- `npm run build` in `BCN-dashboard/` — **passed** after integration changes.

### Not verified here

- I could **not** run a backend syntax/export smoke check through `python3 -m py_compile` or rerun the exporter from this session.
- Because the current committed `occurrence_reservation_history.json` is a placeholder, I could not truthfully claim live chart-data verification.

## Suggested re-verification after export refresh

1. Run the real exporter from `BCN-Backend/OLDSTUFF/`.
2. Copy refreshed JSON into `BCN-dashboard/public/data/`.
3. Start the dashboard and hard refresh / use **Reload data**.
4. Confirm:
   - duplicate EB listings collapse to one occurrence row (**§3**, **§8**)
   - Home calendar shows exact dates + empty gaps + countdowns (**§2**)
   - event modal shows per-show cumulative reservation history when occurrence history is populated (**§4.1**)
   - event modal lead curve works on both day/week axes and benchmark line appears when comparable completed shows exist (**§4.2**)
   - Walliwer / La Troupe rules still render in Reporting (**§6**)
   - ledger / unmarked queue files still load without breaking the app (**§7**)
