import { postJson } from "../../shared/api";

const PROCESAR_CONICA_URL = "/api/conicas";

export function processRut(rut) {
  return postJson(PROCESAR_CONICA_URL, { rut });
}
