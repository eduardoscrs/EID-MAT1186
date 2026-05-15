import katex from "katex";
import { useMemo } from "react";
import { isStandaloneMath, splitMathSentence, toLatex } from "../utils/mathText";

function renderLatex(value, display) {
  return katex.renderToString(toLatex(value), {
    displayMode: display,
    output: "html",
    strict: false,
    throwOnError: false,
    trust: false,
  });
}

export function MathText({ value, display = false, className = "" }) {
  const splitSentence = splitMathSentence(value);

  const html = useMemo(() => {
    if (!isStandaloneMath(value)) return null;

    try {
      return renderLatex(value, display);
    } catch {
      return null;
    }
  }, [display, value]);

  const sentenceMathHtml = useMemo(() => {
    if (!splitSentence) return null;

    try {
      return renderLatex(splitSentence.suffix, false);
    } catch {
      return null;
    }
  }, [splitSentence]);

  if (splitSentence && sentenceMathHtml) {
    return (
      <span className={className}>
        {splitSentence.prefix} <span dangerouslySetInnerHTML={{ __html: sentenceMathHtml }} />
      </span>
    );
  }

  if (!html) {
    return <span className={className}>{value || "--"}</span>;
  }

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
