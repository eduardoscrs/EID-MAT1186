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
}

function drawRemovable(ctx, a, analIzq, map) {
  if (!isFiniteNumber(analIzq)) return;

  drawOpenCircle(ctx, map, a, analIzq, "#0f172a");
}

function drawJump(ctx, a, analIzq, analDer, map) {
  if (isFiniteNumber(analIzq)) drawOpenCircle(ctx, map, a, analIzq, "#2563eb");
  if (isFiniteNumber(analDer)) drawClosedCircle(ctx, map, a, analDer, "#16a34a");
}
