export function ExampleRutStrip({ examples, onSelect, tone = "teal" }) {
  const toneClass =
    tone === "amber"
      ? "hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 focus-visible:ring-amber-200"
      : "hover:border-teal-400 hover:bg-teal-50 hover:text-teal-900 focus-visible:ring-teal-200";

  return (
    <div className="mt-5 border-t border-slate-200 pt-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">RUTs de ejemplo</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example.rut}
            type="button"
            onClick={() => onSelect(example.rut)}
            className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 shadow-sm outline-none transition focus-visible:ring-4 ${toneClass}`}
          >
            <span className="block font-black">{example.label}</span>
            <span className="mt-0.5 block font-mono text-xs font-bold text-slate-500">{example.rut}</span>
            <span className="mt-1 block text-xs font-semibold text-slate-400">{example.detail}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
