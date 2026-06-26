const LONG_DECIMAL_PATTERN = /(?<![A-Za-z0-9_])[-+]?\d+\.\d{3,}(?![A-Za-z0-9_])/g;

export function formatDisplayNumber(value, maxDecimals = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value ?? "--");
  return number.toFixed(maxDecimals);
}

export function formatDisplayValue(value, maxDecimals = 2) {
  if (value === null || value === undefined || value === "") return "--";
  const text = String(value);

  if (/^[+-]?\d+(?:\.\d+)?$/.test(text.trim())) {
    return formatDisplayNumber(text, maxDecimals);
  }

  return roundDecimalText(text, maxDecimals);
}

export function roundDecimalText(value, maxDecimals = 2) {
  return String(value ?? "").replace(LONG_DECIMAL_PATTERN, (match) => {
    const number = Number(match);
    return Number.isFinite(number) ? number.toFixed(maxDecimals) : match;
  });
}
