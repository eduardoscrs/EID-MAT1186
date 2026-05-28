import { isFiniteNumber } from "./utils";

function collectBranchPoints(xs, ys, a, side, caso, analIzq, analDer, map) {
  const points = [];

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];

    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    if (side === "left" && x >= a) continue;
    if (side === "right" && x < a) continue;

    points.push({ x, y, px: map.x(x), py: map.y(y) });
  }

  if (caso !== "infinita") {
    const endpointY = side === "left" ? analIzq : analDer;
    if (isFiniteNumber(a) && isFiniteNumber(endpointY)) {
      points.push({ x: a, y: endpointY, px: map.x(a), py: map.y(endpointY) });
    }
  }

  return points.sort((p1, p2) => p1.x - p2.x);
}

export function drawBranch(ctx, xs, ys, a, side, caso, analIzq, analDer, map) {
  const points = collectBranchPoints(xs, ys, a, side, caso, analIzq, analDer, map);
  if (points.length < 2) return;

  ctx.strokeStyle = side === "left" ? "#2563eb" : "#16a34a";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 8;

  ctx.beginPath();
  ctx.moveTo(points[0].px, points[0].py);

  for (let i = 1; i < points.length; i++) {
    const curr = points[i];
    const prev = points[i - 1];

    if (caso === "infinita" && Math.abs(curr.x - a) < 0.5) {
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(curr.px, curr.py);
      continue;
    }

    ctx.quadraticCurveTo((prev.px + curr.px) / 2, (prev.py + curr.py) / 2, curr.px, curr.py);
  }

  ctx.stroke();
  ctx.shadowBlur = 0;
}
