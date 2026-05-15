const replacements = [
  [/²/g, "^2"],
  [/³/g, "^3"],
  [/·/g, "\\cdot "],
  [/×/g, "\\times "],
  [/÷/g, "\\div "],
  [/−/g, "-"],
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
]);

export function toLatex(value) {
  if (value === null || value === undefined) return "--";

  let expression = String(value).trim();
  replacements.forEach(([pattern, replacement]) => {
    expression = expression.replace(pattern, replacement);
  });

  expression = expression.replace(/\s+/g, " ");
  expression = expression.replace(/\(([^()]+)\)\^2/g, "{($1)}^2");
  expression = expression.replace(/([A-Za-z])\^(\d+)/g, "$1^{$2}");
  expression = expression.replace(/([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)/g, "\\frac{$1}{$2}");

  mathWords.forEach((latex, word) => {
    expression = expression.replaceAll(word, latex);
  });

  return expression;
}

export function looksLikeMath(value) {
  if (value === null || value === undefined) return false;
  const text = String(value).trim();
  return /[=^²³()+\-*/]|\\frac|\\sqrt/.test(text);
}

export function isStandaloneMath(value) {
  if (!looksLikeMath(value)) return false;

  const text = String(value).trim();
  return /^[0-9ABCDERFVKxyabcefhkprdv.,\s=^²³()+\-*/|\\{}]+$/.test(text);
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
