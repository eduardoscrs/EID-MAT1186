async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || "No se pudo completar la solicitud.");
  }

  return data;
}

export function validateRut(rut) {
  return postJson("/api/validar_rut", { rut });
}

export function processRut({ cuerpo, digito_verificador }) {
  return postJson("/api/procesar", { cuerpo, digito_verificador });
}
