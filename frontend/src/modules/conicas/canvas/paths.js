import { COLORS } from "./constants";
import { collectValidPathPoints } from "./collectors";
import { toCanvas } from "./viewport";

export function drawConicPaths(ctx, data, viewport) {
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.strokeStyle = COLORS.curveGlow;
  ctx.lineWidth = 10;
  drawCurveByType(ctx, data, viewport);

  ctx.strokeStyle = COLORS.curve;
  ctx.lineWidth = 3.5;
  drawCurveByType(ctx, data, viewport);

  ctx.restore();
}

function drawCurveByType(ctx, data, viewport) {
  const tipo = data.tipo_conica;
  const puntos = data.puntos_grafica;

  if (tipo === "Circunferencia" || tipo === "Elipse") {
    drawClosedTopBottomPath(ctx, puntos, viewport);
  }

  if (tipo === "Parabola") {
    drawParabolaPath(ctx, data, viewport);
  }

  if (tipo === "Hiperbola") {
    drawHyperbolaPath(ctx, data, viewport);
  }
}

function drawClosedTopBottomPath(ctx, points, viewport) {
  const upper = collectValidPathPoints({ x: points.x, y: points.y_pos });
  const lower = collectValidPathPoints({ x: points.x, y: points.y_neg }).reverse();
  const canvasPoints = [...upper, ...lower].map((point) => toCanvas(point, viewport));
  if (canvasPoints.length < 3) return;

  ctx.beginPath();
  canvasPoints.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.stroke();
}

function drawPath(ctx, points, viewport) {
  const canvasPoints = collectValidPathPoints(points).map((point) => toCanvas(point, viewport));
  if (canvasPoints.length < 2) return;

  ctx.beginPath();
  canvasPoints.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
}

function drawCanvasPolyline(ctx, canvasPoints) {
  if (canvasPoints.length < 2) return;

  ctx.beginPath();
  canvasPoints.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
}

function drawParabolaPath(ctx, data, viewport) {
  const puntos = data?.puntos_grafica;
  const h = data?.vertice?.[0];
  const k = data?.vertice?.[1];
  const p = data?.p;
  const orientacion = data?.orientacion;

  if (!Number.isFinite(h) || !Number.isFinite(k) || !Number.isFinite(p) || p === 0) {
    drawPath(ctx, { x: puntos?.x, y: puntos?.y_pos }, viewport);
    drawPath(ctx, { x: puntos?.x, y: puntos?.y_neg }, viewport);
    return;
  }

  const canvasPoints = [];
  const steps = 700;
  const visible = getVisibleMathBounds(ctx, viewport);

  if (orientacion === "Vertical") {
    for (let index = 0; index <= steps; index += 1) {
      const x = visible.minX + ((visible.maxX - visible.minX) * index) / steps;
      const y = k + ((x - h) ** 2) / (4 * p);
      canvasPoints.push(toCanvas([x, y], viewport));
    }
  } else {
    for (let index = 0; index <= steps; index += 1) {
      const y = visible.maxY - ((visible.maxY - visible.minY) * index) / steps;
      const x = h + ((y - k) ** 2) / (4 * p);
      canvasPoints.push(toCanvas([x, y], viewport));
    }
  }

  drawCanvasPolyline(ctx, canvasPoints);
}

function drawHyperbolaPath(ctx, data, viewport) {
  const puntos = data?.puntos_grafica;
  const h = data?.centro?.[0];
  const k = data?.centro?.[1];
  const a = data?.a;
  const b = data?.b;
  const orientacion = data?.orientacion;

  if (!Number.isFinite(h) || !Number.isFinite(k) || !Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) {
    drawPath(ctx, puntos?.rama_izq, viewport);
    drawPath(ctx, puntos?.rama_izq ? { x: puntos.rama_izq.x, y: puntos.rama_izq.y_neg } : null, viewport);
    drawPath(ctx, puntos?.rama_der, viewport);
    drawPath(ctx, puntos?.rama_der ? { x: puntos.rama_der.x, y: puntos.rama_der.y_neg } : null, viewport);
    return;
  }

  const visible = getVisibleMathBounds(ctx, viewport);

  if (orientacion === "Horizontal") {
    drawHorizontalHyperbola(ctx, { h, k, a, b, side: -1, visible, viewport });
    drawHorizontalHyperbola(ctx, { h, k, a, b, side: 1, visible, viewport });
  } else {
    drawVerticalHyperbola(ctx, { h, k, a, b, side: -1, visible, viewport });
    drawVerticalHyperbola(ctx, { h, k, a, b, side: 1, visible, viewport });
  }
}

function drawHorizontalHyperbola(ctx, { h, k, a, b, side, visible, viewport }) {
  const start = side < 0 ? visible.minX : h + a;
  const end = side < 0 ? h - a : visible.maxX;
  if (start >= end) return;

  const upper = [];
  const lower = [];
  const steps = 560;

  for (let index = 0; index <= steps; index += 1) {
    const x = start + ((end - start) * index) / steps;
    const inside = ((x - h) ** 2) / (a ** 2) - 1;
    if (inside < 0) continue;

    const offset = b * Math.sqrt(inside);
    upper.push(toCanvas([x, k + offset], viewport));
    lower.push(toCanvas([x, k - offset], viewport));
  }

  drawCanvasPolyline(ctx, upper);
  drawCanvasPolyline(ctx, lower);
}

function drawVerticalHyperbola(ctx, { h, k, a, b, side, visible, viewport }) {
  const start = side < 0 ? visible.minY : k + a;
  const end = side < 0 ? k - a : visible.maxY;
  if (start >= end) return;

  const right = [];
  const left = [];
  const steps = 560;

  for (let index = 0; index <= steps; index += 1) {
    const y = start + ((end - start) * index) / steps;
    const inside = ((y - k) ** 2) / (a ** 2) - 1;
    if (inside < 0) continue;

    const offset = b * Math.sqrt(inside);
    right.push(toCanvas([h + offset, y], viewport));
    left.push(toCanvas([h - offset, y], viewport));
  }

  drawCanvasPolyline(ctx, right);
  drawCanvasPolyline(ctx, left);
}

function getVisibleMathBounds(ctx, viewport) {
  const minX = (0 - viewport.offsetX) / viewport.scale;
  const maxX = (ctx.canvas.width - viewport.offsetX) / viewport.scale;
  const maxY = viewport.offsetY / viewport.scale;
  const minY = (viewport.offsetY - ctx.canvas.height) / viewport.scale;
  const overscanX = (maxX - minX) * 0.2;
  const overscanY = (maxY - minY) * 0.2;

  return {
    minX: minX - overscanX,
    maxX: maxX + overscanX,
    minY: minY - overscanY,
    maxY: maxY + overscanY,
  };
}
