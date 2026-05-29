export const initialMessage = "Ingresa un RUT chileno valido para construir y graficar la conica.";

export const classificationItems = [
  { icon: "o", name: "Circunferencia", keys: ["Circunferencia"] },
  { icon: "E", name: "Elipse", keys: ["Elipse"] },
  { icon: "P", name: "Parabola", keys: ["Parabola"] },
  { icon: "H", name: "Hiperbola", keys: ["Hiperbola"] },
];

export const conicDefenseFields = [
  { name: "centro_vertice", label: "Centro o vertice" },
  { name: "vertices", label: "Vertices" },
  { name: "focos", label: "Focos" },
  { name: "eje_principal", label: "Eje mayor o transversal" },
  { name: "eje_secundario", label: "Eje menor o conjugado" },
  { name: "directriz", label: "Directriz" },
  { name: "justificacion", label: "Justificacion", type: "textarea" },
];

export const limitDefenseFields = [
  { name: "limite_izquierdo", label: "Limite izquierdo" },
  { name: "limite_derecho", label: "Limite derecho" },
  { name: "existe_limite", label: "Existe el limite" },
  { name: "valor_en_a", label: "Valor de la funcion en a" },
  { name: "continuidad", label: "Continuidad" },
  { name: "tipo_discontinuidad", label: "Tipo de discontinuidad" },
  { name: "justificacion", label: "Justificacion escrita", type: "textarea" },
];
