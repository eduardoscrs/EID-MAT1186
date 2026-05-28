export function drawOpenCircle(ctx, map, x, y, color = "#111827") {
  const radius = 9;

  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(map.x(x), map.y(y), radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(map.x(x), map.y(y), radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export function drawClosedCircle(ctx, map, x, y, color = "#111827") {
  const radius = 8;

  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(map.x(x), map.y(y), radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(map.x(x), map.y(y), radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}
