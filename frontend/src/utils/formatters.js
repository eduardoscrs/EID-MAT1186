export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Number(value).toFixed(2);
}

export function formatPoint(point) {
  if (!point?.length) return "--";
  return `(${formatNumber(point[0])}, ${formatNumber(point[1])})`;
}

export function formatPointList(points) {
  if (!points?.length) return "--";
  return points.map(formatPoint).join("  ");
}

export function formatLine(line) {
  return line?.ecuacion || "--";
}
