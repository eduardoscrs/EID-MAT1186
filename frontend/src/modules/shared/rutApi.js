import { postJson } from "./api";

const VALIDAR_RUT_URL = "/api/validar_rut";

export function validateRut(rut) {
  return postJson(VALIDAR_RUT_URL, { rut });
}
