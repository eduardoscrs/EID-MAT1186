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

function metric(label, value, unlockFields = []) {
  return { label, unlockFields, value };
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
      metric("Centro C(h,k)", formatPoint(result.centro), ["centro_vertice"]),
      metric("Radio r", formatNumber(result.radio), ["justificacion"]),
      metric("Estado", result.estado_conica || "real", ["justificacion"]),
    ];
  }

  if (result.tipo_conica === "Parabola") {
    return [
      metric("Vértice V(h,k)", formatPoint(result.vertice), ["centro_vertice"]),
      metric("Foco F", formatPoint(result.foco), ["focos"]),
      metric("Directriz", formatLine(result.directriz_recta), ["directriz"]),
      metric("Eje de simetría", formatLine(result.eje_simetria), ["eje_principal"]),
      metric("Parámetro p", formatNumber(result.p), ["justificacion"]),
      metric("Lado recto |4p|", formatNumber(result.lado_recto), ["justificacion"]),
      metric("Extremos lado recto", formatPointList(result.extremos_lado_recto), ["justificacion"]),
    ];
  }

  if (result.tipo_conica === "Elipse") {
    return [
      metric("Centro C(h,k)", formatPoint(result.centro), ["centro_vertice"]),
      metric("Focos F1, F2", formatPointList(result.focos), ["focos"]),
      metric("Vértices", formatPointList(result.vertices), ["vertices"]),
      metric("Co-vértices", formatPointList(result.covertices), ["eje_secundario"]),
      metric("Eje mayor 2a", formatNumber(result.eje_mayor), ["eje_principal"]),
      metric("Eje menor 2b", formatNumber(result.eje_menor), ["eje_secundario"]),
      metric("Distancia focal 2c", formatNumber(result.distancia_focal), ["justificacion"]),
      metric("Excentricidad e", formatNumber(result.excentricidad), ["justificacion"]),
    ];
  }

  if (result.tipo_conica === "Hiperbola") {
    return [
      metric("Centro C(h,k)", formatPoint(result.centro), ["centro_vertice"]),
      metric("Focos F1, F2", formatPointList(result.focos), ["focos"]),
      metric("Vértices V1, V2", formatPointList(result.vertices), ["vertices"]),
      metric("Eje transversal 2a", formatNumber(result.eje_transversal), ["eje_principal"]),
      metric("Eje conjugado 2b", formatNumber(result.eje_conjugado), ["eje_secundario"]),
      metric("Distancia focal 2c", formatNumber(result.distancia_focal), ["justificacion"]),
      metric("Asíntota 1", result.asintotas?.[0]?.ecuacion || "--", ["justificacion"]),
      metric("Asíntota 2", result.asintotas?.[1]?.ecuacion || "--", ["justificacion"]),
      metric("Excentricidad e", formatNumber(result.excentricidad), ["justificacion"]),
    ];
  }

  return [];
}

export function MetricsPanel({ defenseChecks = {}, result }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {getMetrics(result).map((item, index) => {
        const isRevealed = shouldRevealMetric(item, defenseChecks);

        return (
          <section key={item.label} className="panel p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
              <span className={`h-3 w-3 rounded-full ${accentByIndex[index % accentByIndex.length]}`} />
              {item.label}
            </div>
            <div
              className={`math-display mt-3 text-lg font-extrabold ${
                isRevealed ? "text-slate-950" : "text-slate-400"
              }`}
            >
              <MathText value={isRevealed ? item.value : "--"} />
            </div>
          </section>
        );
      })}
    </div>
  );
}

function shouldRevealMetric(item, checks) {
  if (!item.unlockFields.length) return false;
  return item.unlockFields.some((fieldName) => checks[fieldName]?.status === "correct");
}
