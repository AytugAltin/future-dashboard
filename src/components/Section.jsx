export function Section({ title, children, actions }) {
  return (
    <section className="section">
      <div className="sectionHeader">
        <h2>{title}</h2>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}
