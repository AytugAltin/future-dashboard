function average(values) {
  if (!values.length) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function venueClassLabel(event) {
  const capacity = Number(event?.event_capacity ?? 0)
  if (!Number.isFinite(capacity) || capacity <= 0) return 'unknown'
  if (capacity < 100) return 'small'
  if (capacity < 180) return 'medium'
  return 'large'
}

function comparableFamily(event, seriesTracked) {
  const eventName = normalizeText(event?.event_name)

  for (const series of seriesTracked?.series ?? []) {
    const needles = [series?.name, ...(series?.match ?? [])]
      .filter(Boolean)
      .map((value) => normalizeText(value))
      .filter((value) => value.length >= 5)

    if (needles.some((needle) => eventName.includes(needle))) {
      return { key: `series:${series.series_id}`, label: 'same series', kind: 'series' }
    }
  }

  return {
    key: `title:${eventName}`,
    label: 'same title family',
    kind: 'title',
  }
}

function axisConfig(axisMode) {
  return axisMode === 'weeks'
    ? { axisLabel: 'Weeks until show', unit: 'week' }
    : { axisLabel: 'Days until show', unit: 'day' }
}

function buildOccurrenceHistoryIndex(data) {
  const histories = data?.occurrenceReservationHistory?.occurrences ?? []
  const byOccurrenceId = new Map()
  const byEventId = new Map()

  for (const history of histories) {
    const occurrenceId = String(history?.occurrence_id || history?.occurrence_key || '')
    if (occurrenceId) byOccurrenceId.set(occurrenceId, history)

    for (const sourceEventId of history?.source_event_ids ?? []) {
      const key = String(sourceEventId || '')
      if (key) byEventId.set(key, history)
    }
  }

  return { byOccurrenceId, byEventId }
}

function getSalesLeadCurves(data) {
  if (Array.isArray(data?.salesLeadCurves)) return data.salesLeadCurves
  if (Array.isArray(data?.salesLeadCurves?.curves)) return data.salesLeadCurves.curves
  if (Array.isArray(data?.salesLeadCurves?.occurrences)) return data.salesLeadCurves.occurrences
  return []
}

function buildCurveIndex(data) {
  const curves = getSalesLeadCurves(data)
  const byOccurrenceId = new Map()
  const byEventId = new Map()

  for (const curve of curves) {
    const occurrenceId = String(curve?.occurrence_id || '')
    if (occurrenceId) byOccurrenceId.set(occurrenceId, curve)

    const candidateEventIds = [
      curve?.event_id,
      curve?.primary_eventbrite_event_id,
      ...(curve?.source_event_ids ?? []),
      ...(curve?.eventbrite_event_ids ?? []),
    ]
      .filter(Boolean)
      .map((value) => String(value))

    for (const eventId of candidateEventIds) {
      byEventId.set(eventId, curve)
    }
  }

  return { byOccurrenceId, byEventId }
}

function findSourceForEvent(event, data) {
  const occurrenceId = String(event?.occurrence_id || '')
  const candidateEventIds = [
    event?.event_id,
    event?.primary_eventbrite_event_id,
    ...(event?.eventbrite_event_ids ?? []),
    ...(event?.source_event_ids ?? []),
  ]
    .filter(Boolean)
    .map((value) => String(value))

  const historyIndex = buildOccurrenceHistoryIndex(data)
  if (occurrenceId && historyIndex.byOccurrenceId.has(occurrenceId)) {
    return { kind: 'history', value: historyIndex.byOccurrenceId.get(occurrenceId) }
  }
  const historyMatch = candidateEventIds.find((eventId) => historyIndex.byEventId.has(eventId))
  if (historyMatch) {
    return { kind: 'history', value: historyIndex.byEventId.get(historyMatch) }
  }

  const curveIndex = buildCurveIndex(data)
  if (occurrenceId && curveIndex.byOccurrenceId.has(occurrenceId)) {
    return { kind: 'curve', value: curveIndex.byOccurrenceId.get(occurrenceId) }
  }
  const curveMatch = candidateEventIds.find((eventId) => curveIndex.byEventId.has(eventId))
  if (curveMatch) {
    return { kind: 'curve', value: curveIndex.byEventId.get(curveMatch) }
  }

  return null
}

function getFallbackTotals(source) {
  if (!source) return { reservations: 0, orders: 0 }
  if (source.kind === 'history') {
    return {
      reservations: Number(source.value?.final_reservations ?? 0),
      orders: Number(source.value?.final_eventbrite_orders ?? 0),
    }
  }
  return {
    reservations: Number(source.value?.reservation_count ?? 0),
    orders: Number(source.value?.eventbrite_order_count ?? 0),
  }
}

function extractAddedByBucket(source, axisMode) {
  const buckets = new Map()

  if (!source) return buckets

  if (source.kind === 'history') {
    for (const point of source.value?.points ?? []) {
      const dayBucket = Number(point?.days_until_show)
      if (!Number.isFinite(dayBucket) || dayBucket < 0) continue
      const bucket = axisMode === 'weeks' ? Math.floor(dayBucket / 7) : dayBucket
      const stats = buckets.get(bucket) ?? { added: 0, ordersAdded: 0 }
      stats.added += Number(point?.reservations_added ?? 0)
      stats.ordersAdded += Number(point?.eventbrite_orders_added ?? 0)
      buckets.set(bucket, stats)
    }
  } else {
    const rows = axisMode === 'weeks' ? source.value?.weekly_buckets : source.value?.daily_buckets
    const bucketKey = axisMode === 'weeks' ? 'weeks_until_show' : 'days_until_show'
    for (const row of rows ?? []) {
      const bucket = Number(row?.[bucketKey])
      if (!Number.isFinite(bucket) || bucket < 0) continue
      buckets.set(bucket, {
        added: Number(row?.reservations_added ?? 0),
        ordersAdded: Number(row?.eventbrite_orders_added ?? 0),
      })
    }
  }

  if (!buckets.size) {
    const fallbackTotals = getFallbackTotals(source)
    if (fallbackTotals.reservations || fallbackTotals.orders) {
      buckets.set(0, {
        added: fallbackTotals.reservations,
        ordersAdded: fallbackTotals.orders,
      })
    }
  }

  return buckets
}

function buildDenseSeriesForSource(source, axisMode, maxBucket) {
  const addedByBucket = extractAddedByBucket(source, axisMode)
  let runningReservations = 0
  let runningOrders = 0
  const rows = []

  for (let bucket = maxBucket; bucket >= 0; bucket -= 1) {
    const stats = addedByBucket.get(bucket) ?? { added: 0, ordersAdded: 0 }
    runningReservations += stats.added
    runningOrders += stats.ordersAdded
    rows.push({
      bucket,
      added: stats.added,
      accumulated: runningReservations,
      ordersAdded: stats.ordersAdded,
      ordersAccumulated: runningOrders,
    })
  }

  rows.reverse()
  return rows
}

function maxBucketForSource(source, axisMode) {
  const addedByBucket = extractAddedByBucket(source, axisMode)
  return addedByBucket.size ? Math.max(...addedByBucket.keys()) : 0
}

function averageSeries(seriesCollection, maxBucket) {
  if (!seriesCollection.length) {
    return Array.from({ length: maxBucket + 1 }, (_, bucket) => ({
      bucket,
      added: null,
      accumulated: null,
      ordersAdded: null,
      ordersAccumulated: null,
    }))
  }

  return Array.from({ length: maxBucket + 1 }, (_, bucket) => {
    const rows = seriesCollection.map((series) => series[bucket])
    return {
      bucket,
      added: average(rows.map((row) => row?.added ?? 0)),
      accumulated: average(rows.map((row) => row?.accumulated ?? 0)),
      ordersAdded: average(rows.map((row) => row?.ordersAdded ?? 0)),
      ordersAccumulated: average(rows.map((row) => row?.ordersAccumulated ?? 0)),
    }
  })
}

export function buildSalesLeadCurveContext({ event, data, axisMode = 'days' }) {
  const selectedSource = findSourceForEvent(event, data)
  if (!selectedSource) return null

  const family = comparableFamily(event, data?.seriesTracked)
  const venueClass = venueClassLabel(event)

  const completedPool = (data?.eventsOverview ?? [])
    .filter((candidate) => candidate.event_status === 'completed')
    .filter((candidate) => String(candidate?.occurrence_id || candidate?.event_id || '') !== String(event?.occurrence_id || event?.event_id || ''))
    .map((candidate) => ({
      event: candidate,
      source: findSourceForEvent(candidate, data),
      family: comparableFamily(candidate, data?.seriesTracked),
      venueClass: venueClassLabel(candidate),
    }))
    .filter((candidate) => candidate.source)

  const benchmarkSteps = [
    {
      label: `${family.label} + ${venueClass} venue class`,
      min: 3,
      matches: (candidate) => candidate.family.key === family.key && candidate.venueClass === venueClass,
    },
    {
      label: family.label,
      min: 3,
      matches: (candidate) => candidate.family.key === family.key,
    },
    {
      label: `${venueClass} venue class`,
      min: 5,
      matches: (candidate) => candidate.venueClass === venueClass,
    },
    {
      label: 'global average',
      min: 1,
      matches: () => true,
    },
  ]

  let benchmarkLabel = 'global average'
  let comparableCandidates = []

  for (const step of benchmarkSteps) {
    const matches = completedPool.filter(step.matches)
    if (matches.length >= step.min || step.label === 'global average') {
      benchmarkLabel = step.label
      comparableCandidates = matches
      break
    }
  }

  const actualMaxBucket = maxBucketForSource(selectedSource, axisMode)
  const benchmarkMaxBucket = comparableCandidates.length
    ? Math.max(...comparableCandidates.map((candidate) => maxBucketForSource(candidate.source, axisMode)))
    : 0
  const maxBucket = Math.max(actualMaxBucket, benchmarkMaxBucket)

  const actualSeries = buildDenseSeriesForSource(selectedSource, axisMode, maxBucket)
  const benchmarkSeries = averageSeries(
    comparableCandidates.map((candidate) => buildDenseSeriesForSource(candidate.source, axisMode, maxBucket)),
    maxBucket
  )

  const { axisLabel, unit } = axisConfig(axisMode)
  const points = actualSeries.map((actualPoint, index) => {
    const benchmarkPoint = benchmarkSeries[index] ?? null
    return {
      bucket: actualPoint.bucket,
      bucketLabel: `${actualPoint.bucket} ${actualPoint.bucket === 1 ? unit : `${unit}s`}`,
      actualAccumulated: actualPoint.accumulated,
      actualAdded: actualPoint.added,
      actualOrdersAccumulated: actualPoint.ordersAccumulated,
      actualOrdersAdded: actualPoint.ordersAdded,
      benchmarkAccumulated: benchmarkPoint?.accumulated ?? null,
      benchmarkAdded: benchmarkPoint?.added ?? null,
      benchmarkOrdersAccumulated: benchmarkPoint?.ordersAccumulated ?? null,
      benchmarkOrdersAdded: benchmarkPoint?.ordersAdded ?? null,
    }
  })

  return {
    axisLabel,
    points,
    comparableCount: comparableCandidates.length,
    benchmarkLabel,
    venueClass,
    familyKind: family.kind,
    metricLabel: 'Cumulative reservations',
    sourceLabel: 'Reservations from Eventbrite order tickets_per_order grouped by order date and collapsed to occurrence_id when available',
  }
}
