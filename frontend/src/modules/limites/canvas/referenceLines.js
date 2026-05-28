import { GRAPH_PADDING } from "./constants";
import { drawOpenCircle } from "./markers";
import { isFiniteNumber } from "./utils";

export function drawCriticalLine(ctx, height, a, map) {
  if (!Number.isFinite(a)) return;

  const ax = map.x(a);

  ctx.shadowColor = "rgba(239, 68, 68, 0.6)";
  ctx.shadowBlur = 15;
  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 6]);
  ctx.beginPath();
  ctx.moveTo(ax, GRAPH_PADDING);
  ctx.lineTo(ax, height - GRAPH_PADDING);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.setLineDash([]);
  ctx.fillStyle = "#dc2626";
  ctx.font = "bold 14px Arial";
  ctx.fillText(`x = ${a}`, ax + 15, GRAPH_PADDING + 28);
  ctx.fillText("Punto critico", ax + 15, GRAPH_PADDING + 46);
}

export function drawLimitLines(ctx, width, a, analIzq, analDer, map) {
  ctx.setLineDash([6, 3]);
  ctx.lineWidth = 2.5;

  drawLimitLine(ctx, width, a, analIzq, "#2563eb", "lim x->a-", -10, map);
  drawLimitLine(ctx, width, a, analDer, "#16a34a", "lim x->a+", 14, map);

  if (isFiniteNumber(analIzq) && analDer !== analIzq) drawOpenCircle(ctx, map, a, analIzq, "#2563eb");
  if (isFiniteNumber(analDer) && analIzq !== analDer) drawOpenCircle(ctx, map, a, analDer, "#16a34a");

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

function drawLimitLine(ctx, width, a, value, color, label, labelOffset, map) {
  if (!isFiniteNumber(value)) return;

  const y = map.y(value);

  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(GRAPH_PADDING, y);
  ctx.lineTo(width - GRAPH_PADDING, y);
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.font = "bold 12px Arial";
  ctx.fillText(`${label} = ${value.toFixed(4)}`, GRAPH_PADDING + 12, y + labelOffset);
}
