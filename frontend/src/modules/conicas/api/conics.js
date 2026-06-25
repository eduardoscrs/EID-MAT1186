import { postJson } from "../../shared/api";

const VALIDAR_RUT_URL = "/api/validar_rut";
const PROCESAR_CONICA_URL = "/api/conicas";

export function validateRut(rut) {
  return postJson(VALIDAR_RUT_URL, { rut });
}

export function processRut(rut) {
  return postJson(PROCESAR_CONICA_URL, { rut });
}
