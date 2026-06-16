import { COLORS } from "./constants";
import { finiteNumber } from "./utils";
import { toCanvas } from "./viewport";

export function drawAuxiliaryElements(ctx, data, viewport) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (data.tipo_conica === "Parabola") {
    drawLineObject(ctx, data.eje_simetria, viewport, COLORS.symmetry, [10, 8]);
    drawLineObject(ctx, data.directriz_recta, viewport, COLORS.directrix, [7, 7]);
    drawSegment(ctx, data.extremos_lado_recto, viewport, COLORS.latus, 3);
  }

  if (data.tipo_conica === "Elipse") {
    drawSegment(ctx, data.vertices, viewport, COLORS.axisMajor, 2.5);
    drawSegment(ctx, data.covertices, viewport, COLORS.axisMinor, 2.5);
  }

  if (data.tipo_conica === "Hiperbola") {
    data.asintotas?.forEach((line) => {
      drawObliqueLine(ctx, line, viewport, COLORS.asymptote, [9, 7]);
    });
    drawLineObject(ctx, data.eje_transversal_recta, viewport, COLORS.axisMajor, [10, 8]);
    drawLineObject(ctx, data.eje_conjugado_recta, viewport, COLORS.axisMinor, [10, 8]);
  }

  ctx.restore();
}

function drawLineObject(ctx, line, viewport, color, dash) {
  if (!line) return;
  if (line.tipo === "vertical") {
    const x = viewport.offsetX + line.x * viewport.scale;
    drawCanvasLine(ctx, x, 0, x, ctx.canvas.height, color, dash);
  }
  if (line.tipo === "horizontal") {
    const y = viewport.offsetY - line.y * viewport.scale;
    drawCanvasLine(ctx, 0, y, ctx.canvas.width, y, color, dash);
  }
}

function drawObliqueLine(ctx, line, viewport, color, dash) {
  if (!line || !finiteNumber(line.m)) return;

  const endpoints = getObliqueLineCanvasEndpoints(ctx, line, viewport);
  if (endpoints.length < 2) return;

  const [point1, point2] = endpoints;
  drawCanvasLine(ctx, point1.x, point1.y, point2.x, point2.y, color, dash);
}

function drawSegment(ctx, points, viewport, color, lineWidth = 2) {
  if (!points?.[0] || !points?.[1]) return;

  const start = toCanvas(points[0], viewport);
  const end = toCanvas(points[1], viewport);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.restore();
}

function drawCanvasLine(ctx, x1, y1, x2, y2, color, dash) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function getObliqueLineCanvasEndpoints(ctx, line, viewport) {
  const bounds = getVisibleMathBounds(ctx, viewport);
  const candidates = [];

  addLinePointIfVisible(candidates, [bounds.minX, line.k + line.m * (bounds.minX - line.h)], bounds);
  addLinePointIfVisible(candidates, [bounds.maxX, line.k + line.m * (bounds.maxX - line.h)], bounds);
  addLinePointIfVisible(candidates, [line.h + (bounds.minY - line.k) / line.m, bounds.minY], bounds);
  addLinePointIfVisible(candidates, [line.h + (bounds.maxY - line.k) / line.m, bounds.maxY], bounds);

  const unique = candidates.filter((point, index, points) => {
    return points.findIndex(([x, y]) => Math.abs(point[0] - x) < 0.001 && Math.abs(point[1] - y) < 0.001) === index;
  });

  return unique.slice(0, 2).map((point) => toCanvas(point, viewport));
}

function addLinePointIfVisible(points, point, bounds) {
  const [x, y] = point;
  if (!finiteNumber(x) || !finiteNumber(y)) return;
  if (x < bounds.minX - 0.001 || x > bounds.maxX + 0.001) return;
  if (y < bounds.minY - 0.001 || y > bounds.maxY + 0.001) return;
  points.push(point);
}

function getVisibleMathBounds(ctx, viewport) {
  return {
    minX: (0 - viewport.offsetX) / viewport.scale,
    maxX: (ctx.canvas.width - viewport.offsetX) / viewport.scale,
    maxY: viewport.offsetY / viewport.scale,
    minY: (viewport.offsetY - ctx.canvas.height) / viewport.scale,
  };
}
