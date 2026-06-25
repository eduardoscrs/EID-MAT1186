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
  if (!puntos) return collectGeneratedGraphPoints(data);

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

  return points.length ? points : collectGeneratedGraphPoints(data);
}

function collectGeneratedGraphPoints(data) {
  const tipo = data?.tipo_conica;

  if (tipo === "Circunferencia") return collectCircleBounds(data);
  if (tipo === "Elipse") return collectEllipseBounds(data);
  if (tipo === "Parabola") return collectParabolaBounds(data);
  if (tipo === "Hiperbola") return collectHyperbolaBounds(data);

  return [];
}

function collectCircleBounds(data) {
  const h = data?.centro?.[0];
  const k = data?.centro?.[1];
  const radio = data?.radio;

  if (!finiteNumber(h) || !finiteNumber(k) || !finiteNumber(radio) || radio < 0) return [];
  if (radio === 0) return [[h, k]];

  return [
    [h - radio, k],
    [h + radio, k],
    [h, k - radio],
    [h, k + radio],
  ];
}

function collectEllipseBounds(data) {
  const h = data?.centro?.[0];
  const k = data?.centro?.[1];
  const radioX = data?.semieje_x;
  const radioY = data?.semieje_y;

  if (!finiteNumber(h) || !finiteNumber(k) || !finiteNumber(radioX) || !finiteNumber(radioY) || radioX <= 0 || radioY <= 0) return [];

  return [
    [h - radioX, k],
    [h + radioX, k],
    [h, k - radioY],
    [h, k + radioY],
  ];
}

function collectParabolaBounds(data) {
  const h = data?.vertice?.[0];
  const k = data?.vertice?.[1];
  const p = data?.p;
  const orientacion = data?.orientacion;

  if (!finiteNumber(h) || !finiteNumber(k) || !finiteNumber(p) || p === 0) return [];

  const points = [[h, k]];
  const span = Math.max(Math.abs(p) * 4, 1);

  if (orientacion === "Vertical") {
    [-span, -span / 2, span / 2, span].forEach((dx) => {
      points.push([h + dx, k + (dx ** 2) / (4 * p)]);
    });
  } else {
    [-span, -span / 2, span / 2, span].forEach((dy) => {
      points.push([h + (dy ** 2) / (4 * p), k + dy]);
    });
  }

  return points;
}

function collectHyperbolaBounds(data) {
  const h = data?.centro?.[0];
  const k = data?.centro?.[1];
  const a = data?.a;
  const b = data?.b;
  const orientacion = data?.orientacion;

  if (!finiteNumber(h) || !finiteNumber(k) || !finiteNumber(a) || !finiteNumber(b) || a <= 0 || b <= 0) return [];

  const points = [];
  const maxFactor = 4;

  for (let factor = 1; factor <= maxFactor; factor += 1) {
    if (orientacion === "Horizontal") {
      const xOffset = a * factor;
      const inside = (xOffset ** 2) / (a ** 2) - 1;
      const yOffset = b * Math.sqrt(Math.max(inside, 0));

      points.push([h - xOffset, k + yOffset], [h - xOffset, k - yOffset], [h + xOffset, k + yOffset], [h + xOffset, k - yOffset]);
    } else {
      const yOffset = a * factor;
      const inside = (yOffset ** 2) / (a ** 2) - 1;
      const xOffset = b * Math.sqrt(Math.max(inside, 0));

      points.push([h + xOffset, k - yOffset], [h - xOffset, k - yOffset], [h + xOffset, k + yOffset], [h - xOffset, k + yOffset]);
    }
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
