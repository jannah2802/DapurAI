export default function EmptyState({ title, description, action }) {
  return (
    <section className="y2k-shell p-6 text-center">
      <h3 className="font-impact text-2xl uppercase tracking-wide text-magenta">{title}</h3>
      <p className="mx-auto mt-2 max-w-md font-ios text-sm text-black/75">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  )
}
