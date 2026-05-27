import { postJson } from "../../shared/api";

const PROCESAR_LIMITES_URL = "/api/limites";

export function processLimits(rut) {
  return postJson(PROCESAR_LIMITES_URL, { rut });
}
