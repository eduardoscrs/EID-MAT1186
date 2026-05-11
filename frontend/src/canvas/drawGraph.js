const GRAPH_SCALE = 28;

function drawGrid(ctx, width, height, scale) {
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#dbeafe";
  ctx.lineWidth = 1;

  for (let x = centerX % scale; x <= width; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = centerY % scale; y <= height; y += scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#1e3a8a";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
}

function drawPath(ctx, points, width, height, scale) {
  if (!points?.x?.length || !points?.y?.length) return;

  const centerX = width / 2;
  const centerY = height / 2;

  ctx.beginPath();
  points.x.forEach((xValue, index) => {
    const x = centerX + xValue * scale;
    const y = centerY - points.y[index] * scale;

    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawFallbackCircle(ctx, width, height) {
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 82, 0, Math.PI * 2);
  ctx.stroke();
}

function drawConicPaths(ctx, data, width, height, scale) {
  const tipo = data.tipo_conica;
  const puntos = data.puntos_grafica;

  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 3;

  if (tipo === "Circunferencia" || tipo === "Elipse" || tipo === "Parabola") {
    drawPath(ctx, { x: puntos.x, y: puntos.y_pos }, width, height, scale);
    drawPath(ctx, { x: puntos.x, y: puntos.y_neg }, width, height, scale);
  }

  if (tipo === "Hiperbola") {
    drawPath(ctx, puntos.rama_izq, width, height, scale);
    drawPath(ctx, puntos.rama_izq ? { x: puntos.rama_izq.x, y: puntos.rama_izq.y_neg } : null, width, height, scale);
    drawPath(ctx, puntos.rama_der, width, height, scale);
    drawPath(ctx, puntos.rama_der ? { x: puntos.rama_der.x, y: puntos.rama_der.y_neg } : null, width, height, scale);
  }
}

function drawReferencePoint(ctx, data, width, height, scale) {
  const point = data.tipo_conica === "Parabola" ? data.vertice : data.centro;
  if (!point) return;

  const centerX = width / 2;
  const centerY = height / 2;

  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.arc(centerX + point[0] * scale, centerY - point[1] * scale, 5, 0, Math.PI * 2);
  ctx.fill();
}

export function drawGraph(ctx, data, width, height) {
  drawGrid(ctx, width, height, GRAPH_SCALE);

  if (!data?.puntos_grafica) {
    drawFallbackCircle(ctx, width, height);
    return;
  }

  drawConicPaths(ctx, data, width, height, GRAPH_SCALE);
  drawReferencePoint(ctx, data, width, height, GRAPH_SCALE);
}
