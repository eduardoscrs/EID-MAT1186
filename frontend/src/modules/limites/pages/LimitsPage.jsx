import { DefenseFieldsPanel } from "../../../components/DefenseFieldsPanel";
import { limitDefenseFields } from "../../../constants/ui";
import { LimitGraphPanel } from "../components/LimitGraphPanel";
import { LimitStepsPanel, LimitTheoryPanel } from "../components/LimitTheoryPanel";

function validationLabel(validation) {
  if (!validation) return "Sin validar";
  return validation.valido ? "RUT válido" : "RUT inválido";
}

export function LimitsPage({ loading, result, rut, status, validation, onRutChange, onSubmit }) {
  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-7">
      <section className="panel overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="p-5 md:p-6">
            <p className="section-kicker text-amber-700">Sección de límites</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
              Construcción automática desde el RUT
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Se calcula el punto de análisis, se selecciona el caso según d8 % 3 y se muestran los límites laterales,
              continuidad y discontinuidad.
            </p>

            <form className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label htmlFor="rut-limites" className="text-sm font-extrabold text-slate-700">
                  RUT
                </label>
                <input
                  id="rut-limites"
                  value={rut}
                  onChange={(event) => onRutChange(event.target.value)}
                  placeholder="12345678-5"
                  className="field-control text-base font-semibold text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !rut.trim()}
                className="self-end rounded-lg bg-amber-600 px-5 py-3 font-black text-white shadow-lg shadow-amber-600/20 transition hover:-translate-y-0.5 hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none disabled:hover:translate-y-0"
              >
                {loading ? "Analizando..." : "Construir función"}
              </button>
            </form>
          </div>

          <aside className="border-t border-slate-200 bg-slate-50/80 p-5 lg:border-l lg:border-t-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Estado</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{status}</p>

            <div className="mt-5 grid gap-3">
              <div className={`rounded-lg border p-4 ${validation?.valido ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Validación</div>
                <div className="mt-1 font-black text-slate-950">{validationLabel(validation)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Caso</div>
                  <div className="mt-1 font-black text-slate-950">{result?.caso || "--"}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Regla</div>
                  <div className="mt-1 font-black text-slate-950">d8 % 3 = {result?.residuo ?? "--"}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <LimitTheoryPanel result={result} />
      <LimitGraphPanel
        samples={result?.samples}
        funcionPorTramos={result?.funcion_por_tramos}
        caso={result?.continuidad?.clasificacion || result?.caso}
        limites={result?.limites}
      />
      <LimitStepsPanel pasos={result?.pasos} />
      <DefenseFieldsPanel title="Campos de límites" fields={limitDefenseFields} />
    </main>
  );
}
