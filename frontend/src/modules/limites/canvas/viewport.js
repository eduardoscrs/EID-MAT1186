import { GRAPH_PADDING } from "./constants";
import { isFiniteNumber } from "./utils";

export function buildViewport(xs, ys, a, analIzq, analDer, caso) {
  const ysValid = ys.filter((value) => isFiniteNumber(value));

  let minX = Math.min(...xs, a);
  let maxX = Math.max(...xs, a);
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

  const rangeY = maxY - minY || 1;
  const verticalPadding = caso === "infinita" ? 0 : rangeY * 0.2;

  return {
    minX,
    maxX,
    minY: minY - verticalPadding,
    maxY: maxY + verticalPadding,
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
