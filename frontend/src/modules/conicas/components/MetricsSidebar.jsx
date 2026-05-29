import { MathText } from "../../../components/MathText";
import { formatLine, formatNumber, formatPoint, formatPointList } from "../utils/formatters";

const accentByIndex = [
  "bg-teal-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-violet-500",
  "bg-slate-400",
  "bg-blue-500",
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
      metric("Estado", result.estado_conica || "real"),
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

function displayConicType(type) {
  if (type === "Parabola") return "Parábola";
  if (type === "Hiperbola") return "Hipérbola";
  return type;
}

export function MetricsPanel({ result }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {getMetrics(result).map((item, index) => (
        <section key={item.label} className="panel p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            <span className={`h-3 w-3 rounded-full ${accentByIndex[index % accentByIndex.length]}`} />
            {item.label}
          </div>
          <div className="math-display mt-3 text-lg font-extrabold text-slate-950">
            <MathText value={item.value} />
          </div>
        </section>
      ))}
    </div>
  );
}

export function SummaryPanel({ result }) {
  return (
    <section className="panel flex h-full flex-col justify-between overflow-hidden bg-slate-950 p-5 text-white">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-200">Resumen</p>
        <p className="mt-3 text-sm leading-6 text-slate-100">
          {result
            ? `Se generó una ${displayConicType(result.tipo_conica)} a partir del RUT ingresado. Componentes calculados: ${getMetrics(result).length}.`
            : "Aún no hay cónica calculada. Valida un RUT para activar los resultados."}
          {result?.observacion ? ` ${result.observacion}` : ""}
        </p>
      </div>
      <div className="mt-5 flex gap-2">
        <span className="h-1.5 flex-1 rounded-full bg-teal-400" />
        <span className="h-1.5 flex-1 rounded-full bg-amber-400" />
        <span className="h-1.5 flex-1 rounded-full bg-rose-400" />
      </div>
    </section>
  );
}
