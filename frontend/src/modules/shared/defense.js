export function closeTo(valueA, valueB, tolerance) {
  const numericA = Number(valueA);
  const numericB = Number(valueB);

  return Number.isFinite(numericA) && Number.isFinite(numericB) && Math.abs(numericA - numericB) <= tolerance;
}

export function normalizeAnswerText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function parseDecimal(value) {
  return Number(String(value).replace(",", "."));
}

export function validateMinimumTextLength(
  value,
  minimumLength,
  successMessage = "Respuesta registrada.",
  failureMessage = "Escribe una justificación más completa.",
) {
  if (value.length >= minimumLength) {
    return {
      status: "correct",
      message: successMessage,
    };
  }

  return {
    status: "incorrect",
    message: failureMessage,
  };
}
