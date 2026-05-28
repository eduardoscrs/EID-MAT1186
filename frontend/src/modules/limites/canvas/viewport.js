import { GRAPH_PADDING } from "./constants";
import { isFiniteNumber } from "./utils";

export function buildViewport(xs, ys, a, analIzq, analDer) {
  const ysValid = ys.filter((value) => isFiniteNumber(value));

  let minX = Math.min(...xs, a, 0);
  let maxX = Math.max(...xs, a, 0);
  let minY = ysValid.length ? Math.min(...ysValid) : -10;
  let maxY = ysValid.length ? Math.max(...ysValid) : 10;

  if (isFiniteNumber(analIzq)) {
    minY = Math.min(minY, analIzq);
    maxY = Math.max(maxY, analIzq);
  }

  if (isFiniteNumber(analDer)) {
    minY = Math.min(minY, analDer);
    maxY = Math.max(maxY, analDer);
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  return {
    minX: a - rangeX * 0.6,
    maxX: a + rangeX * 0.6,
    minY: minY - rangeY * 0.2,
    maxY: maxY + rangeY * 0.2,
  };
}

export function createMapper(width, height, viewport) {
  const { minX, maxX, minY, maxY } = viewport;

  return {
    x: (value) =>
      ((value - minX) / (maxX - minX || 1)) * (width - GRAPH_PADDING * 2) + GRAPH_PADDING,
    y: (value) =>
      height -
      (((value - minY) / (maxY - minY || 1)) * (height - GRAPH_PADDING * 2) + GRAPH_PADDING),
  };
}
