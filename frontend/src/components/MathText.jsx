import katex from "katex";
import { useMemo } from "react";
import { isStandaloneMath, splitInlineMath, splitMathSentence, toLatex } from "../utils/mathText";

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
  const inlineSegments = useMemo(() => splitInlineMath(value), [value]);

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

  const inlineMathHtml = useMemo(() => {
    if (html || splitSentence) return [];

    return inlineSegments.map((segment) => {
      if (segment.type !== "math") return null;

      try {
        return renderLatex(segment.value, false);
      } catch {
        return null;
      }
    });
  }, [html, inlineSegments, splitSentence]);

  if (splitSentence && sentenceMathHtml) {
    return (
      <span className={className}>
        {splitSentence.prefix} <span dangerouslySetInnerHTML={{ __html: sentenceMathHtml }} />
      </span>
    );
  }

  if (!html && inlineSegments.some((segment) => segment.type === "math")) {
    return (
      <span className={className}>
        {inlineSegments.map((segment, index) => {
          if (segment.type !== "math" || !inlineMathHtml[index]) {
            return <span key={`${segment.value}-${index}`}>{segment.value}</span>;
          }

          return <span dangerouslySetInnerHTML={{ __html: inlineMathHtml[index] }} key={`${segment.value}-${index}`} />;
        })}
      </span>
    );
  }

  if (!html) {
    return <span className={className}>{value || "--"}</span>;
  }

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
