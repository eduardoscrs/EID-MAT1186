import { collectKeyPoints } from "./collectors";
import { drawLabel } from "./labels";
import { toCanvas } from "./viewport";

export function drawKeyPoints(ctx, data, viewport) {
  const keyPoints = collectKeyPoints(data);

  ctx.save();
  ctx.font = "600 12px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "middle";

  keyPoints.forEach(({ label, value, color }) => {
    const point = toCanvas(value, viewport);

    ctx.fillStyle = color;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    drawLabel(ctx, label, point.x + 10, point.y - 12, color);
  });

  ctx.restore();
}
