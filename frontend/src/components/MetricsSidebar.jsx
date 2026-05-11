import { defenseFields } from "../constants/ui";
import { formatNumber, formatPoint } from "../utils/formatters";

function getMetrics(result) {
  return [
    {
      label: result?.tipo_conica === "Parabola" ? "Vértice" : "Centro",
      value: result?.centro ? formatPoint(result.centro) : formatPoint(result?.vertice),
      accent: "bg-red-500",
    },
    { label: "Radio", value: formatNumber(result?.radio), accent: "bg-blue-500" },
    { label: "Eje a", value: formatNumber(result?.a), accent: "bg-purple-500" },
    { label: "Eje b", value: formatNumber(result?.b), accent: "bg-green-500" },
    { label: "Eje c", value: formatNumber(result?.c), accent: "bg-orange-500" },
    { label: "Excentricidad", value: formatNumber(result?.excentricidad), accent: "bg-sky-500" },
  ];
}

export function MetricsPanel({ result }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {getMetrics(result).map((metric) => (
        <section key={metric.label} className="rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-200">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
            <span className={`h-3 w-3 rounded-full ${metric.accent}`} />
            {metric.label}
          </div>
          <div className="mt-3 text-2xl font-black text-blue-950">{metric.value}</div>
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
        {result ? `Se generó una ${result.tipo_conica} a partir del RUT ingresado.` : "Aún no hay cónica calculada. Valida un RUT para activar los resultados."}
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
