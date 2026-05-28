export function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function niceStep(rawStep) {
  if (!Number.isFinite(rawStep) || rawStep <= 0) return 1;

  const power = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / power;

  if (normalized <= 1) return power;
  if (normalized <= 2) return 2 * power;
  if (normalized <= 5) return 5 * power;
  return 10 * power;
}

export function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}
