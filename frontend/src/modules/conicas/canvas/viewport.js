import { MAX_SCALE, MIN_SCALE, PADDING } from "./constants";
import { collectGraphPoints, collectKeyPoints } from "./collectors";

export function calculateViewport(data, width, height) {
  const graphPoints = collectGraphPoints(data);
  const keyPoints = collectKeyPoints(data).map(({ value }) => value);
  const allPoints = [...graphPoints, ...keyPoints];

  if (!allPoints.length) {
    return {
      scale: 32,
      minX: -10,
      maxX: 10,
      minY: -6,
      maxY: 6,
      offsetX: width / 2,
      offsetY: height / 2,
    };
  }

  let minX = Math.min(...allPoints.map(([x]) => x));
  let maxX = Math.max(...allPoints.map(([x]) => x));
  let minY = Math.min(...allPoints.map(([, y]) => y));
  let maxY = Math.max(...allPoints.map(([, y]) => y));

  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const marginX = Math.max(spanX * 0.16, 1);
  const marginY = Math.max(spanY * 0.16, 1);

  minX -= marginX;
  maxX += marginX;
  minY -= marginY;
  maxY += marginY;

  const scale = Math.max(
    MIN_SCALE,
    Math.min(MAX_SCALE, (width - PADDING * 2) / (maxX - minX), (height - PADDING * 2) / (maxY - minY)),
  );

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  return {
    scale,
    minX,
    maxX,
    minY,
    maxY,
    offsetX: width / 2 - midX * scale,
    offsetY: height / 2 + midY * scale,
  };
}

export function toCanvas(point, viewport) {
  return {
    x: viewport.offsetX + point[0] * viewport.scale,
    y: viewport.offsetY - point[1] * viewport.scale,
  };
}
