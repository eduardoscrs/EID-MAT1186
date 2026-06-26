import { GRAPH_PADDING, TICKS } from "./constants";

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

export function drawAxes(ctx, width, height, viewport, map, forcedXValues = []) {
  const { minX, maxX, minY, maxY } = viewport;
  const originX = map.x(0);
  const originY = map.y(0);
  const xLabelY = height - GRAPH_PADDING + 22;
  const finiteForcedXValues = forcedXValues.filter(Number.isFinite);
  const xTickStep = (maxX - minX) / TICKS;
  const forcedThreshold = Math.abs(xTickStep) * 0.2;

  ctx.fillStyle = "#fbfdff";
  ctx.fillRect(GRAPH_PADDING, GRAPH_PADDING, width - GRAPH_PADDING * 2, height - GRAPH_PADDING * 2);

  for (let i = 0; i <= TICKS; i++) {
    const yVal = minY + (maxY - minY) * (i / TICKS);
    const yPos = map.y(yVal);

    ctx.strokeStyle = "#e5edf5";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(GRAPH_PADDING, yPos);
    ctx.lineTo(width - GRAPH_PADDING, yPos);
    ctx.stroke();

    setupTickText(ctx, "right");
    ctx.fillText(formatAxisValue(yVal), GRAPH_PADDING - 15, yPos + 4);
    ctx.textAlign = "left";
  }

  for (let i = 0; i <= TICKS; i++) {
    const xVal = minX + (maxX - minX) * (i / TICKS);
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
  }

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
