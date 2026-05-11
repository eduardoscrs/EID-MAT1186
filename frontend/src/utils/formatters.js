export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Number(value).toFixed(2);
}

export function formatPoint(point) {
  if (!point?.length) return "--";
  return `(${formatNumber(point[0])}, ${formatNumber(point[1])})`;
}
