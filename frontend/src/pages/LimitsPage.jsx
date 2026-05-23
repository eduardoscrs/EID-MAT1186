
import { LimitTheoryPanel } from "../components/LimitTheoryPanel";

export function LimitsPage({ loading, result, rut, status, validation, onRutChange, onSubmit }) {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Sección de límites</p>
            <h2 className="mt-1 text-3xl font-black text-blue-950">Construcción automática desde el RUT</h2>
            <p className="mt-2 max-w-3xl text-slate-600">
              El sistema calcula el punto de análisis a = d3, selecciona el caso según d8 % 3 y muestra los límites laterales,
              la continuidad y la discontinuidad correspondiente.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            <p className="font-bold text-slate-900">Estado</p>
            <p className="mt-1">{status}</p>
          </div>
        </div>

        <form className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label htmlFor="rut-limites" className="text-sm font-bold text-slate-600">
              RUT
            </label>
            <input
              id="rut-limites"
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
            {loading ? "Analizando..." : "Construir función"}
          </button>
        </form>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className={`rounded-2xl border p-4 ${validation?.valido ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Validación</div>
            <div className="mt-1 font-bold text-blue-950">{validation ? (validation.valido ? "RUT válido" : "RUT inválido") : "Sin validar"}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Caso</div>
            <div className="mt-1 font-bold text-blue-950">{result?.caso || "--"}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Regla</div>
            <div className="mt-1 font-bold text-blue-950">d8 % 3 = {result?.residuo ?? "--"}</div>
          </div>
        </div>
      </section>

      <LimitTheoryPanel result={result} />
    </main>
  );
}
