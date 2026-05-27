export function normalizeConicName(name) {
  const plainName = name?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (plainName?.includes("Circunferencia")) return "Circunferencia";
  if (plainName?.includes("Elipse")) return "Elipse";
  if (plainName?.includes("Par")) return "Parabola";
  if (plainName?.includes("Hip")) return "Hiperbola";

  return plainName;
}
