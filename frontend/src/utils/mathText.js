import { roundDecimalText } from "./displayNumbers";

const replacements = [
  [/²/g, "^2"],
  [/³/g, "^3"],
  [/·/g, "\\cdot "],
  [/×/g, "\\times "],
  [/÷/g, "\\div "],
  [/−/g, "-"],
  [/->/g, "\\to "],
  [/→/g, "\\to "],
  [/>=/g, "\\ge "],
  [/<=/g, "\\le "],
  [/%/g, "\\bmod "],
  [/\*/g, "\\cdot "],
  [/π/g, "\\pi"],
  [/∞/g, "\\infty"],
  [/\|4p\|/g, "|4p|"],
];

const mathWords = new Map([
  ["Asíntota", "\\text{Asíntota}"],
  ["Directriz", "\\text{Directriz}"],
  ["Centro", "\\text{Centro}"],
  ["Vértice", "\\text{Vértice}"],
  ["Foco", "\\text{Foco}"],
  ["RUT", "\\text{RUT}"],
  ["DV", "\\text{DV}"],
]);

export function toLatex(value) {
  if (value === null || value === undefined) return "--";

  let expression = roundDecimalText(String(value).trim());
  replacements.forEach(([pattern, replacement]) => {
    expression = expression.replace(pattern, replacement);
  });

  expression = expression.replace(/\s+/g, " ");
  expression = expression.replace(/\+\s*-/g, "- ");
  expression = expression.replace(/-\s*-/g, "+ ");
  expression = expression.replace(/\bK_([xy])\b/g, "K_{$1}");
  expression = expression.replace(/\bd(\d)\b/g, "d_{$1}");
  expression = expression.replace(/\(([^()]+)\)\^2/g, "{($1)}^2");
  expression = expression.replace(/([A-Za-z])\^(\d+)/g, "$1^{$2}");
  expression = expression.replace(
    /((?:\{?\([^()]+\)\}?\^\{?\d+\}?)|(?:[A-Za-z]\^\{\d+\}))\s*\/\s*([+-]?\d+(?:\.\d+)?)/g,
    "\\frac{$1}{$2}"
  );
  expression = expression.replace(/([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)/g, "\\frac{$1}{$2}");

  mathWords.forEach((latex, word) => {
    expression = expression.replaceAll(word, latex);
  });

  return expression;
}

export function looksLikeMath(value) {
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  if (text === "--") return false;
  return /[=^²³()+\-*/]|\\frac|\\sqrt/.test(text);
}

export function isStandaloneMath(value) {
  if (!looksLikeMath(value)) return false;

  const text = String(value).trim();
  const words = text.match(/[A-Za-zÁÉÍÓÚáéíóúñÑ]{3,}/g) || [];
  const allowedWords = new Set([
    "RUT",
    "sin",
    "DV",
    "bmod",
    "begin",
    "cases",
    "cdot",
    "definida",
    "end",
    "existe",
    "frac",
    "ingresado",
    "infty",
    "lim",
    "quad",
    "si",
    "text",
    "to",
  ]);
  if (words.some((word) => !allowedWords.has(word))) return false;

  return /^[0-9A-Za-z_.,\s=^²³()+\-*/|\\{}%<>&∞]+$/.test(text);
}

export function splitMathSentence(value) {
  const text = String(value ?? "");
  const separatorIndex = text.lastIndexOf(":");

  if (separatorIndex === -1) return null;

  const prefix = text.slice(0, separatorIndex + 1);
  const suffix = text.slice(separatorIndex + 1).trim();

  if (!suffix || !looksLikeMath(suffix)) return null;
  return { prefix, suffix };
}

export function splitInlineMath(value) {
  const text = String(value ?? "");
  if (!text.trim()) return [{ type: "text", value: "" }];
  if (isStandaloneMath(text)) return [{ type: "math", value: text }];

  const matches = collectInlineMathMatches(text);
  if (!matches.length) return [{ type: "text", value: text }];

  const segments = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (match.start > cursor) {
      segments.push({ type: "text", value: text.slice(cursor, match.start) });
    }
    segments.push({ type: "math", value: match.value });
    cursor = match.end;
  });

  if (cursor < text.length) {
    segments.push({ type: "text", value: text.slice(cursor) });
  }

  return segments.filter((segment) => segment.value.length > 0);
}

function collectInlineMathMatches(text) {
  const candidates = [];

  addMatches(candidates, text, /-?\d+(?:[.,]\d+)?\s*(?:%|\*|\/|\+|-)\s*-?\d+(?:[.,]\d+)?(?:\s*=\s*-?\d+(?:[.,]\d+)?)?/g);
  addMatches(candidates, text, /\([^()]*\d[^()]*\)\^2(?:\s*=\s*-?\d+(?:[.,]\d+)?)?/g);
  addMatches(candidates, text, /[A-Z]\s*=\s*-?\d+(?:[.,]\d+)?/g);
  addMatches(candidates, text, /\bp\s*=\s*-?\d+(?:[.,]\d+)?/g);
  addMatches(candidates, text, /\bDV\s*=\s*[0-9K]\b/gi);
  addMatches(candidates, text, /\bd\d\b/g);
  addMatches(candidates, text, /\bK_[xy]\b/g);
  addMatches(candidates, text, /(?<![A-Za-zÁÉÍÓÚáéíóúñÑ])\b[ABCDExp]\b(?![A-Za-zÁÉÍÓÚáéíóúñÑ])/g);
  addMatches(candidates, text, /(?<![\w])-?\d+(?:[.,]\d+)?(?![\w])/g);

  return candidates
    .filter((candidate) => candidate.value.trim() !== "--")
    .sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start))
    .reduce((kept, candidate) => {
      const previous = kept[kept.length - 1];
      if (previous && candidate.start < previous.end) {
        const candidateLength = candidate.end - candidate.start;
        const previousLength = previous.end - previous.start;
        if (candidateLength > previousLength) kept[kept.length - 1] = candidate;
        return kept;
      }

      kept.push(candidate);
      return kept;
    }, []);
}

function addMatches(candidates, text, pattern) {
  for (const match of text.matchAll(pattern)) {
    candidates.push({
      end: match.index + match[0].length,
      start: match.index,
      value: match[0],
    });
  }
}
