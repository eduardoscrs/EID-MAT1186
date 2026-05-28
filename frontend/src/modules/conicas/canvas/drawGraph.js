const PADDING = 56;
const MAX_SCALE = 58;
const MIN_SCALE = 12;

const COLORS = {
  backgroundTop: "#f8fafc",
  backgroundBottom: "#eef6ff",
  gridMinor: "#e6edf5",
  gridMajor: "#cbd8e8",
  axis: "#334155",
  axisSoft: "#94a3b8",
  curve: "#0f766e",
  curveGlow: "rgba(20, 184, 166, 0.2)",
  center: "#e11d48",
  vertex: "#7c3aed",
  focus: "#f59e0b",
  directrix: "#dc2626",
  symmetry: "#2563eb",
  latus: "#ea580c",
  asymptote: "#64748b",
  axisMajor: "#7c3aed",
  axisMinor: "#0891b2",
  text: "#334155",
  labelBg: "rgba(255, 255, 255, 0.86)",
};

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function collectPathPoints(path) {
  if (!path?.x?.length || !path?.y?.length) return [];

  return path.x.reduce((points, x, index) => {
    const y = path.y[index];
    if (finiteNumber(x) && finiteNumber(y)) points.push([x, y]);
    return points;
  }, []);
}

function collectGraphPoints(data) {
  const puntos = data?.puntos_grafica;
  if (!puntos) return [];

  const points = [];

  if (puntos.x) {
    points.push(...collectPathPoints({ x: puntos.x, y: puntos.y_pos }));
    points.push(...collectPathPoints({ x: puntos.x, y: puntos.y_neg }));
  }

  if (puntos.rama_izq) {
    points.push(...collectPathPoints({ x: puntos.rama_izq.x, y: puntos.rama_izq.y }));
    points.push(...collectPathPoints({ x: puntos.rama_izq.x, y: puntos.rama_izq.y_neg }));
  }

  if (puntos.rama_der) {
    points.push(...collectPathPoints({ x: puntos.rama_der.x, y: puntos.rama_der.y }));
    points.push(...collectPathPoints({ x: puntos.rama_der.x, y: puntos.rama_der.y_neg }));
  }

  return points;
}

function getKeyPoints(data) {
  const points = [];

  if (data?.centro) points.push({ label: "Centro", value: data.centro, color: COLORS.center });
  if (data?.vertice) points.push({ label: "Vértice", value: data.vertice, color: COLORS.vertex });
  if (Array.isArray(data?.vertices)) {
    data.vertices.forEach((value, index) => points.push({ label: `V${index + 1}`, value, color: COLORS.vertex }));
  }
  if (Array.isArray(data?.covertices)) {
    data.covertices.forEach((value, index) => points.push({ label: `B${index + 1}`, value, color: COLORS.axisMinor }));
  }
  if (Array.isArray(data?.extremos_conjugados)) {
    data.extremos_conjugados.forEach((value, index) => points.push({ label: `B${index + 1}`, value, color: COLORS.axisMinor }));
  }
  if (Array.isArray(data?.extremos_lado_recto)) {
    data.extremos_lado_recto.forEach((value, index) => points.push({ label: `LR${index + 1}`, value, color: COLORS.latus }));
  }
  if (Array.isArray(data?.focos)) {
    data.focos.forEach((value, index) => points.push({ label: `F${index + 1}`, value, color: COLORS.focus }));
  } else if (data?.foco) {
    points.push({ label: "Foco", value: data.foco, color: COLORS.focus });
  }

  return points.filter(({ value }) => finiteNumber(value?.[0]) && finiteNumber(value?.[1]));
}

function niceStep(rawStep) {
  if (!Number.isFinite(rawStep) || rawStep <= 0) return 1;

  const power = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / power;

  if (normalized <= 1) return power;
  if (normalized <= 2) return 2 * power;
  if (normalized <= 5) return 5 * power;
  return 10 * power;
}

function calculateViewport(data, width, height) {
  const graphPoints = collectGraphPoints(data);
  const keyPoints = getKeyPoints(data).map(({ value }) => value);
  const allPoints = [...graphPoints, ...keyPoints];

  if (!allPoints.length) {
    return {
      scale: 32,
      minX: -10,
      maxX: 10,
      minY: -6,
      maxY: 6,
      offsetX: width / 2,
      offsetY: height / 2,
    };
  }

  let minX = Math.min(...allPoints.map(([x]) => x));
  let maxX = Math.max(...allPoints.map(([x]) => x));
  let minY = Math.min(...allPoints.map(([, y]) => y));
  let maxY = Math.max(...allPoints.map(([, y]) => y));

  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const marginX = Math.max(spanX * 0.16, 1);
  const marginY = Math.max(spanY * 0.16, 1);

  minX -= marginX;
  maxX += marginX;
  minY -= marginY;
  maxY += marginY;

  const scale = Math.max(
    MIN_SCALE,
    Math.min(MAX_SCALE, (width - PADDING * 2) / (maxX - minX), (height - PADDING * 2) / (maxY - minY)),
  );

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  return {
    scale,
    minX,
    maxX,
    minY,
    maxY,
    offsetX: width / 2 - midX * scale,
    offsetY: height / 2 + midY * scale,
  };
}

function toCanvas(point, viewport) {
  return {
    x: viewport.offsetX + point[0] * viewport.scale,
    y: viewport.offsetY - point[1] * viewport.scale,
  };
}

function drawBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, COLORS.backgroundTop);
  gradient.addColorStop(1, COLORS.backgroundBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawGrid(ctx, width, height, viewport) {
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
  ctx.fillText(`1 cuadrícula = ${formatTick(step)} u`, width - 18, 24);
}

function formatTick(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function drawPath(ctx, points, viewport) {
  const canvasPoints = collectPathPoints(points).map((point) => toCanvas(point, viewport));
  if (canvasPoints.length < 2) return;

  ctx.beginPath();
  canvasPoints.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
}

function drawFallbackCircle(ctx, width, height) {
  ctx.strokeStyle = COLORS.curve;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 82, 0, Math.PI * 2);
  ctx.stroke();
}

function drawNoRealGraphMessage(ctx, data, width, height) {
  const message = data?.observacion || "La conica no tiene grafica real.";
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
  ctx.fillText("Sin grafica real", width / 2, y + 30);

  ctx.fillStyle = COLORS.text;
  ctx.font = "500 13px Inter, ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(message, width / 2, y + 56);
  ctx.restore();
}

function drawConicPaths(ctx, data, viewport) {
  const tipo = data.tipo_conica;
  const puntos = data.puntos_grafica;

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.strokeStyle = COLORS.curveGlow;
  ctx.lineWidth = 10;
  drawAllConicPaths(ctx, tipo, puntos, viewport);

  ctx.strokeStyle = COLORS.curve;
  ctx.lineWidth = 3.5;
  drawAllConicPaths(ctx, tipo, puntos, viewport);

  ctx.restore();
}

function drawComponentLines(ctx, data, viewport) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (data.tipo_conica === "Parabola") {
    drawLineObject(ctx, data.eje_simetria, viewport, COLORS.symmetry, [10, 8], "Eje");
    drawLineObject(ctx, data.directriz_recta, viewport, COLORS.directrix, [7, 7], "Directriz");
    drawSegment(ctx, data.extremos_lado_recto, viewport, COLORS.latus, 3, "Lado recto");
  }

  if (data.tipo_conica === "Elipse") {
    drawSegment(ctx, data.vertices, viewport, COLORS.axisMajor, 2.5, "Eje mayor");
    drawSegment(ctx, data.covertices, viewport, COLORS.axisMinor, 2.5, "Eje menor");
  }

  if (data.tipo_conica === "Hiperbola") {
    data.asintotas?.forEach((line, index) => {
      drawObliqueLine(ctx, line, viewport, COLORS.asymptote, [9, 7], `Asíntota ${index + 1}`);
    });
    drawSegment(ctx, data.vertices, viewport, COLORS.axisMajor, 2.5, "Eje real");
    drawSegment(ctx, data.extremos_conjugados, viewport, COLORS.axisMinor, 2.5, "Eje conj.");
  }

  ctx.restore();
}

function drawLineObject(ctx, line, viewport, color, dash, label) {
  if (!line) return;
  if (line.tipo === "vertical") {
    const x = viewport.offsetX + line.x * viewport.scale;
    drawCanvasLine(ctx, x, 0, x, ctx.canvas.height, color, dash);
    drawLabel(ctx, label, x + 8, 16, color);
  }
  if (line.tipo === "horizontal") {
    const y = viewport.offsetY - line.y * viewport.scale;
    drawCanvasLine(ctx, 0, y, ctx.canvas.width, y, color, dash);
    drawLabel(ctx, label, ctx.canvas.width - 94, y + 8, color);
  }
}

function drawObliqueLine(ctx, line, viewport, color, dash, label) {
  if (!line || !finiteNumber(line.m)) return;

  const x1Value = viewport.minX;
  const x2Value = viewport.maxX;
  const y1Value = line.k + line.m * (x1Value - line.h);
  const y2Value = line.k + line.m * (x2Value - line.h);
  const point1 = toCanvas([x1Value, y1Value], viewport);
  const point2 = toCanvas([x2Value, y2Value], viewport);

  drawCanvasLine(ctx, point1.x, point1.y, point2.x, point2.y, color, dash);
  const labelPoint = toCanvas([viewport.maxX - (viewport.maxX - viewport.minX) * 0.22, y2Value], viewport);
  drawLabel(ctx, label, Math.min(labelPoint.x, ctx.canvas.width - 110), Math.max(labelPoint.y, 12), color);
}

function drawSegment(ctx, points, viewport, color, lineWidth = 2, label) {
  if (!points?.[0] || !points?.[1]) return;

  const start = toCanvas(points[0], viewport);
  const end = toCanvas(points[1], viewport);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.restore();

  if (label) {
    drawLabel(ctx, label, (start.x + end.x) / 2 + 10, (start.y + end.y) / 2 + 10, color);
  }
}

function drawCanvasLine(ctx, x1, y1, x2, y2, color, dash) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawAllConicPaths(ctx, tipo, puntos, viewport) {
  if (tipo === "Circunferencia" || tipo === "Elipse" || tipo === "Parabola") {
    drawPath(ctx, { x: puntos.x, y: puntos.y_pos }, viewport);
    drawPath(ctx, { x: puntos.x, y: puntos.y_neg }, viewport);
  }

  if (tipo === "Hiperbola") {
    drawPath(ctx, puntos.rama_izq, viewport);
    drawPath(ctx, puntos.rama_izq ? { x: puntos.rama_izq.x, y: puntos.rama_izq.y_neg } : null, viewport);
    drawPath(ctx, puntos.rama_der, viewport);
    drawPath(ctx, puntos.rama_der ? { x: puntos.rama_der.x, y: puntos.rama_der.y_neg } : null, viewport);
  }
}

function drawKeyPoints(ctx, data, viewport) {
  const keyPoints = getKeyPoints(data);

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

function drawLabel(ctx, text, x, y, color) {
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

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

export function drawGraph(ctx, data, width, height) {
  const viewport = calculateViewport(data, width, height);

  drawBackground(ctx, width, height);
  drawGrid(ctx, width, height, viewport);

  if (data && data.tiene_grafica_real === false) {
    drawNoRealGraphMessage(ctx, data, width, height);
    return;
  }

  if (!data?.puntos_grafica) {
    drawFallbackCircle(ctx, width, height);
    return;
  }

  drawComponentLines(ctx, data, viewport);
  drawConicPaths(ctx, data, viewport);
  drawKeyPoints(ctx, data, viewport);
}
