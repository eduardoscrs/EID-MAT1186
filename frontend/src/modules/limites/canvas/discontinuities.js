import { GRAPH_PADDING } from "./constants";
import { drawClosedCircle, drawOpenCircle } from "./markers";
import { isFiniteNumber } from "./utils";

export function drawDiscontinuity(ctx, caso, a, analIzq, analDer, map) {
  if (caso === "removible") {
    drawRemovable(ctx, a, analIzq, map);
    return;
  }

  if (caso === "salto") {
    drawJump(ctx, a, analIzq, analDer, map);
    return;
  }

  if (caso === "infinita") {
    drawInfinite(ctx, a, map);
  }
}

function drawRemovable(ctx, a, analIzq, map) {
  if (!isFiniteNumber(analIzq)) return;

  drawOpenCircle(ctx, map, a, analIzq, "#0f172a");
  ctx.fillStyle = "#0f172a";
  ctx.font = "700 12px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Discontinuidad removible", map.x(a) + 20, map.y(analIzq) - 20);
}

function drawJump(ctx, a, analIzq, analDer, map) {
  if (isFiniteNumber(analIzq)) drawOpenCircle(ctx, map, a, analIzq, "#2563eb");
  if (isFiniteNumber(analDer)) drawClosedCircle(ctx, map, a, analDer, "#16a34a");

  const midY = isFiniteNumber(analIzq) && isFiniteNumber(analDer) ? (analIzq + analDer) / 2 : analIzq ?? analDer;
  ctx.fillStyle = "#000";
  ctx.font = "700 12px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Discontinuidad de salto", map.x(a) + 20, map.y(midY));
}

function drawInfinite(ctx, a, map) {
  ctx.fillStyle = "#dc2626";
  ctx.font = "700 12px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Asíntota vertical", map.x(a) + 20, GRAPH_PADDING + 70);
}
