import { MathText } from "../../../components/MathText";

function badgeClass(kind) {
  if (kind === "removible") return "bg-emerald-600 text-white";
  if (kind === "salto") return "bg-amber-600 text-white";
  if (kind === "infinita") return "bg-rose-600 text-white";
  if (kind === "continua") return "bg-teal-700 text-white";
  return "bg-slate-700 text-white";
}

function classificationText(kind) {
  if (kind === "continua") return "Continua";
  return `Discontinuidad ${kind || "--"}`;
}

function MetricCell({ label, value }) {
  return (
    <div className="border-b border-slate-200 px-4 py-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

export function LimitTheoryPanel({ result }) {
  const tramos = result?.tramos || [];
  const classification = result?.continuidad?.clasificacion;

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-kicker text-amber-700">Regla</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Construcción de la función por tramos</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${badgeClass(classification || result?.caso)}`}>
          {classification || result?.caso || "Sin resultado"}
        </span>
      </div>

      {result ? (
        <div className="mt-5 space-y-5">
          <div className="grid overflow-hidden rounded-lg border border-slate-200 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
            <div className="bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">Regla de selección</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                <MathText value={result.regla_seleccion} />
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Punto de análisis: <span className="font-black text-slate-950">a = {result.a}</span>
              </p>
            </div>

            <div className="border-t border-slate-200 bg-slate-950 p-4 text-white lg:border-l lg:border-t-0">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">Función generada</p>
              <pre className="mt-3 overflow-x-auto text-sm leading-6 text-slate-100">{result.funcion_por_tramos}</pre>
              {result.extension_sugerida ? (
                <p className="mt-3 text-sm text-slate-200">
                  Extensión sugerida: <span className="font-black text-white">{result.extension_sugerida}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white md:grid-cols-3">
            <MetricCell label="Límite izquierdo" value={result.limites?.izquierdo || "--"} />
            <MetricCell label="Límite derecho" value={result.limites?.derecho || "--"} />
            <MetricCell label="Existe el límite?" value={result.limites?.existe ? "Sí" : "No"} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">Clasificación</p>
              <p className="mt-2 text-lg font-black text-slate-950">{classificationText(classification)}</p>
              <p className="mt-2 text-sm text-slate-600">
                Definida en a: <span className="font-black text-slate-900">{result.continuidad?.definida_en_a ? "Sí" : "No"}</span>
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Continua en a: <span className="font-black text-slate-900">{result.continuidad?.continua_en_a ? "Sí" : "No"}</span>
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-black text-slate-700">Justificación matemática</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                <MathText value={result.justificacion} />
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">Evidencia numérica</p>
              <p className="mt-1 text-sm text-slate-600">Tabla de valores alrededor de a, de izquierda a derecha.</p>
              <div className="mt-3 overflow-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr className="text-left text-xs uppercase tracking-[0.12em] text-slate-500">
                      <th className="px-3 py-2">x</th>
                      <th className="px-3 py-2">f(x)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.evidence?.map((row, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-mono">{row.x}</td>
                        <td className="px-3 py-2 font-mono">{row.y === null ? "--" : row.y}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Aproximaciones numéricas: <span className="font-black">izq = {result.numeric_limits?.izq ?? "--"}</span>,{" "}
                <span className="font-black">der = {result.numeric_limits?.der ?? "--"}</span>
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">Puntos críticos</p>
              {tramos.length ? (
                <div className="mt-3 space-y-3">
                  {tramos.map((tramo, index) => (
                    <div key={`${tramo.condicion}-${index}`} className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{tramo.condicion}</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        <MathText value={tramo.expresion} />
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {result.puntos_criticos?.length ? (
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {result.puntos_criticos.map((punto, index) => (
                    <li key={`${punto.x}-${index}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      x = <span className="font-black text-slate-950">{punto.x}</span> - {punto.motivo}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          Ingresa un RUT para construir la función por tramos y analizar el límite.
        </div>
      )}
    </section>
  );
}

export function LimitStepsPanel({ pasos }) {
  if (!pasos?.length) return null;

  return (
    <section className="panel p-5 text-sm text-slate-700">
      <p className="section-kicker text-amber-700">Paso a paso</p>
      <ol className="mt-4 space-y-2">
        {pasos.map((paso, index) => (
          <li key={`${index}-${paso}`} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
            <span className="mr-2 font-black text-amber-700">{index + 1}.</span>
            <MathText value={paso} />
          </li>
        ))}
      </ol>
    </section>
  );
}
