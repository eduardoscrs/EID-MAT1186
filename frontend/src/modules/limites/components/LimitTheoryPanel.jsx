import { MathText } from "../../../components/MathText";

function badgeClass(kind) {
  if (kind === "removible") return "bg-emerald-600";
  if (kind === "salto") return "bg-amber-600";
  if (kind === "infinita") return "bg-rose-600";
  if (kind === "continua") return "bg-blue-700";
  return "bg-slate-600";
}

function classificationText(kind) {
  if (kind === "continua") return "Continua";
  return `Discontinuidad ${kind || "--"}`;
}

export function LimitTheoryPanel({ result }) {
  const tramos = result?.tramos || [];
  const classification = result?.continuidad?.clasificacion;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Regla</p>
          <h2 className="mt-1 text-xl font-black text-blue-950">Construccion de la funcion por tramos</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide text-white ${badgeClass(classification || result?.caso)}`}>
          {classification || result?.caso || "Sin resultado"}
        </span>
      </div>

      {result ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-600">Regla de seleccion</p>
            <p className="mt-2 text-sm text-slate-700">
              <MathText value={result.regla_seleccion} />
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Punto de analisis: <span className="font-bold text-blue-950">a = {result.a}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-blue-950 p-4 text-white">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-200">Funcion generada</p>
            <pre className="mt-3 overflow-x-auto text-sm leading-6 text-blue-50">{result.funcion_por_tramos}</pre>
            {result.extension_sugerida ? (
              <p className="mt-3 text-sm text-blue-100">
                Extension sugerida: <span className="font-bold text-white">{result.extension_sugerida}</span>
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Limite izquierdo</p>
              <p className="mt-2 text-2xl font-black text-blue-950">{result.limites?.izquierdo || "--"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Limite derecho</p>
              <p className="mt-2 text-2xl font-black text-blue-950">{result.limites?.derecho || "--"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Existe el limite?</p>
              <p className="mt-2 text-2xl font-black text-blue-950">{result.limites?.existe ? "Si" : "No"}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-600">Clasificacion</p>
            <p className="mt-2 text-lg font-black text-blue-950">{classificationText(classification)}</p>
            <p className="mt-1 text-sm text-slate-600">
              Definida en a: <span className="font-bold text-slate-900">{result.continuidad?.definida_en_a ? "Si" : "No"}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Continua en a?: <span className="font-bold text-slate-900">{result.continuidad?.continua_en_a ? "Si" : "No"}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-600">Justificacion matematica</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              <MathText value={result.justificacion} />
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-600">Evidencia numerica</p>
            <p className="mt-2 text-sm text-slate-600">Tabla de valores alrededor de a, de izquierda a derecha</p>
            <div className="mt-3 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500">
                    <th className="pb-2">x</th>
                    <th className="pb-2">f(x)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.evidence?.map((row, i) => (
                    <tr key={i} className="odd:bg-white even:bg-slate-50">
                      <td className="py-1 font-mono">{row.x}</td>
                      <td className="py-1 font-mono">{row.y === null ? "--" : row.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Aproximaciones numericas: <span className="font-bold">izq = {result.numeric_limits?.izq ?? "--"}</span>,{" "}
              <span className="font-bold">der = {result.numeric_limits?.der ?? "--"}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-600">Puntos criticos</p>
            {tramos.length ? (
              <div className="mt-3 space-y-3">
                {tramos.map((tramo, index) => (
                  <div key={`${tramo.condicion}-${index}`} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">{tramo.condicion}</p>
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
                  <li key={`${punto.x}-${index}`} className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                    x = <span className="font-bold text-blue-950">{punto.x}</span> - {punto.motivo}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-bold">Paso a paso</p>
            <ol className="mt-3 space-y-2">
              {result.pasos?.map((paso, index) => (
                <li key={`${index}-${paso}`} className="rounded-lg bg-white px-3 py-2 ring-1 ring-blue-100">
                  <span className="mr-2 font-black text-blue-800">{index + 1}.</span>
                  <MathText value={paso} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">Ingresa un RUT para construir la funcion por tramos y analizar el limite.</p>
      )}
    </section>
  );
}
