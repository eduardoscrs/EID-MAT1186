import { COLORS } from "./constants";
import { collectValidPathPoints } from "./collectors";
import { toCanvas } from "./viewport";

export function drawConicPaths(ctx, data, viewport) {
  const tipo = data.tipo_conica;
  const puntos = data.puntos_grafica;

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.strokeStyle = COLORS.curveGlow;
  ctx.lineWidth = 10;
  drawCurveByType(ctx, tipo, puntos, viewport);

  ctx.strokeStyle = COLORS.curve;
  ctx.lineWidth = 3.5;
  drawCurveByType(ctx, tipo, puntos, viewport);

  ctx.restore();
}

function drawCurveByType(ctx, tipo, puntos, viewport) {
  if (tipo === "Circunferencia" || tipo === "Elipse") {
    drawClosedTopBottomPath(ctx, puntos, viewport);
  }

  if (tipo === "Parabola") {
    drawPath(ctx, { x: puntos.x, y: puntos.y_pos }, viewport);
    drawPath(ctx, { x: puntos.x, y: puntos.y_neg }, viewport);
  }

  if (tipo === "Hiperbola") {
    drawPath(ctx, puntos.rama_izq, viewport);
    drawPath(ctx, puntos.rama_izq ? { x: puntos.rama_izq.x, y: puntos.rama_izq.y_neg } : null, viewport);
    drawPath(ctx, puntos.rama_der, viewport);
    drawPath(ctx, puntos.rama_der ? { x: puntos.rama_der.x, y: puntos.rama_der.y_neg } : null, viewport);
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
