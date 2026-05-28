import { drawAxes } from "./axes";
import { drawBranch } from "./branches";
import { LIMIT_CANVAS_HEIGHT, LIMIT_CANVAS_WIDTH } from "./constants";
import { drawDiscontinuity } from "./discontinuities";
import { drawCriticalLine, drawLimitLines } from "./referenceLines";
import { normalizeY } from "./utils";
import { buildViewport, createMapper } from "./viewport";

export { LIMIT_CANVAS_HEIGHT, LIMIT_CANVAS_WIDTH };

export function drawLimitGraph(canvas, { samples, caso }) {
  if (!canvas || !samples) return;

  const ctx = canvas.getContext("2d");
  const width = (canvas.width = LIMIT_CANVAS_WIDTH);
  const height = (canvas.height = LIMIT_CANVAS_HEIGHT);

  ctx.clearRect(0, 0, width, height);

  const xs = (samples.xs || []).map((value) =>
    value === null || value === undefined ? value : Number(value)
  );
  const ys = (samples.ys || []).map(normalizeY);

  if (!xs.length) return;

  const a = Number(samples.a);
  const analIzq = samples?.analytic?.izq;
  const analDer = samples?.analytic?.der;
  const viewport = buildViewport(xs, ys, a, analIzq, analDer);
  const map = createMapper(width, height, viewport);

  drawAxes(ctx, width, height, viewport, map);
  drawLimitLines(ctx, width, a, analIzq, analDer, map);
  drawCriticalLine(ctx, height, a, map);
  drawBranch(ctx, xs, ys, a, "left", caso, analIzq, analDer, map);
  drawBranch(ctx, xs, ys, a, "right", caso, analIzq, analDer, map);
  drawDiscontinuity(ctx, caso, a, analIzq, analDer, map);
}
