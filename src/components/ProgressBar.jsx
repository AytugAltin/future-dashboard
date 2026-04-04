export function ProgressBar({ percent }) {
  const safe = Math.max(0, Math.min(100, percent ?? 0))
  const cls = safe >= 60 ? 'good' : safe >= 25 ? 'warn' : 'bad'
  return (
    <div className="progressTrack">
      <div className={`progressFill ${cls}`} style={{ width: `${safe}%` }} />
    </div>
  )
}
