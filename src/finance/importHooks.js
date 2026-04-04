import {
  DEFAULT_CURRENCY,
  DEFAULT_CURRENCY_SCALE,
  createEmptyLedgerSnapshot,
  createEmptyUnmarkedTransactionQueue,
  decimalToMinorUnits,
  hydrateLedgerSnapshot,
  hydrateUnmarkedTransactionQueue,
} from './ledgerSchema.js'

export const DEFAULT_LEDGER_ACCOUNTS = {
  settlement: 'asset:sumup_balance',
  processorFees: 'expense:payment_processor_fees',
  revenue: 'revenue:show_sales',
  cost: 'expense:uncategorised',
  suspense: 'asset:pending_classification',
  transferSource: 'asset:source_balance',
  transferTarget: 'asset:target_balance',
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : value == null ? fallback : String(value)
}

function asNullableString(value) {
  if (value == null || value === '') return null
  return String(value)
}

function nowIso(now) {
  if (typeof now === 'function') return now()
  if (typeof now === 'string' && now) return now
  return new Date().toISOString()
}

function inferProviderRef(raw, provider) {
  return asNullableString(
    raw.provider_ref
      ?? raw.transaction_id
      ?? raw.payout_id
      ?? raw.id
      ?? raw.reference
      ?? raw.transaction_code
      ?? `${provider}-${raw.created_at ?? raw.booked_at ?? raw.date ?? Math.random().toString(36).slice(2)}`
  )
}

function inferOccurredAt(raw, importedAt) {
  return asString(raw.occurred_at ?? raw.created_at ?? raw.booked_at ?? raw.settled_at ?? raw.date, importedAt)
}

function sanitizeRawExcerpt(raw) {
  const source = raw && typeof raw === 'object' ? raw : {}
  return {
    id: source.id ?? source.transaction_id ?? source.payout_id ?? null,
    status: source.status ?? null,
    description: source.description ?? source.memo ?? source.note ?? null,
    amount: source.amount ?? source.gross_amount ?? source.sumup_gross_amount ?? source.total ?? null,
    fee: source.fee ?? source.fee_amount ?? source.sumup_fee_amount ?? null,
    net: source.net ?? source.net_amount ?? source.sumup_net_amount ?? null,
    created_at: source.created_at ?? source.booked_at ?? source.date ?? null,
  }
}

function inferDirection(raw, grossMinor, netMinor) {
  const explicit = asString(raw.direction, '').toLowerCase()
  if (explicit === 'outflow' || explicit === 'debit') return 'outflow'
  if (explicit === 'inflow' || explicit === 'credit') return 'inflow'
  if (grossMinor < 0 || netMinor < 0) return 'outflow'
  return 'inflow'
}

function normalizeMagnitude(value) {
  return Math.abs(value ?? 0)
}

function makeId(prefix, providerRef, occurredAt) {
  const safeRef = (providerRef ?? occurredAt).replace(/[^a-zA-Z0-9:_-]+/g, '-')
  return `${prefix}:${safeRef}`
}

/**
 * Normalize a raw SumUp-like payload into a provider-agnostic import record.
 */
export function normalizeSumUpFlow(raw, options = {}) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const importedAt = nowIso(options.now)
  const provider = asString(options.provider, 'sumup')

  const grossInput = source.gross_amount ?? source.amount ?? source.sumup_gross_amount ?? source.total ?? source.net_amount ?? source.sumup_net_amount ?? 0
  const feeInput = source.fee_amount ?? source.fee ?? source.sumup_fee_amount ?? 0
  const netInput = source.net_amount ?? source.net ?? source.sumup_net_amount

  const signedGrossMinor = decimalToMinorUnits(grossInput)
  const signedFeeMinor = decimalToMinorUnits(feeInput)
  const signedNetMinor = netInput == null ? signedGrossMinor - signedFeeMinor : decimalToMinorUnits(netInput)
  const direction = inferDirection(source, signedGrossMinor, signedNetMinor)

  return {
    provider,
    provider_ref: inferProviderRef(source, provider),
    occurred_at: inferOccurredAt(source, importedAt),
    direction,
    gross_minor: normalizeMagnitude(signedGrossMinor || signedNetMinor),
    fee_minor: normalizeMagnitude(signedFeeMinor),
    net_minor: normalizeMagnitude(signedNetMinor),
    currency: asString(source.currency, DEFAULT_CURRENCY),
    currency_scale: DEFAULT_CURRENCY_SCALE,
    memo: asNullableString(source.memo ?? source.description ?? source.note),
    occurrence_id_hint: asNullableString(source.occurrence_id ?? source.occurrence_key),
    raw_excerpt: sanitizeRawExcerpt(source),
    raw: source,
  }
}

function buildRevenueLines(flow, resolution, accounts) {
  const assetAccount = resolution.asset_account_code ?? accounts.settlement
  const feeAccount = resolution.fee_account_code ?? accounts.processorFees
  const revenueAccount = resolution.revenue_account_code ?? accounts.revenue
  const occurrenceId = resolution.occurrence_id ?? flow.occurrence_id_hint ?? null
  const grossMinor = flow.gross_minor || flow.net_minor + flow.fee_minor

  const lines = [
    {
      account_code: assetAccount,
      account_type: 'asset',
      amount_minor: flow.net_minor,
      currency: flow.currency,
      currency_scale: flow.currency_scale,
      occurrence_id: occurrenceId,
      description: resolution.description ?? 'Provider net settlement',
    },
    {
      account_code: revenueAccount,
      account_type: 'revenue',
      amount_minor: -grossMinor,
      currency: flow.currency,
      currency_scale: flow.currency_scale,
      occurrence_id: occurrenceId,
      description: resolution.description ?? 'Show revenue',
    },
  ]

  if (flow.fee_minor > 0) {
    lines.splice(1, 0, {
      account_code: feeAccount,
      account_type: 'expense',
      amount_minor: flow.fee_minor,
      currency: flow.currency,
      currency_scale: flow.currency_scale,
      occurrence_id: occurrenceId,
      description: 'Payment processor fee',
    })
  }

  return lines
}

function buildCostLines(flow, resolution, accounts) {
  const assetAccount = resolution.asset_account_code ?? accounts.settlement
  const expenseAccount = resolution.expense_account_code ?? accounts.cost
  const occurrenceId = resolution.occurrence_id ?? flow.occurrence_id_hint ?? null
  const grossMinor = flow.gross_minor || flow.net_minor

  return [
    {
      account_code: expenseAccount,
      account_type: 'expense',
      amount_minor: grossMinor,
      currency: flow.currency,
      currency_scale: flow.currency_scale,
      occurrence_id: occurrenceId,
      description: resolution.description ?? 'Booked cost',
    },
    {
      account_code: assetAccount,
      account_type: 'asset',
      amount_minor: -grossMinor,
      currency: flow.currency,
      currency_scale: flow.currency_scale,
      occurrence_id: occurrenceId,
      description: resolution.description ?? 'Provider outflow',
    },
  ]
}

function buildTransferLines(flow, resolution, accounts) {
  const sourceAccount = resolution.source_account_code ?? accounts.transferSource
  const targetAccount = resolution.target_account_code ?? accounts.transferTarget
  const transferMinor = flow.net_minor || flow.gross_minor

  return [
    {
      account_code: targetAccount,
      account_type: 'asset',
      amount_minor: transferMinor,
      currency: flow.currency,
      currency_scale: flow.currency_scale,
      occurrence_id: null,
      description: resolution.description ?? 'Internal transfer in',
    },
    {
      account_code: sourceAccount,
      account_type: 'asset',
      amount_minor: -transferMinor,
      currency: flow.currency,
      currency_scale: flow.currency_scale,
      occurrence_id: null,
      description: resolution.description ?? 'Internal transfer out',
    },
  ]
}

export function createLedgerTransactionFromFlow(flow, resolution, options = {}) {
  const accounts = { ...DEFAULT_LEDGER_ACCOUNTS, ...(options.accounts ?? {}) }
  const kind = resolution.kind
  const occurrenceId = resolution.occurrence_id ?? flow.occurrence_id_hint ?? null

  let lines
  if (kind === 'revenue') {
    lines = buildRevenueLines(flow, resolution, accounts)
  } else if (kind === 'cost') {
    lines = buildCostLines(flow, resolution, accounts)
  } else if (kind === 'internal_transfer') {
    lines = buildTransferLines(flow, resolution, accounts)
  } else {
    throw new Error(`Unsupported ledger classification: ${kind}`)
  }

  return {
    transaction_id: makeId(`ledger:${kind}`, flow.provider_ref ?? flow.provider, flow.occurred_at),
    kind,
    occurred_at: flow.occurred_at,
    provider: flow.provider,
    provider_ref: flow.provider_ref,
    occurrence_id: occurrenceId,
    memo: resolution.memo ?? flow.memo ?? null,
    lines,
    metadata: {
      source_direction: flow.direction,
      raw_excerpt: flow.raw_excerpt,
      classification_reason: resolution.reason ?? null,
    },
  }
}

export function createUnmarkedQueueItem(flow, resolution = {}) {
  return {
    queue_id: makeId('queue', flow.provider_ref ?? flow.provider, flow.occurred_at),
    provider: flow.provider,
    provider_ref: flow.provider_ref,
    occurred_at: flow.occurred_at,
    direction: flow.direction,
    gross_minor: flow.gross_minor,
    fee_minor: flow.fee_minor,
    net_minor: flow.net_minor,
    currency: flow.currency,
    currency_scale: flow.currency_scale,
    suggested_classification: resolution.suggested_classification ?? 'unknown',
    suggested_occurrence_id: resolution.occurrence_id ?? flow.occurrence_id_hint ?? null,
    memo: resolution.memo ?? flow.memo ?? null,
    reason: resolution.reason ?? 'No classification rule matched the imported provider flow',
    raw_excerpt: flow.raw_excerpt,
  }
}

export function unmarkedQueueItemToFlow(item) {
  return {
    provider: item.provider,
    provider_ref: item.provider_ref,
    occurred_at: item.occurred_at,
    direction: item.direction,
    gross_minor: item.gross_minor,
    fee_minor: item.fee_minor,
    net_minor: item.net_minor,
    currency: item.currency,
    currency_scale: item.currency_scale,
    memo: item.memo,
    occurrence_id_hint: item.suggested_occurrence_id,
    raw_excerpt: item.raw_excerpt,
  }
}

export function resolveUnmarkedTransaction(item, resolution, options = {}) {
  return createLedgerTransactionFromFlow(unmarkedQueueItemToFlow(item), resolution, options)
}

/**
 * Build a batch of ledger transactions plus an unmarked queue from raw provider rows.
 *
 * `classify(flow)` is the integration hook: return one of
 *   { kind: 'revenue' | 'cost' | 'internal_transfer', ... }
 * or return null / { kind: 'unmarked', ... } to leave the row queued for later.
 */
export function buildLedgerImportBatch(rawRows, options = {}) {
  const normalize = options.adapter ?? normalizeSumUpFlow
  const classify = options.classify ?? (() => null)
  const importedAt = nowIso(options.now)
  const provider = asString(options.provider, 'sumup')
  const transactions = []
  const queueItems = []

  for (const raw of rawRows ?? []) {
    const flow = normalize(raw, { ...options, provider, now: importedAt })
    const resolution = classify(flow) ?? null

    if (!resolution || resolution.kind === 'unmarked') {
      queueItems.push(createUnmarkedQueueItem(flow, resolution ?? {}))
      continue
    }

    transactions.push(createLedgerTransactionFromFlow(flow, resolution, options))
  }

  const importRun = {
    import_run_id: makeId(`import:${provider}`, provider, importedAt),
    provider,
    imported_at: importedAt,
    imported_count: rawRows?.length ?? 0,
    transaction_count: transactions.length,
    queued_count: queueItems.length,
    metadata: {
      adapter: normalize.name || 'anonymous-adapter',
    },
  }

  return {
    import_run: importRun,
    transactions,
    unmarked_queue: {
      schema_version: 1,
      generated_at: importedAt,
      items: queueItems,
    },
  }
}

export function applyImportBatch(snapshotInput, queueInput, batch) {
  const snapshot = hydrateLedgerSnapshot(snapshotInput ?? createEmptyLedgerSnapshot())
  const queue = hydrateUnmarkedTransactionQueue(queueInput ?? createEmptyUnmarkedTransactionQueue())

  return {
    ledger_snapshot: hydrateLedgerSnapshot({
      ...snapshot,
      generated_at: batch.import_run.imported_at,
      transactions: [...snapshot.transactions, ...batch.transactions],
      import_runs: [...snapshot.import_runs, batch.import_run],
    }),
    unmarked_transactions_queue: hydrateUnmarkedTransactionQueue({
      ...queue,
      generated_at: batch.import_run.imported_at,
      items: [...queue.items, ...(batch.unmarked_queue?.items ?? [])],
    }),
  }
}
