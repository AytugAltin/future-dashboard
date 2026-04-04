/**
 * Minimal finance ledger primitives for BCN dashboard data exports.
 *
 * §7 requires cent-accurate tracking, reconciliation hooks for SumUp-like flows,
 * and a queue for transactions that stay unmarked until a human classifies them.
 */

export const DEFAULT_CURRENCY = 'EUR'
export const DEFAULT_CURRENCY_SCALE = 2
export const LEDGER_SCHEMA_VERSION = 1

export const LEDGER_ACCOUNT_TYPES = ['asset', 'liability', 'equity', 'revenue', 'expense']
export const LEDGER_TRANSACTION_KINDS = ['revenue', 'cost', 'internal_transfer', 'adjustment']
export const UNMARKED_CLASSIFICATIONS = ['revenue', 'cost', 'internal_transfer', 'unknown']

/**
 * @typedef {'asset' | 'liability' | 'equity' | 'revenue' | 'expense'} LedgerAccountType
 * @typedef {'revenue' | 'cost' | 'internal_transfer' | 'adjustment'} LedgerTransactionKind
 * @typedef {'revenue' | 'cost' | 'internal_transfer' | 'unknown'} SuggestedClassification
 *
 * @typedef {object} LedgerLine
 * @property {string} account_code
 * @property {LedgerAccountType} account_type
 * @property {number} amount_minor
 * @property {string} currency
 * @property {number} currency_scale
 * @property {string | null} occurrence_id
 * @property {string | null} description
 *
 * @typedef {object} LedgerTransaction
 * @property {string} transaction_id
 * @property {LedgerTransactionKind} kind
 * @property {string} occurred_at
 * @property {string} provider
 * @property {string | null} provider_ref
 * @property {string | null} occurrence_id
 * @property {string | null} memo
 * @property {LedgerLine[]} lines
 * @property {Record<string, unknown>} metadata
 *
 * @typedef {object} ImportRun
 * @property {string} import_run_id
 * @property {string} provider
 * @property {string} imported_at
 * @property {number} imported_count
 * @property {number} transaction_count
 * @property {number} queued_count
 * @property {Record<string, unknown>} metadata
 *
 * @typedef {object} LedgerSnapshot
 * @property {number} schema_version
 * @property {string} generated_at
 * @property {string} base_currency
 * @property {number} currency_scale
 * @property {LedgerTransaction[]} transactions
 * @property {ImportRun[]} import_runs
 *
 * @typedef {object} UnmarkedTransaction
 * @property {string} queue_id
 * @property {string} provider
 * @property {string | null} provider_ref
 * @property {string} occurred_at
 * @property {'inflow' | 'outflow'} direction
 * @property {number} gross_minor
 * @property {number} fee_minor
 * @property {number} net_minor
 * @property {string} currency
 * @property {number} currency_scale
 * @property {SuggestedClassification} suggested_classification
 * @property {string | null} suggested_occurrence_id
 * @property {string | null} memo
 * @property {string} reason
 * @property {Record<string, unknown>} raw_excerpt
 *
 * @typedef {object} UnmarkedTransactionQueue
 * @property {number} schema_version
 * @property {string} generated_at
 * @property {UnmarkedTransaction[]} items
 */

const ISO_FALLBACK = '1970-01-01T00:00:00.000Z'

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : value == null ? fallback : String(value)
}

function asNullableString(value) {
  if (value == null || value === '') return null
  return String(value)
}

function asIsoString(value, fallback = ISO_FALLBACK) {
  const text = asString(value, '').trim()
  if (!text) return fallback
  const date = new Date(text)
  return Number.isNaN(date.valueOf()) ? fallback : date.toISOString()
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function asInteger(value, fieldName) {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error(`${fieldName} must be an integer minor-unit amount`)
  }
  return value
}

function asEnum(value, allowed, fallback, fieldName) {
  if (value == null || value === '') return fallback
  if (allowed.includes(value)) return value
  throw new Error(`${fieldName} must be one of: ${allowed.join(', ')}`)
}

function assertBalanced(lines, transactionId) {
  const total = lines.reduce((sum, line) => sum + line.amount_minor, 0)
  if (total !== 0) {
    throw new Error(`Ledger transaction ${transactionId} is not balanced (minor total ${total})`)
  }
}

/**
 * Convert a decimal amount to integer minor units.
 * Accepts strings to avoid floating-point drift and rounds numbers via toFixed.
 */
export function decimalToMinorUnits(value, scale = DEFAULT_CURRENCY_SCALE) {
  if (value == null || value === '') return 0
  const raw = typeof value === 'number' ? value.toFixed(scale) : String(value).trim()
  const match = raw.match(/^(-?)(\d+)(?:\.(\d+))?$/)
  if (!match) throw new Error(`Invalid decimal amount: ${raw}`)

  const sign = match[1] === '-' ? -1 : 1
  const whole = Number.parseInt(match[2], 10)
  const fraction = (match[3] ?? '').padEnd(scale, '0').slice(0, scale)
  const fractionValue = fraction ? Number.parseInt(fraction, 10) : 0

  return sign * (whole * (10 ** scale) + fractionValue)
}

export function minorUnitsToDecimal(amountMinor, scale = DEFAULT_CURRENCY_SCALE) {
  const sign = amountMinor < 0 ? '-' : ''
  const absolute = Math.abs(amountMinor)
  const divisor = 10 ** scale
  const whole = Math.trunc(absolute / divisor)
  const fraction = String(absolute % divisor).padStart(scale, '0')
  return `${sign}${whole}.${fraction}`
}

export function createEmptyLedgerSnapshot({ generatedAt = new Date().toISOString(), baseCurrency = DEFAULT_CURRENCY } = {}) {
  return {
    schema_version: LEDGER_SCHEMA_VERSION,
    generated_at: generatedAt,
    base_currency: baseCurrency,
    currency_scale: DEFAULT_CURRENCY_SCALE,
    transactions: [],
    import_runs: [],
  }
}

export function createEmptyUnmarkedTransactionQueue({ generatedAt = new Date().toISOString() } = {}) {
  return {
    schema_version: LEDGER_SCHEMA_VERSION,
    generated_at: generatedAt,
    items: [],
  }
}

export function normalizeLedgerLine(input, defaultCurrency = DEFAULT_CURRENCY, defaultScale = DEFAULT_CURRENCY_SCALE) {
  const source = asObject(input)
  const line = {
    account_code: asString(source.account_code),
    account_type: asEnum(source.account_type, LEDGER_ACCOUNT_TYPES, 'asset', 'account_type'),
    amount_minor: asInteger(source.amount_minor, 'amount_minor'),
    currency: asString(source.currency, defaultCurrency),
    currency_scale: asInteger(source.currency_scale ?? defaultScale, 'currency_scale'),
    occurrence_id: asNullableString(source.occurrence_id),
    description: asNullableString(source.description),
  }

  if (!line.account_code) throw new Error('Ledger line account_code is required')
  return line
}

export function normalizeLedgerTransaction(input, snapshotDefaults = {}) {
  const source = asObject(input)
  const currency = asString(source.currency, snapshotDefaults.base_currency ?? DEFAULT_CURRENCY)
  const scale = asInteger(source.currency_scale ?? snapshotDefaults.currency_scale ?? DEFAULT_CURRENCY_SCALE, 'currency_scale')

  const transaction = {
    transaction_id: asString(source.transaction_id),
    kind: asEnum(source.kind, LEDGER_TRANSACTION_KINDS, 'adjustment', 'kind'),
    occurred_at: asIsoString(source.occurred_at),
    provider: asString(source.provider),
    provider_ref: asNullableString(source.provider_ref),
    occurrence_id: asNullableString(source.occurrence_id),
    memo: asNullableString(source.memo),
    lines: asArray(source.lines).map((line) => normalizeLedgerLine(line, currency, scale)),
    metadata: asObject(source.metadata),
  }

  if (!transaction.transaction_id) throw new Error('Ledger transaction_id is required')
  if (!transaction.provider) throw new Error(`Ledger transaction ${transaction.transaction_id} requires provider`)
  if (!transaction.lines.length) throw new Error(`Ledger transaction ${transaction.transaction_id} must include at least one line`)
  assertBalanced(transaction.lines, transaction.transaction_id)

  return transaction
}

export function normalizeImportRun(input) {
  const source = asObject(input)
  return {
    import_run_id: asString(source.import_run_id),
    provider: asString(source.provider),
    imported_at: asIsoString(source.imported_at),
    imported_count: asInteger(source.imported_count ?? 0, 'imported_count'),
    transaction_count: asInteger(source.transaction_count ?? 0, 'transaction_count'),
    queued_count: asInteger(source.queued_count ?? 0, 'queued_count'),
    metadata: asObject(source.metadata),
  }
}

export function hydrateLedgerSnapshot(input) {
  const source = asObject(input)
  const snapshot = {
    schema_version: asInteger(source.schema_version ?? LEDGER_SCHEMA_VERSION, 'schema_version'),
    generated_at: asIsoString(source.generated_at),
    base_currency: asString(source.base_currency, DEFAULT_CURRENCY),
    currency_scale: asInteger(source.currency_scale ?? DEFAULT_CURRENCY_SCALE, 'currency_scale'),
    transactions: [],
    import_runs: [],
  }

  snapshot.transactions = asArray(source.transactions).map((transaction) => normalizeLedgerTransaction(transaction, snapshot))
  snapshot.import_runs = asArray(source.import_runs).map(normalizeImportRun)
  return snapshot
}

export function normalizeUnmarkedTransaction(input) {
  const source = asObject(input)
  const item = {
    queue_id: asString(source.queue_id),
    provider: asString(source.provider),
    provider_ref: asNullableString(source.provider_ref),
    occurred_at: asIsoString(source.occurred_at),
    direction: asEnum(source.direction, ['inflow', 'outflow'], 'inflow', 'direction'),
    gross_minor: asInteger(source.gross_minor ?? 0, 'gross_minor'),
    fee_minor: asInteger(source.fee_minor ?? 0, 'fee_minor'),
    net_minor: asInteger(source.net_minor ?? 0, 'net_minor'),
    currency: asString(source.currency, DEFAULT_CURRENCY),
    currency_scale: asInteger(source.currency_scale ?? DEFAULT_CURRENCY_SCALE, 'currency_scale'),
    suggested_classification: asEnum(source.suggested_classification, UNMARKED_CLASSIFICATIONS, 'unknown', 'suggested_classification'),
    suggested_occurrence_id: asNullableString(source.suggested_occurrence_id),
    memo: asNullableString(source.memo),
    reason: asString(source.reason, 'Awaiting manual classification'),
    raw_excerpt: asObject(source.raw_excerpt),
  }

  if (!item.queue_id) throw new Error('Unmarked transaction queue_id is required')
  if (!item.provider) throw new Error(`Unmarked transaction ${item.queue_id} requires provider`)
  return item
}

export function hydrateUnmarkedTransactionQueue(input) {
  const source = asObject(input)
  return {
    schema_version: asInteger(source.schema_version ?? LEDGER_SCHEMA_VERSION, 'schema_version'),
    generated_at: asIsoString(source.generated_at),
    items: asArray(source.items).map(normalizeUnmarkedTransaction),
  }
}
