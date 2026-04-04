export function Card({ label, value, subtext, children }) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {subtext ? <div className="subtext">{subtext}</div> : null}
      {children}
    </div>
  )
}
