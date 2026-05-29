import { ExampleRutStrip } from "../../../components/ExampleRutStrip";

function validationCopy(validation) {
  if (!validation) return { label: "Sin validar", className: "text-slate-600", badge: "--" };
  if (validation.valido) return { label: "RUT válido", className: "text-emerald-700", badge: "OK" };
  return { label: "RUT inválido", className: "text-rose-700", badge: "Revisar" };
}

export function RutFormPanel({ rut, loading, validation, extractedDigits, examples = [], onRutChange, onSubmit }) {
  const state = validationCopy(validation);
  const digits = extractedDigits.length ? extractedDigits : ["_", "_", "_", "_", "_", "_", "_", "_", "_"];

  return (
    <section className="panel overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="p-5 md:p-6">
          <p className="section-kicker">Entrada</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Validación RUT</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Ingresa el RUT para generar la cónica, ordenar sus elementos y activar la gráfica.
          </p>

          <form className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="rut" className="text-sm font-extrabold text-slate-700">
                RUT
              </label>
              <input
                id="rut"
                value={rut}
                onChange={(event) => onRutChange(event.target.value)}
                placeholder="12345678-5"
                className="field-control text-base font-semibold text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <button type="submit" disabled={loading || !rut.trim()} className="primary-action self-end px-5 py-3">
              {loading ? "Calculando..." : "Calcular cónica"}
            </button>
          </form>

          {examples.length ? <ExampleRutStrip examples={examples} onSelect={onRutChange} /> : null}
        </div>

        <aside className="border-t border-slate-200 bg-slate-50/80 p-5 lg:border-l lg:border-t-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Resultado</p>
              <p className={`mt-1 text-lg font-black ${state.className}`}>{state.label}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide text-white ${
                validation?.valido ? "bg-emerald-600" : validation ? "bg-rose-600" : "bg-slate-500"
              }`}
            >
              {state.badge}
            </span>
          </div>

          <div className="mt-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Dígitos extraídos</p>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-4">
              {digits.map((digit, index) => (
                <span
                  key={`${digit}-${index}`}
                  className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-white font-mono text-lg font-black text-slate-800 shadow-sm"
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
