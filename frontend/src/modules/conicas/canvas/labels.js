import { COLORS } from "./constants";
import { roundRect } from "./utils";

export function drawLabel(ctx, text, x, y, color) {
  const metrics = ctx.measureText(text);
  const width = metrics.width + 14;
  const height = 22;

  ctx.fillStyle = COLORS.labelBg;
  ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, width, height, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.fillText(text, x + 7, y + height / 2);
}
