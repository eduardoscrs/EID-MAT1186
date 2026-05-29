import { PADDING } from "./constants";
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

  const viewport = createViewportFromBounds(minX, maxX, minY, maxY, width, height);

  if (shouldUseDetailZoom(data, keyPoints, viewport)) {
    return createDetailViewport(data, keyPoints, viewport, width, height);
  }

  return viewport;
}

export function toCanvas(point, viewport) {
  return {
    x: viewport.offsetX + point[0] * viewport.scale,
    y: viewport.offsetY - point[1] * viewport.scale,
  };
}

function createViewportFromBounds(minX, maxX, minY, maxY, width, height) {
  const scale = Math.min(
    (width - PADDING * 2) / (maxX - minX),
    (height - PADDING * 2) / (maxY - minY),
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

function shouldUseDetailZoom(data, keyPoints, viewport) {
  if (!["Hiperbola", "Parabola"].includes(data?.tipo_conica)) return false;
  if (keyPoints.length < 4) return false;

  return minScreenDistance(keyPoints, viewport) < 50;
}

function createDetailViewport(data, keyPoints, viewport, width, height) {
  const minDistance = Math.max(minScreenDistance(keyPoints, viewport), 1);
  const targetDistance = data?.tipo_conica === "Hiperbola" ? 56 : 54;
  const maxZoomFactor = data?.tipo_conica === "Hiperbola" ? 2.2 : 1.8;
  const zoomFactor = Math.min(Math.max(targetDistance / minDistance, 1.12), maxZoomFactor);
  const scale = viewport.scale * zoomFactor;
  const mathWidth = (width - PADDING * 2) / scale;
  const mathHeight = (height - PADDING * 2) / scale;
  const centerX = average(keyPoints.map(([x]) => x));
  const centerY = average(keyPoints.map(([, y]) => y));

  return createViewportFromBounds(
    centerX - mathWidth / 2,
    centerX + mathWidth / 2,
    centerY - mathHeight / 2,
    centerY + mathHeight / 2,
    width,
    height,
  );
}

function minScreenDistance(points, viewport) {
  let minDistance = Infinity;

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const pointA = toCanvas(points[i], viewport);
      const pointB = toCanvas(points[j], viewport);
      const distance = Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
      if (distance > 0 && distance < minDistance) minDistance = distance;
    }
  }

  return Number.isFinite(minDistance) ? minDistance : Infinity;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
