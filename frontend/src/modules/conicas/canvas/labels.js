import { COLORS } from "./constants";
import { roundRect } from "./utils";

export function drawLabel(ctx, text, x, y, color, options = {}) {
  const paddingX = 8;
  const height = 24;

  ctx.save();
  ctx.font = "700 12px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "middle";

  const metrics = ctx.measureText(text);
  const width = metrics.width + paddingX * 2;
  let labelX = x;
  let labelY = y;

  if (options.anchorX === "right") labelX = x - width;
  if (options.anchorX === "center") labelX = x - width / 2;
  if (options.anchorY === "center") labelY = y - height / 2;

  labelX = Math.min(Math.max(labelX, 4), ctx.canvas.width - width - 4);
  labelY = Math.min(Math.max(labelY, 4), ctx.canvas.height - height - 4);

  ctx.fillStyle = COLORS.labelBg;
  ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
  ctx.lineWidth = 1;
  roundRect(ctx, labelX, labelY, width, height, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.fillText(text, labelX + paddingX, labelY + height / 2);
  ctx.restore();
}
