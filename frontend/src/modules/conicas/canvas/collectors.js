import { COLORS } from "./constants";
import { finiteNumber } from "./utils";

export function collectValidPathPoints(path) {
  if (!path?.x?.length || !path?.y?.length) return [];

  return path.x.reduce((points, x, index) => {
    const y = path.y[index];
    if (finiteNumber(x) && finiteNumber(y)) points.push([x, y]);
    return points;
  }, []);
}

export function collectGraphPoints(data) {
  const puntos = data?.puntos_grafica;
  if (!puntos) return [];

  const points = [];

  if (puntos.x) {
    points.push(...collectValidPathPoints({ x: puntos.x, y: puntos.y_pos }));
    points.push(...collectValidPathPoints({ x: puntos.x, y: puntos.y_neg }));
  }

  if (puntos.rama_izq) {
    points.push(...collectValidPathPoints({ x: puntos.rama_izq.x, y: puntos.rama_izq.y }));
    points.push(...collectValidPathPoints({ x: puntos.rama_izq.x, y: puntos.rama_izq.y_neg }));
  }

  if (puntos.rama_der) {
    points.push(...collectValidPathPoints({ x: puntos.rama_der.x, y: puntos.rama_der.y }));
    points.push(...collectValidPathPoints({ x: puntos.rama_der.x, y: puntos.rama_der.y_neg }));
  }

  return points;
}

export function collectKeyPoints(data) {
  const points = [];

  if (data?.centro) points.push({ label: "Centro", value: data.centro, color: COLORS.center });
  if (data?.vertice) points.push({ label: "Vértice", value: data.vertice, color: COLORS.vertex });
  if (Array.isArray(data?.vertices)) {
    data.vertices.forEach((value, index) => points.push({ label: `V${index + 1}`, value, color: COLORS.vertex }));
  }
  if (Array.isArray(data?.covertices)) {
    data.covertices.forEach((value, index) => points.push({ label: `B${index + 1}`, value, color: COLORS.axisMinor }));
  }
  if (Array.isArray(data?.extremos_conjugados)) {
    data.extremos_conjugados.forEach((value, index) => points.push({ label: `B${index + 1}`, value, color: COLORS.axisMinor }));
  }
  if (Array.isArray(data?.extremos_lado_recto)) {
    data.extremos_lado_recto.forEach((value, index) => points.push({ label: `LR${index + 1}`, value, color: COLORS.latus }));
  }
  if (Array.isArray(data?.focos)) {
    data.focos.forEach((value, index) => points.push({ label: `F${index + 1}`, value, color: COLORS.focus }));
  } else if (data?.foco) {
    points.push({ label: "Foco", value: data.foco, color: COLORS.focus });
  }

  return points.filter(({ value }) => finiteNumber(value?.[0]) && finiteNumber(value?.[1]));
}
