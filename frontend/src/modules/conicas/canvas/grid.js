import { COLORS } from "./constants";
import { niceStep } from "./utils";

export function drawBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, COLORS.backgroundTop);
  gradient.addColorStop(1, COLORS.backgroundBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export function drawGrid(ctx, width, height, viewport) {
  const step = niceStep((width / viewport.scale) / 10);
  const minorStep = step / 2;

  ctx.save();
  ctx.lineCap = "square";
  ctx.font = "12px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  drawGridLines(ctx, width, height, viewport, minorStep, COLORS.gridMinor, 1);
  drawGridLines(ctx, width, height, viewport, step, COLORS.gridMajor, 1.25, true);
  drawAxes(ctx, width, height, viewport, step);

  ctx.restore();
}

function drawGridLines(ctx, width, height, viewport, step, color, lineWidth, showLabels = false) {
  const startX = Math.floor(viewport.minX / step) * step;
  const endX = Math.ceil(viewport.maxX / step) * step;
  const startY = Math.floor(viewport.minY / step) * step;
  const endY = Math.ceil(viewport.maxY / step) * step;

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  for (let value = startX; value <= endX; value += step) {
    const x = viewport.offsetX + value * viewport.scale;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();

    if (showLabels && Math.abs(value) > step / 1000 && x > 22 && x < width - 22) {
      ctx.fillText(formatTick(value), x, height - 24);
    }
  }

  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let value = startY; value <= endY; value += step) {
    const y = viewport.offsetY - value * viewport.scale;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();

    if (showLabels && Math.abs(value) > step / 1000 && y > 20 && y < height - 20) {
      ctx.fillText(formatTick(value), 42, y);
    }
  }
}

function drawAxes(ctx, width, height, viewport, step) {
  const axisX = viewport.offsetX;
  const axisY = viewport.offsetY;

  ctx.strokeStyle = COLORS.axis;
  ctx.lineWidth = 2;

  if (axisX >= 0 && axisX <= width) {
    ctx.beginPath();
    ctx.moveTo(axisX, 0);
    ctx.lineTo(axisX, height);
    ctx.stroke();
  }

  if (axisY >= 0 && axisY <= height) {
    ctx.beginPath();
    ctx.moveTo(0, axisY);
    ctx.lineTo(width, axisY);
    ctx.stroke();
  }

  ctx.fillStyle = COLORS.axis;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("x", width - 24, Math.min(Math.max(axisY + 8, 12), height - 24));
  ctx.fillText("y", Math.min(Math.max(axisX + 8, 12), width - 24), 14);

  if (axisX >= 0 && axisX <= width && axisY >= 0 && axisY <= height) {
    ctx.fillStyle = COLORS.axisSoft;
    ctx.textAlign = "left";
    ctx.fillText("0", axisX + 7, axisY + 7);
  }

  ctx.fillStyle = COLORS.text;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(`1 cuadricula = ${formatTick(step)} u`, width - 18, 24);
}

function formatTick(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
