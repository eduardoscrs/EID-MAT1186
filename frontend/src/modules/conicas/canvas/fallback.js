import { COLORS } from "./constants";
import { roundRect } from "./utils";

export function drawFallbackCircle(ctx, width, height) {
  ctx.strokeStyle = COLORS.curve;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 82, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawNoRealGraphMessage(ctx, data, width, height) {
  const message = data?.observacion || "La cónica no tiene gráfica real.";
  const boxWidth = Math.min(width - 80, 520);
  const boxHeight = 86;
  const x = (width - boxWidth) / 2;
  const y = (height - boxHeight) / 2;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.strokeStyle = "rgba(220, 38, 38, 0.35)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, boxWidth, boxHeight, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = COLORS.directrix;
  ctx.font = "700 16px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Sin gráfica real", width / 2, y + 30);

  ctx.fillStyle = COLORS.text;
  ctx.font = "500 13px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(message, width / 2, y + 56);
  ctx.restore();
}
