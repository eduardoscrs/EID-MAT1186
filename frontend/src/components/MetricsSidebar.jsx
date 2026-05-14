import { defenseFields } from "../constants/ui";
import { formatLine, formatNumber, formatPoint, formatPointList } from "../utils/formatters";

const accentByIndex = [
  "bg-rose-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-slate-500",
  "bg-teal-500",
];

function metric(label, value) {
  return { label, value };
}

function getMetrics(result) {
  if (!result) {
    return [
      metric("Centro / vértice", "--"),
      metric("Focos", "--"),
      metric("Vértices", "--"),
      metric("Ejes", "--"),
      metric("Excentricidad", "--"),
      metric("Componentes extra", "--"),
    ];
  }

  if (result.tipo_conica === "Circunferencia") {
    return [
      metric("Centro C(h,k)", formatPoint(result.centro)),
      metric("Radio r", formatNumber(result.radio)),
    ];
  }

  if (result.tipo_conica === "Parabola") {
    return [
      metric("Vértice V(h,k)", formatPoint(result.vertice)),
      metric("Foco F", formatPoint(result.foco)),
      metric("Directriz", formatLine(result.directriz_recta)),
      metric("Eje de simetría", formatLine(result.eje_simetria)),
      metric("Parámetro p", formatNumber(result.p)),
      metric("Lado recto |4p|", formatNumber(result.lado_recto)),
      metric("Extremos lado recto", formatPointList(result.extremos_lado_recto)),
    ];
  }

  if (result.tipo_conica === "Elipse") {
    return [
      metric("Centro C(h,k)", formatPoint(result.centro)),
      metric("Focos F1, F2", formatPointList(result.focos)),
      metric("Vértices", formatPointList(result.vertices)),
      metric("Co-vértices", formatPointList(result.covertices)),
      metric("Eje mayor 2a", formatNumber(result.eje_mayor)),
      metric("Eje menor 2b", formatNumber(result.eje_menor)),
      metric("Distancia focal 2c", formatNumber(result.distancia_focal)),
      metric("Excentricidad e", formatNumber(result.excentricidad)),
    ];
  }

  if (result.tipo_conica === "Hiperbola") {
    return [
      metric("Centro C(h,k)", formatPoint(result.centro)),
      metric("Focos F1, F2", formatPointList(result.focos)),
      metric("Vértices V1, V2", formatPointList(result.vertices)),
      metric("Eje transversal 2a", formatNumber(result.eje_transversal)),
      metric("Eje conjugado 2b", formatNumber(result.eje_conjugado)),
      metric("Distancia focal 2c", formatNumber(result.distancia_focal)),
      metric("Asíntota 1", result.asintotas?.[0]?.ecuacion || "--"),
      metric("Asíntota 2", result.asintotas?.[1]?.ecuacion || "--"),
      metric("Excentricidad e", formatNumber(result.excentricidad)),
    ];
  }

  return [];
}

export function MetricsPanel({ result }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {getMetrics(result).map((item, index) => (
        <section key={item.label} className="rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-200">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
            <span className={`h-3 w-3 rounded-full ${accentByIndex[index % accentByIndex.length]}`} />
            {item.label}
          </div>
          <div className="mt-3 break-words text-xl font-black text-blue-950">{item.value}</div>
        </section>
      ))}
    </div>
  );
}

export function SummaryPanel({ result }) {
  return (
    <section className="rounded-3xl bg-blue-950 p-5 text-white shadow-md">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">Resumen</p>
      <p className="mt-3 text-sm leading-6 text-blue-50">
        {result
          ? `Se generó una ${result.tipo_conica} a partir del RUT ingresado. Componentes calculados: ${getMetrics(result).length}.`
          : "Aún no hay cónica calculada. Valida un RUT para activar los resultados."}
      </p>
    </section>
  );
}

export function DefenseFieldsPanel() {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <h2 className="text-lg font-black text-blue-950">Campos para defensa</h2>
      <p className="mt-1 text-sm text-slate-500">Estos campos quedan vacíos para completarlos manualmente durante la defensa oral.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {defenseFields.map((field) => (
          <label key={field} className="block">
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">{field}</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none transition focus:border-blue-800 focus:ring-4 focus:ring-blue-100"
              placeholder="Completar en defensa"
            />
          </label>
        ))}
      </div>
    </section>
  );
}

export function MetricsSidebar({ result }) {
  return (
    <aside className="space-y-4">
      <MetricsPanel result={result} />
      <SummaryPanel result={result} />
      <DefenseFieldsPanel />
    </aside>
  );
}
