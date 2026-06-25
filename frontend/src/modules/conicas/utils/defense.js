import {
  closeTo as isCloseTo,
  normalizeAnswerText,
  parseDecimal,
  validateMinimumTextLength,
} from "../../shared/defense";

const POINT_TOLERANCE = 0.06;

export function validateConicDefenseField(result, fieldName, rawValue) {
  const value = String(rawValue || "").trim();

  if (!result) {
    return {
      status: "incorrect",
      message: "Calcula una cónica antes de validar este campo.",
    };
  }

  if (fieldName === "justificacion") {
    return validateJustification(value);
  }

  const expected = getExpectedEntry(result, fieldName);

  if (!expected) {
    return validateNotApplicable(value);
  }

  if (expected.kind === "points") {
    return validatePointAnswer(value, expected.points);
  }

  if (expected.kind === "line") {
    return validateLineAnswer(value, expected.line);
  }

  return {
    status: "incorrect",
    message: "Este campo no tiene una validación definida.",
  };
}

export function buildConicDefenseOverlay(result, checks, values = {}) {
  if (!result || !checks) return { points: [], lines: [] };

  const overlay = { points: [], lines: [] };

  Object.entries(checks).forEach(([fieldName, check]) => {
    if (check?.status !== "correct") return;

    const expected = getExpectedEntry(result, fieldName);
    if (!expected) return;

    if (expected.kind === "points") {
      const displayPoints = matchDisplayPoints(expected.points, values[fieldName]);

      expected.points.forEach((point, index) => {
        overlay.points.push({
          id: `${fieldName}-${index}`,
          displayPoint: displayPoints[index] || point,
          fieldName,
          label: getPointLabel(result, fieldName, index, expected.points.length),
          point,
          role: getPointRole(result, fieldName),
        });
      });
    }

    if (expected.kind === "line") {
      overlay.lines.push({ fieldName, line: expected.line, role: getLineRole(fieldName) });
    }
  });

  return overlay;
}

function matchDisplayPoints(expectedPoints, rawValue) {
  const answerPoints = parsePoints(rawValue);
  const used = new Set();

  return expectedPoints.map((expectedPoint) => {
    const matchIndex = answerPoints.findIndex((answerPoint, index) => {
      return !used.has(index) && samePoint(answerPoint, expectedPoint);
    });

    if (matchIndex === -1) return expectedPoint;
    used.add(matchIndex);
    return answerPoints[matchIndex];
  });
}

function getPointLabel(result, fieldName, index, total) {
  if (fieldName === "centro_vertice") return result.centro ? "Centro" : "Vértice";
  if (fieldName === "vertices") return total > 1 ? `Vértice ${index + 1}` : "Vértice";
  if (fieldName === "focos") return total > 1 ? `Foco ${index + 1}` : "Foco";
  return "Punto";
}

function getPointRole(result, fieldName) {
  if (fieldName === "centro_vertice") return result.centro ? "center" : "vertex";
  if (fieldName === "vertices") return "vertex";
  if (fieldName === "focos") return "focus";
  return "point";
}

function getLineRole(fieldName) {
  if (fieldName === "directriz") return "directrix";
  if (fieldName === "eje_principal" || fieldName === "eje_secundario") return "axis";
  return "line";
}

function getExpectedEntry(result, fieldName) {
  if (!result) return null;

  if (fieldName === "centro_vertice") {
    return pointsEntry(result.centro ? [result.centro] : result.vertice ? [result.vertice] : null);
  }

  if (fieldName === "vertices") {
    return pointsEntry(Array.isArray(result.vertices) && result.vertices.length ? result.vertices : null);
  }

  if (fieldName === "focos") {
    if (Array.isArray(result.focos) && result.focos.length) return pointsEntry(result.focos);
    return pointsEntry(result.foco ? [result.foco] : null);
  }

  if (fieldName === "eje_principal") {
    return lineEntry(result.eje_mayor_recta || result.eje_transversal_recta || result.eje_simetria);
  }

  if (fieldName === "eje_secundario") {
    return lineEntry(result.eje_menor_recta || result.eje_conjugado_recta);
  }

  if (fieldName === "directriz") {
    return lineEntry(result.directriz_recta);
  }

  return null;
}

function pointsEntry(points) {
  const validPoints = (points || []).filter(isPoint);
  return validPoints.length ? { kind: "points", points: validPoints } : null;
}

function lineEntry(line) {
  if (!line || !["vertical", "horizontal"].includes(line.tipo)) return null;
  return { kind: "line", line };
}

function validatePointAnswer(value, expectedPoints) {
  const points = parsePoints(value);

  if (!points.length) {
    return {
      status: "incorrect",
      message: "Ingresa coordenadas, por ejemplo: (3.00, 0.04).",
    };
  }

  if (!samePointSet(points, expectedPoints)) {
    return {
      status: "incorrect",
      message: "Revisa las coordenadas: no coinciden con el resultado calculado.",
    };
  }

  return {
    status: "correct",
    message: expectedPoints.length > 1 ? "Correcto. Puntos marcados en el plano." : "Correcto. Punto marcado en el plano.",
  };
}

function validateLineAnswer(value, expectedLine) {
  const line = parseLine(value);

  if (!line) {
    return {
      status: "incorrect",
      message: "Ingresa la recta con formato x = valor o y = valor.",
    };
  }

  const expectedAxis = expectedLine.tipo === "vertical" ? "x" : "y";
  const expectedValue = expectedAxis === "x" ? expectedLine.x : expectedLine.y;

  if (line.axis !== expectedAxis || !closeTo(line.value, expectedValue)) {
    return {
      status: "incorrect",
      message: "Revisa la recta: no coincide con el resultado calculado.",
    };
  }

  return {
    status: "correct",
    message: "Correcto. Recta marcada en el plano.",
  };
}

function validateJustification(value) {
  return validateMinimumTextLength(value, 12);
}

function validateNotApplicable(value) {
  const normalized = normalizeAnswerText(value);
  const isEmpty = normalized.length === 0;
  const saysNotApplicable = ["no aplica", "n/a", "na", "--", "no corresponde"].includes(normalized);

  if (isEmpty || saysNotApplicable) {
    return {
      status: "correct",
      message: "Correcto. Este campo no aplica para esta cónica.",
    };
  }

  return {
    status: "incorrect",
    message: "Este campo no aplica para esta cónica.",
  };
}

function parsePoints(value) {
  const numbers = extractNumbers(value);
  if (numbers.length < 2 || numbers.length % 2 !== 0) return [];

  const points = [];
  for (let i = 0; i < numbers.length; i += 2) {
    points.push([numbers[i], numbers[i + 1]]);
  }

  return points.filter(isPoint);
}

function parseLine(value) {
  const match = String(value)
    .trim()
    .match(/^([xy])\s*=\s*(-?\d+(?:[.,]\d+)?)$/i);

  if (!match) return null;

  const numericValue = parseDecimal(match[2]);
  if (!Number.isFinite(numericValue)) return null;

  return {
    axis: match[1].toLowerCase(),
    value: numericValue,
  };
}

function extractNumbers(value) {
  return (String(value).match(/-?\d+(?:[.,]\d+)?/g) || [])
    .map(parseDecimal)
    .filter(Number.isFinite);
}

function samePointSet(answerPoints, expectedPoints) {
  if (answerPoints.length !== expectedPoints.length) return false;

  const used = new Set();

  return expectedPoints.every((expectedPoint) => {
    const matchIndex = answerPoints.findIndex((answerPoint, index) => {
      return !used.has(index) && samePoint(answerPoint, expectedPoint);
    });

    if (matchIndex === -1) return false;
    used.add(matchIndex);
    return true;
  });
}

function samePoint(pointA, pointB) {
  return closeTo(pointA[0], pointB[0]) && closeTo(pointA[1], pointB[1]);
}

function closeTo(valueA, valueB) {
  return isCloseTo(valueA, valueB, POINT_TOLERANCE);
}

function isPoint(point) {
  return Array.isArray(point) && Number.isFinite(Number(point[0])) && Number.isFinite(Number(point[1]));
}
