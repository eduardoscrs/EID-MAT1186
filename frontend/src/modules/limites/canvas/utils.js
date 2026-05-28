import { VALUE_CLAMP } from "./constants";

export function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function normalizeY(value) {
  if (value === null || value === undefined) return null;

  let n = Number(value);
  if (!Number.isFinite(n)) return n;
  if (n > VALUE_CLAMP) n = VALUE_CLAMP;
  if (n < -VALUE_CLAMP) n = -VALUE_CLAMP;

  return n;
}
