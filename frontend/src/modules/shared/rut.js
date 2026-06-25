export const EMPTY_RUT_DIGITS = ["_", "_", "_", "_", "_", "_", "_", "_", "_"];

export function cleanRutInput(value) {
  return String(value || "")
    .replace(/[^0-9kK]/g, "")
    .toUpperCase();
}

export function formatRutInput(value) {
  const cleaned = cleanRutInput(value).slice(0, 9);

  if (!cleaned) return "";
  if (cleaned.length === 1) return `-${cleaned}`;

  return `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`;
}

export function getRutDigits(value) {
  return cleanRutInput(value).split("");
}

export function getRutKey(validarData, fallbackRut) {
  const rutFromParts =
    validarData?.cuerpo && validarData?.digito_verificador
      ? `${validarData.cuerpo}${validarData.digito_verificador}`
      : "";

  return cleanRutInput(validarData?.rut_limpio || rutFromParts || fallbackRut);
}

export function getRutValidationState(validation) {
  if (!validation) return { label: "Sin validar", className: "text-slate-600", badge: "--" };
  if (validation.valido) return { label: "RUT válido", className: "text-emerald-700", badge: "OK" };
  return { label: "RUT inválido", className: "text-rose-700", badge: "Revisar" };
}
