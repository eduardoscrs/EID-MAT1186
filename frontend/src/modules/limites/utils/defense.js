import {
  closeTo,
  normalizeAnswerText,
  parseDecimal,
  validateMinimumTextLength,
} from "../../shared/defense";
import { getRemovabilityKind } from "./discontinuity";

const NUMERIC_TOLERANCE = 0.06;

export function validateLimitDefenseField(result, fieldName, rawValue) {
  const value = String(rawValue || "").trim();

  if (!result) {
    return {
      status: "incorrect",
      message: "Construye la función antes de validar este campo.",
    };
  }

  if (fieldName === "limite_izquierdo") {
    return validateLimitValue(value, result.limites?.izquierdo, "límite izquierdo");
  }

  if (fieldName === "limite_derecho") {
    return validateLimitValue(value, result.limites?.derecho, "límite derecho");
  }

  if (fieldName === "existe_limite") {
    return validateBooleanAnswer(value, Boolean(result.limites?.existe), "existencia del límite");
  }

  if (fieldName === "valor_en_a") {
    return validateValueAtA(value, result);
  }

  if (fieldName === "continuidad") {
    return validateContinuity(value, Boolean(result.continuidad?.continua_en_a));
  }

  if (fieldName === "tipo_discontinuidad") {
    return validateDiscontinuityType(value, result.continuidad?.clasificacion || result.caso);
  }

  if (fieldName === "justificacion") {
    return validateJustification(value);
  }

  return {
    status: "incorrect",
    message: "Este campo no tiene una validación definida.",
  };
}

function validateLimitValue(value, expected, label) {
  if (matchesExpectedValue(value, expected)) {
    return {
      status: "correct",
      message: `Correcto. Coincide con el ${label}.`,
    };
  }

  return {
    status: "incorrect",
    message: `Revisa el ${label}: no coincide con el resultado calculado.`,
  };
}

function validateBooleanAnswer(value, expected, label) {
  const answer = parseBooleanAnswer(value);

  if (answer === expected) {
    return {
      status: "correct",
      message: `Correcto. La ${label} está bien indicada.`,
    };
  }

  return {
    status: "incorrect",
    message: `Revisa la ${label}.`,
  };
}

function validateValueAtA(value, result) {
  if (!result.continuidad?.definida_en_a) {
    if (isUndefinedAnswer(value)) {
      return {
        status: "correct",
        message: "Correcto. La función no está definida en a.",
      };
    }

    return {
      status: "incorrect",
      message: "En este caso f(a) no existe o no está definida.",
    };
  }

  const expected = result.limites?.derecho ?? result.limites?.izquierdo;
  if (matchesExpectedValue(value, expected)) {
    return {
      status: "correct",
      message: "Correcto. Valor de f(a) bien indicado.",
    };
  }

  return {
    status: "incorrect",
    message: "Revisa el valor de la función en a.",
  };
}

function validateContinuity(value, expectedContinuous) {
  const normalized = normalizeAnswerText(value);
  const saysContinuous = normalized.includes("continua") && !normalized.includes("discontinua") && !normalized.includes("no continua");
  const saysDiscontinuous = normalized.includes("discontinua") || normalized.includes("no continua") || normalized === "no";

  if ((expectedContinuous && saysContinuous) || (!expectedContinuous && saysDiscontinuous)) {
    return {
      status: "correct",
      message: "Correcto. Conclusión de continuidad bien indicada.",
    };
  }

  return {
    status: "incorrect",
    message: "Revisa la conclusión de continuidad.",
  };
}

function validateDiscontinuityType(value, expectedType) {
  const normalized = normalizeAnswerText(value);
  const expected = getRemovabilityKind(expectedType);

  if (expected === "continua") {
    const saysNoDiscontinuity =
      normalized === "continua" ||
      normalized.includes("no hay") ||
      normalized.includes("sin discontinuidad");

    if (saysNoDiscontinuity) {
      return {
        status: "correct",
        message: "Correcto. No hay discontinuidad.",
      };
    }
  } else if (expected === "removible" && saysRemovable(normalized)) {
    return {
      status: "correct",
      message: "Correcto. La discontinuidad es removible.",
    };
  } else if (expected === "irremovible" && saysIrremovable(normalized)) {
    return {
      status: "correct",
      message: "Correcto. La discontinuidad es irremovible.",
    };
  }

  return {
    status: "incorrect",
    message: "Revisa si la discontinuidad es removible o irremovible.",
  };
}

function saysRemovable(normalized) {
  return (
    normalized === "removible" ||
    normalized.includes("discontinuidad removible") ||
    (normalized.includes("removible") &&
      !normalized.includes("irremovible") &&
      !normalized.includes("no removible"))
  );
}

function saysIrremovable(normalized) {
  return (
    normalized === "irremovible" ||
    normalized.includes("irremovible") ||
    normalized.includes("no removible") ||
    normalized.includes("no es removible")
  );
}

function validateJustification(value) {
  return validateMinimumTextLength(value, 18);
}

function matchesExpectedValue(value, expected) {
  const expectedText = normalizeMathText(expected);
  const answerText = normalizeMathText(value);

  if (!answerText) return false;
  if (answerText === expectedText) return true;

  if (expectedText === "+inf") return ["inf", "+inf", "infinito", "+infinito"].includes(answerText);
  if (expectedText === "-inf") return ["-inf", "-infinito"].includes(answerText);

  const answerNumber = parseNumeric(value);
  const expectedNumber = parseNumeric(expected);

  if (!Number.isFinite(answerNumber) || !Number.isFinite(expectedNumber)) return false;
  return closeTo(answerNumber, expectedNumber, NUMERIC_TOLERANCE);
}

function parseBooleanAnswer(value) {
  const normalized = normalizeAnswerText(value);
  if (["si", "sí", "existe", "verdadero", "true"].includes(normalized)) return true;
  if (["no", "no existe", "falso", "false"].includes(normalized)) return false;
  return null;
}

function isUndefinedAnswer(value) {
  const normalized = normalizeAnswerText(value);
  return [
    "",
    "--",
    "no existe",
    "no definido",
    "no definida",
    "indefinida",
    "indefinido",
    "n/a",
    "na",
  ].includes(normalized);
}

function normalizeMathText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/∞/g, "inf")
    .replace(/−/g, "-")
    .replace(",", ".");
}

function parseNumeric(value) {
  const normalized = normalizeMathText(value);
  if (!normalized || normalized.includes("inf")) return NaN;
  return parseDecimal(normalized);
}
