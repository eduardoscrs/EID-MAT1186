import { GRAPH_PADDING, TICKS } from "./constants";

export function drawAxes(ctx, width, height, viewport, map) {
  const { minX, maxX, minY, maxY } = viewport;
  const originX = map.x(0);
  const originY = map.y(0);

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(GRAPH_PADDING, GRAPH_PADDING, width - GRAPH_PADDING * 2, height - GRAPH_PADDING * 2);

  for (let i = 0; i <= TICKS; i++) {
    const yVal = minY + (maxY - minY) * (i / TICKS);
    const yPos = map.y(yVal);

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(GRAPH_PADDING, yPos);
    ctx.lineTo(width - GRAPH_PADDING, yPos);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.font = "11px Arial";
    ctx.textAlign = "right";
    ctx.fillText(yVal.toFixed(2), GRAPH_PADDING - 15, yPos + 4);
    ctx.textAlign = "left";
  }

  for (let i = 0; i <= TICKS; i++) {
    const xVal = minX + (maxX - minX) * (i / TICKS);
    const xPos = map.x(xVal);

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xPos, GRAPH_PADDING);
    ctx.lineTo(xPos, height - GRAPH_PADDING);
    ctx.stroke();
  }

  ctx.strokeStyle = "#1f2937";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(GRAPH_PADDING, originY);
  ctx.lineTo(width - GRAPH_PADDING, originY);
  ctx.moveTo(originX, GRAPH_PADDING);
  ctx.lineTo(originX, height - GRAPH_PADDING);
  ctx.stroke();

  drawAxisArrowheads(ctx, width, originX, originY);

  ctx.font = "bold 14px Arial";
  ctx.fillText("x", width - GRAPH_PADDING - 28, originY + 20);
  ctx.fillText("y", originX + 12, GRAPH_PADDING - 15);
  ctx.font = "11px Arial";
  ctx.fillText("O", originX - 14, originY + 20);
}

function drawAxisArrowheads(ctx, width, originX, originY) {
  ctx.fillStyle = "#1f2937";
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
