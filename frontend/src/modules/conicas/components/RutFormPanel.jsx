export function RutFormPanel({ rut, loading, validation, extractedDigits, onRutChange, onSubmit }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <div className="grid gap-5 lg:grid-cols-[1fr_260px_220px] lg:items-end">
        <div>
          <h2 className="text-xl font-black text-blue-950">Validación RUT</h2>
          <p className="mt-1 text-sm text-slate-500">Ingresa el RUT y la aplicación consultará el backend para generar la cónica.</p>

          <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="rut" className="text-sm font-bold text-slate-600">
                RUT
              </label>
              <input
                id="rut"
                value={rut}
                onChange={(event) => onRutChange(event.target.value)}
                placeholder="12345678-5"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-800 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !rut.trim()}
              className="self-end rounded-2xl bg-blue-900 px-5 py-3 font-black text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Calculando..." : "Validar y graficar"}
            </button>
          </form>
        </div>

        <div className={`rounded-2xl border p-4 ${validation?.valido ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Resultado</div>
          <div className="mt-1 flex items-center justify-between gap-3 font-bold text-blue-950">
            <span>{validation ? (validation.valido ? "RUT válido" : "RUT inválido") : "Sin validar"}</span>
            <span className={`rounded-full px-2.5 py-1 text-xs text-white ${validation?.valido ? "bg-emerald-600" : "bg-slate-500"}`}>
              {validation ? (validation.valido ? "OK" : "No OK") : "--"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-100 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Dígitos extraídos</div>
          <div className="mt-2 min-h-8 font-mono text-lg tracking-[0.25em] text-blue-950">
            {extractedDigits.length ? extractedDigits.join(" ") : "_ _ _ _ _ _ _ _"}
          </div>
        </div>
      </div>
    </section>
  );
}
