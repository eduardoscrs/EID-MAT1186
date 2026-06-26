export const initialMessage = "Ingresa un RUT chileno válido para construir y graficar la cónica.";

export const classificationItems = [
  { icon: "C", name: "Circunferencia", keys: ["Circunferencia"], hint: "radio constante" },
  { icon: "E", name: "Elipse", keys: ["Elipse"], hint: "dos focos internos" },
  { icon: "P", name: "Parábola", keys: ["Parabola"], hint: "foco y directriz" },
  { icon: "H", name: "Hipérbola", keys: ["Hiperbola"], hint: "dos ramas" },
];

export const conicExampleRuts = [
  { rut: "11231420-2", label: "Circunferencia", detail: "caso removible" },
  { rut: "12314664-6", label: "Elipse", detail: "caso salto" },
  { rut: "12314568-2", label: "Parábola", detail: "caso infinito" },
  { rut: "12314667-0", label: "Hipérbola", detail: "caso salto" },
];

export const limitExampleRuts = [
  { rut: "11231420-2", label: "Removible", detail: "circunferencia" },
  { rut: "12314664-6", label: "Salto", detail: "elipse" },
  { rut: "12314568-2", label: "Infinita", detail: "parábola" },
];

export const conicDefenseFields = [
  { name: "centro_vertice", label: "Centro o vértice" },
  { name: "vertices", label: "Vértices" },
  { name: "focos", label: "Focos" },
  { name: "eje_principal", label: "Eje mayor o transversal" },
  { name: "eje_secundario", label: "Eje menor o conjugado" },
  { name: "directriz", label: "Directriz" },
  { name: "justificacion", label: "Justificación", type: "textarea" },
];

export const limitDefenseFields = [
  { name: "limite_izquierdo", label: "Límite izquierdo" },
  { name: "limite_derecho", label: "Límite derecho" },
  { name: "existe_limite", label: "Existe el límite" },
  { name: "valor_en_a", label: "Valor de la función en a" },
  { name: "continuidad", label: "Continuidad" },
  { name: "tipo_discontinuidad", label: "Removible o irremovible" },
  { name: "justificacion", label: "Justificación escrita", type: "textarea" },
];
