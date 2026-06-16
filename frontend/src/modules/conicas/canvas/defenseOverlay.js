import { COLORS } from "./constants";
import { roundRect } from "./utils";
import { toCanvas } from "./viewport";

const DEFENSE_COLOR = "#14b8a6";
const HIT_RADIUS = 17;

const ROLE_COLORS = {
  axis: COLORS.symmetry,
  center: COLORS.center,
  directrix: COLORS.directrix,
  focus: COLORS.focus,
  line: DEFENSE_COLOR,
  point: DEFENSE_COLOR,
  vertex: COLORS.vertex,
};

export function drawDefenseOverlay(ctx, overlay, viewport, hoveredPoint) {
  if (!overlay) return;

  const points = overlay.points || [];
  const lines = overlay.lines || [];

  if (!points.length && !lines.length) return;

  ctx.save();
  lines.forEach((entry) => drawDefenseLine(ctx, entry, viewport));
  points.forEach((entry) => drawDefensePoint(ctx, entry, viewport));
  if (hoveredPoint) drawDefenseTooltip(ctx, hoveredPoint, viewport);
  ctx.restore();
}

export function findDefensePointAtCanvasPosition(overlay, viewport, canvasPosition) {
  if (!overlay?.points?.length || !canvasPosition) return null;

  let closest = null;
  let closestDistance = Infinity;

  overlay.points.forEach((entry) => {
    const canvasPoint = toCanvas(entry.point, viewport);
    const distance = Math.hypot(canvasPoint.x - canvasPosition.x, canvasPoint.y - canvasPosition.y);

    if (distance <= HIT_RADIUS && distance < closestDistance) {
      closest = entry;
      closestDistance = distance;
    }
  });

  return closest;
}

function drawDefensePoint(ctx, entry, viewport) {
  const color = getRoleColor(entry.role);
  const canvasPoint = toCanvas(entry.point, viewport);

  ctx.save();
  ctx.shadowColor = withAlpha(color, 0.28);
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(canvasPoint.x, canvasPoint.y, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(canvasPoint.x, canvasPoint.y, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDefenseLine(ctx, lineEntry, viewport) {
  const line = lineEntry?.line || lineEntry;
  if (!line) return;

  const color = getRoleColor(lineEntry?.role);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.72;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([12, 7]);
  ctx.shadowColor = withAlpha(color, 0.28);
  ctx.shadowBlur = 10;
  ctx.beginPath();

  if (line.tipo === "vertical") {
    const x = viewport.offsetX + Number(line.x) * viewport.scale;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
  }

  if (line.tipo === "horizontal") {
    const y = viewport.offsetY - Number(line.y) * viewport.scale;
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
  }

  ctx.stroke();
  ctx.restore();
}

function drawDefenseTooltip(ctx, entry, viewport) {
  const canvasPoint = toCanvas(entry.point, viewport);
  const [displayX, displayY] = entry.displayPoint || entry.point;
  const text = `${entry.label} (${formatNumber(displayX)}, ${formatNumber(displayY)})`;
  const color = getRoleColor(entry.role);
  const paddingX = 10;
  const height = 30;

  ctx.save();
  ctx.font = "800 13px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "middle";

  const width = ctx.measureText(text).width + paddingX * 2;
  let x = canvasPoint.x + 18;
  let y = canvasPoint.y - 44;

  if (x + width > ctx.canvas.width - 10) x = canvasPoint.x - width - 18;
  if (y < 10) y = canvasPoint.y + 18;

  x = Math.min(Math.max(x, 8), ctx.canvas.width - width - 8);
  y = Math.min(Math.max(y, 8), ctx.canvas.height - height - 8);

  ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
  ctx.strokeStyle = withAlpha(color, 0.42);
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "rgba(15, 23, 42, 0.14)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, x, y, width, height, 8);
  ctx.fill();
  ctx.stroke();

  ctx.shadowColor = "transparent";
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.fillText(text, x + paddingX, y + height / 2);
  ctx.restore();
}

function getRoleColor(role) {
  return ROLE_COLORS[role] || DEFENSE_COLOR;
}

function formatNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return number.toFixed(2);
}

function withAlpha(hexColor, alpha) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
