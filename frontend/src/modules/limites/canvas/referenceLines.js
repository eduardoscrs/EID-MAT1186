import { GRAPH_PADDING } from "./constants";
import { drawOpenCircle } from "./markers";
import { isFiniteNumber } from "./utils";

export function drawCriticalLine(ctx, height, a, map) {
  if (!Number.isFinite(a)) return;

  const ax = map.x(a);

  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 6]);
  ctx.beginPath();
  ctx.moveTo(ax, GRAPH_PADDING);
  ctx.lineTo(ax, height - GRAPH_PADDING);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.fillStyle = "#dc2626";
  ctx.font = "700 14px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(`x = ${a}`, ax + 15, GRAPH_PADDING + 28);
  ctx.fillText("Punto crítico", ax + 15, GRAPH_PADDING + 46);
}

export function drawLimitLines(ctx, width, a, analIzq, analDer, map) {
  ctx.setLineDash([6, 3]);
  ctx.lineWidth = 2.5;

  drawLimitLine(ctx, width, analIzq, "#2563eb", map);
  drawLimitLine(ctx, width, analDer, "#16a34a", map);

  if (isFiniteNumber(analIzq) && analDer !== analIzq) drawOpenCircle(ctx, map, a, analIzq, "#2563eb");
  if (isFiniteNumber(analDer) && analIzq !== analDer) drawOpenCircle(ctx, map, a, analDer, "#16a34a");

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

function drawLimitLine(ctx, width, value, color, map) {
  if (!isFiniteNumber(value)) return;

  const y = map.y(value);

  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(GRAPH_PADDING, y);
  ctx.lineTo(width - GRAPH_PADDING, y);
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#64748b";
  ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(value.toFixed(2), GRAPH_PADDING - 15, y + 4);
  ctx.textAlign = "left";
}
