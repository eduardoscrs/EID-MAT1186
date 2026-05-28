import { COLORS } from "./constants";
import { drawLabel } from "./labels";
import { finiteNumber } from "./utils";
import { toCanvas } from "./viewport";

export function drawAuxiliaryElements(ctx, data, viewport) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (data.tipo_conica === "Parabola") {
    drawLineObject(ctx, data.eje_simetria, viewport, COLORS.symmetry, [10, 8], "Eje");
    drawLineObject(ctx, data.directriz_recta, viewport, COLORS.directrix, [7, 7], "Directriz");
    drawSegment(ctx, data.extremos_lado_recto, viewport, COLORS.latus, 3, "Lado recto");
  }

  if (data.tipo_conica === "Elipse") {
    drawSegment(ctx, data.vertices, viewport, COLORS.axisMajor, 2.5, "Eje mayor");
    drawSegment(ctx, data.covertices, viewport, COLORS.axisMinor, 2.5, "Eje menor");
  }

  if (data.tipo_conica === "Hiperbola") {
    data.asintotas?.forEach((line, index) => {
      drawObliqueLine(ctx, line, viewport, COLORS.asymptote, [9, 7], `Asintota ${index + 1}`);
    });
    drawSegment(ctx, data.vertices, viewport, COLORS.axisMajor, 2.5, "Eje real");
    drawSegment(ctx, data.extremos_conjugados, viewport, COLORS.axisMinor, 2.5, "Eje conj.");
  }

  ctx.restore();
}

function drawLineObject(ctx, line, viewport, color, dash, label) {
  if (!line) return;
  if (line.tipo === "vertical") {
    const x = viewport.offsetX + line.x * viewport.scale;
    drawCanvasLine(ctx, x, 0, x, ctx.canvas.height, color, dash);
    drawLabel(ctx, label, x + 8, 16, color);
  }
  if (line.tipo === "horizontal") {
    const y = viewport.offsetY - line.y * viewport.scale;
    drawCanvasLine(ctx, 0, y, ctx.canvas.width, y, color, dash);
    drawLabel(ctx, label, ctx.canvas.width - 94, y + 8, color);
  }
}

function drawObliqueLine(ctx, line, viewport, color, dash, label) {
  if (!line || !finiteNumber(line.m)) return;

  const x1Value = viewport.minX;
  const x2Value = viewport.maxX;
  const y1Value = line.k + line.m * (x1Value - line.h);
  const y2Value = line.k + line.m * (x2Value - line.h);
  const point1 = toCanvas([x1Value, y1Value], viewport);
  const point2 = toCanvas([x2Value, y2Value], viewport);

  drawCanvasLine(ctx, point1.x, point1.y, point2.x, point2.y, color, dash);
  const labelPoint = toCanvas([viewport.maxX - (viewport.maxX - viewport.minX) * 0.22, y2Value], viewport);
  drawLabel(ctx, label, Math.min(labelPoint.x, ctx.canvas.width - 110), Math.max(labelPoint.y, 12), color);
}

function drawSegment(ctx, points, viewport, color, lineWidth = 2, label) {
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

  if (label) {
    drawLabel(ctx, label, (start.x + end.x) / 2 + 10, (start.y + end.y) / 2 + 10, color);
  }
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
