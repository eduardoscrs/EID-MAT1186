import { GRAPH_PADDING, TICKS } from "./constants";

const LABEL_GAP = 24;

function formatAxisValue(value) {
  return Number(value).toFixed(2);
}

function setupTickText(ctx, align) {
  ctx.fillStyle = "#64748b";
  ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = align;
}

function isNearForcedValue(value, forcedValues, threshold) {
  return forcedValues.some((forcedValue) => Math.abs(value - forcedValue) <= threshold);
}

function finiteValuesInRange(values, min, max) {
  return values.filter((value) => Number.isFinite(value) && value >= min && value <= max);
}

function niceStep(rawStep) {
  if (!Number.isFinite(rawStep) || rawStep <= 0) return 1;

  const power = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / power;

  if (normalized <= 1) return power;
  if (normalized <= 2) return 2 * power;
  if (normalized <= 2.5) return 2.5 * power;
  if (normalized <= 5) return 5 * power;
  return 10 * power;
}

function buildAnchoredTicks(min, max, forcedValues) {
  const range = max - min || 1;
  const step = niceStep(range / TICKS);
  const anchor = forcedValues.length ? forcedValues[0] : 0;
  const start = anchor + Math.ceil((min - anchor) / step) * step;
  const ticks = [];

  for (let value = start; value <= max + step * 0.001; value += step) {
    ticks.push(Number(value.toFixed(10)));
  }

  return ticks;
}

function shouldDrawLabel(position, occupiedPositions) {
  return occupiedPositions.every((occupied) => Math.abs(position - occupied) >= LABEL_GAP);
}

export function drawAxes(ctx, width, height, viewport, map, forcedValues = {}) {
  const { minX, maxX, minY, maxY } = viewport;
  const originX = map.x(0);
  const originY = map.y(0);
  const xLabelY = height - GRAPH_PADDING + 22;
  const finiteForcedXValues = finiteValuesInRange(forcedValues.x || [], minX, maxX);
  const finiteForcedYValues = finiteValuesInRange(forcedValues.y || [], minY, maxY);
  const forcedYPositions = finiteForcedYValues.map(map.y);
  const xTicks = buildAnchoredTicks(minX, maxX, finiteForcedXValues);
  const yTicks = buildAnchoredTicks(minY, maxY, finiteForcedYValues);
  const xTickStep = (maxX - minX) / TICKS;
  const forcedThreshold = Math.abs(xTickStep) * 0.2;

  ctx.fillStyle = "#fbfdff";
  ctx.fillRect(GRAPH_PADDING, GRAPH_PADDING, width - GRAPH_PADDING * 2, height - GRAPH_PADDING * 2);

  yTicks.forEach((yVal) => {
    const yPos = map.y(yVal);

    ctx.strokeStyle = "#e5edf5";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(GRAPH_PADDING, yPos);
    ctx.lineTo(width - GRAPH_PADDING, yPos);
    ctx.stroke();

    if (shouldDrawLabel(yPos, forcedYPositions)) {
      setupTickText(ctx, "right");
      ctx.fillText(formatAxisValue(yVal), GRAPH_PADDING - 15, yPos + 4);
      ctx.textAlign = "left";
    }
  });

  xTicks.forEach((xVal) => {
    const xPos = map.x(xVal);

    ctx.strokeStyle = "#e5edf5";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xPos, GRAPH_PADDING);
    ctx.lineTo(xPos, height - GRAPH_PADDING);
    ctx.stroke();

    if (!isNearForcedValue(xVal, finiteForcedXValues, forcedThreshold)) {
      setupTickText(ctx, "center");
      ctx.fillText(formatAxisValue(xVal), xPos, xLabelY);
    }
    ctx.textAlign = "left";
  });

  finiteForcedXValues.forEach((xValue) => {
    const xPos = map.x(xValue);
    if (xPos < GRAPH_PADDING || xPos > width - GRAPH_PADDING) return;

    setupTickText(ctx, "center");
    ctx.fillText(formatAxisValue(xValue), xPos, xLabelY);
    ctx.textAlign = "left";
  });

  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(GRAPH_PADDING, originY);
  ctx.lineTo(width - GRAPH_PADDING, originY);
  ctx.moveTo(originX, GRAPH_PADDING);
  ctx.lineTo(originX, height - GRAPH_PADDING);
  ctx.stroke();

  drawAxisArrowheads(ctx, width, originX, originY);

  ctx.font = "700 14px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("x", width - GRAPH_PADDING - 28, originY + 20);
  ctx.fillText("y", originX + 12, GRAPH_PADDING - 15);
  ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("O", originX - 14, originY + 20);
}

function drawAxisArrowheads(ctx, width, originX, originY) {
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.moveTo(width - GRAPH_PADDING, originY);
  ctx.lineTo(width - GRAPH_PADDING - 8, originY - 6);
  ctx.lineTo(width - GRAPH_PADDING - 8, originY + 6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(originX, GRAPH_PADDING);
  ctx.lineTo(originX - 6, GRAPH_PADDING + 8);
  ctx.lineTo(originX + 6, GRAPH_PADDING + 8);
  ctx.closePath();
  ctx.fill();
}
