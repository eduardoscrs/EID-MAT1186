export function getRemovabilityLabel(kind) {
  if (kind === "continua") return "Sin discontinuidad";
  if (kind === "removible") return "Removible";
  if (kind) return "Irremovible";
  return "--";
}

export function getRemovabilityKind(kind) {
  if (kind === "continua") return "continua";
  if (kind === "removible") return "removible";
  if (kind) return "irremovible";
  return null;
}
