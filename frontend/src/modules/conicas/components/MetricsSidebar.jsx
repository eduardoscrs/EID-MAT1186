import { MathText } from "../../../components/MathText";
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
      metric("Centro / vertice", "--"),
      metric("Focos", "--"),
      metric("Vertices", "--"),
      metric("Ejes", "--"),
      metric("Excentricidad", "--"),
      metric("Componentes extra", "--"),
    ];
  }

  if (result.tipo_conica === "Circunferencia") {
    return [metric("Centro C(h,k)", formatPoint(result.centro)), metric("Radio r", formatNumber(result.radio))];
  }

  if (result.tipo_conica === "Parabola") {
    return [
      metric("Vertice V(h,k)", formatPoint(result.vertice)),
      metric("Foco F", formatPoint(result.foco)),
      metric("Directriz", formatLine(result.directriz_recta)),
      metric("Eje de simetria", formatLine(result.eje_simetria)),
      metric("Parametro p", formatNumber(result.p)),
      metric("Lado recto |4p|", formatNumber(result.lado_recto)),
      metric("Extremos lado recto", formatPointList(result.extremos_lado_recto)),
    ];
  }

  if (result.tipo_conica === "Elipse") {
    return [
      metric("Centro C(h,k)", formatPoint(result.centro)),
      metric("Focos F1, F2", formatPointList(result.focos)),
      metric("Vertices", formatPointList(result.vertices)),
      metric("Co-vertices", formatPointList(result.covertices)),
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
      metric("Vertices V1, V2", formatPointList(result.vertices)),
      metric("Eje transversal 2a", formatNumber(result.eje_transversal)),
      metric("Eje conjugado 2b", formatNumber(result.eje_conjugado)),
      metric("Distancia focal 2c", formatNumber(result.distancia_focal)),
      metric("Asintota 1", result.asintotas?.[0]?.ecuacion || "--"),
      metric("Asintota 2", result.asintotas?.[1]?.ecuacion || "--"),
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
          <div className="mt-3 overflow-x-auto text-xl font-black text-blue-950">
            <MathText value={item.value} />
          </div>
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
          ? `Se genero una ${result.tipo_conica} a partir del RUT ingresado. Componentes calculados: ${getMetrics(result).length}.`
          : "Aun no hay conica calculada. Valida un RUT para activar los resultados."}
      </p>
    </section>
  );
}
