# Finance ledger — minimal §7 implementation

This is the smallest finance layer added for the April 2026 ops requirements.

## What it does now

- Stores finance amounts in **integer minor units** (`amount_minor`) with `currency_scale: 2`.
  - For EUR, that means **cents only** — no floats in the ledger model.
- Adds a minimal balanced ledger snapshot shape in `public/data/ledger_snapshot.json`.
- Adds an **unmarked transaction queue** in `public/data/unmarked_transactions_queue.json`.
- Adds import helpers for **SumUp-like** rows:
  - normalize raw provider rows
  - classify through a caller-supplied hook
  - write either a balanced ledger transaction or an unmarked queue item
  - re-hydrate an unmarked queue item later into a final ledger transaction via `resolveUnmarkedTransaction()`
- Exposes both files through the dashboard loader so later UI/reporting work can read them without changing the fetch path again.

## Files

- `src/finance/ledgerSchema.js`
- `src/finance/importHooks.js`
- `schemas/ledger_snapshot.schema.json`
- `schemas/unmarked_transactions_queue.schema.json`
- `public/data/ledger_snapshot.json`
- `public/data/unmarked_transactions_queue.json`

## Model choices

### 1) Cent-safe amounts

The finance model does **not** persist `12.34` as a JS float.

It persists:

```json
{
  "amount_minor": 1234,
  "currency": "EUR",
  "currency_scale": 2
}
```

This keeps bookkeeping aligned with §7: every cost / inflow should be tracked **down to the cent**.

### 2) Balanced transactions

A ledger transaction contains signed lines that must sum to zero.

Example revenue settlement from SumUp:

- `asset:sumup_balance` +1967
- `expense:payment_processor_fees` +33
- `revenue:show_sales` -2000

That makes reconciliation less fragile than a single signed amount field.

### 3) Unmarked queue instead of fake certainty

If an imported provider flow cannot be safely classified, it goes to the unmarked queue with:

- gross / fee / net amounts in cents
- provider reference
- optional suggested occurrence ID
- raw excerpt
- reason for deferral

That matches the requirement to support transactions that can be classified later instead of guessed now.

## Import / reconciliation assumptions

Current assumptions are intentionally narrow:

1. **Single currency for now:** EUR only in the stored snapshot/schema.
2. **Provider rows may expose gross, fee, net, or only part of that trio.**
   - If `net` is missing, the hook derives `net = gross - fee`.
3. **SumUp-like flows are an adapter point, not a finished connector.**
   - The code normalizes rows that already exist in JSON / CSV / script output.
   - It does **not** yet pull from SumUp API directly.
4. **Occurrence linking is optional but supported.**
   - Classification hooks can attach `occurrence_id`.
   - If no safe occurrence match exists, keep the item unmarked.
5. **Manual classification should beat heuristics.**
   - The batch builder queues unknown rows instead of forcing them into revenue/cost/internal transfer.
6. **Settlement account first.**
   - Default asset account is `asset:sumup_balance`.
   - Future bank-settlement matching can reconcile provider balance movements vs bank inflows.

## Future SumUp integration point

The integration point is `buildLedgerImportBatch()` in `src/finance/importHooks.js`.

Expected future flow:

1. Fetch SumUp payout / transaction rows from API or exported CSV.
2. Pass each raw row through `normalizeSumUpFlow()` (or another provider adapter).
3. Call a BCN-specific `classify(flow)` hook that can:
   - mark show revenue
   - mark venue / ad / ops costs
   - mark internal transfers
   - leave uncertain rows unmarked
4. Merge the batch into:
   - `ledger_snapshot.json`
   - `unmarked_transactions_queue.json`

Other processors can use the same batch builder by supplying a different adapter.

## Deferred on purpose

Not built yet:

- SumUp API client / auth / sync job
- bank reconciliation logic
- UI for queue review / manual classification
- duplicate import detection / idempotency rules beyond provider references
- VAT / invoice-specific accounting rules
- multi-currency handling

That is deliberate: §7 needed a **minimal ledger shape + safe import boundary**, not a full accounting product.
