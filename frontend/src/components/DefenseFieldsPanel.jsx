export function DefenseFieldsPanel({ fields, title }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <h2 className="text-xl font-black text-blue-950">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                rows={4}
                className="mt-1 w-full resize-y rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-800 focus:ring-4 focus:ring-blue-100"
              />
            ) : (
              <input
                name={field.name}
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-800 focus:ring-4 focus:ring-blue-100"
              />
            )}
          </label>
        ))}
      </div>
    </section>
  );
}
