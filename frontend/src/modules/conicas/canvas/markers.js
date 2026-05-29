import { collectKeyPoints } from "./collectors";
import { drawLabel } from "./labels";
import { toCanvas } from "./viewport";

export function drawKeyPoints(ctx, data, viewport) {
  const keyPoints = collectKeyPoints(data);

  ctx.save();
  ctx.font = "600 12px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "middle";

  const canvasPoints = keyPoints.map((item) => ({
    ...item,
    point: toCanvas(item.value, viewport),
  }));

  canvasPoints.forEach(({ point, color }) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  canvasPoints.forEach(({ label, color, point }) => {
    const labelPosition = getLabelPosition(label, point);
    drawLabel(ctx, label, labelPosition.x, labelPosition.y, color, labelPosition.options);
  });

  ctx.restore();
}

function getLabelPosition(label, point) {
  if (label === "Centro") {
    return {
      x: point.x + 28,
      y: point.y - 30,
      options: { anchorY: "center" },
    };
  }

  if (label === "F1") {
    return {
      x: point.x - 24,
      y: point.y + 18,
      options: { anchorX: "right", anchorY: "center" },
    };
  }

  if (label === "F2") {
    return {
      x: point.x - 24,
      y: point.y - 18,
      options: { anchorX: "right", anchorY: "center" },
    };
  }

  if (label === "Foco" || label.startsWith("F")) {
    return {
      x: point.x - 22,
      y: point.y,
      options: { anchorX: "right", anchorY: "center" },
    };
  }

  if (label === "V1") {
    return {
      x: point.x + 24,
      y: point.y + 18,
      options: { anchorY: "center" },
    };
  }

  if (label === "V2") {
    return {
      x: point.x + 24,
      y: point.y - 18,
      options: { anchorY: "center" },
    };
  }

  if (label === "Vértice" || label.startsWith("V")) {
    return {
      x: point.x + 22,
      y: point.y,
      options: { anchorY: "center" },
    };
  }

  if (label === "B1") {
    return {
      x: point.x - 20,
      y: point.y,
      options: { anchorX: "right", anchorY: "center" },
    };
  }

  if (label === "B2") {
    return {
      x: point.x + 20,
      y: point.y,
      options: { anchorY: "center" },
    };
  }

  return {
    x: point.x + 10,
    y: point.y - 12,
    options: {},
  };
}
