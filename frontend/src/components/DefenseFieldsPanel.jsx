export function DefenseFieldsPanel({ fields, title }) {
  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Defensa oral</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{title}</h2>
        </div>
        <span className="chip text-teal-700">
          <span className="status-dot" />
          editable
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
            <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                rows={4}
                className="field-control mt-2 min-h-28 resize-y text-sm"
              />
            ) : (
              <input
                name={field.name}
                className="field-control mt-2 text-sm"
              />
            )}
          </label>
        ))}
      </div>
    </section>
  );
}
