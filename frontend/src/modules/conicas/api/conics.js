import { postJson } from "../../shared/api";

const VALIDAR_RUT_URL = "/api/validar_rut";
const PROCESAR_CONICA_URL = "/api/procesar";

export function validateRut(rut) {
  return postJson(VALIDAR_RUT_URL, { rut });
}

export function processRut({ cuerpo, digito_verificador }) {
  return postJson(PROCESAR_CONICA_URL, { cuerpo, digito_verificador });
}
