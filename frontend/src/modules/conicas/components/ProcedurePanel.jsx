import { MathText } from "../../../components/MathText";
import { looksLikeMath } from "../../../utils/mathText";

const procedureBlocks = [
  { title: "Construcción de la ecuación general", key: "pasos_ecuacion" },
  { title: "Transformación a forma canónica", key: "pasos_canonica" },
  { title: "Procedimiento inverso", key: "pasos_inverso" },
];

const spanishDisplayReplacements = [
  [/\brubrica\b/gi, "rúbrica"],
  [/\bterminos\b/gi, "términos"],
  [/\btermino\b/gi, "término"],
  [/\becuacion\b/gi, "ecuación"],
  [/\bcanonica\b/gi, "canónica"],
  [/\bcomparacion\b/gi, "comparación"],
  [/\bparentesis\b/gi, "paréntesis"],
  [/\baisla\b/gi, "aísla"],
  [/\bParabola\b/g, "Parábola"],
  [/\bmultiplo\b/gi, "múltiplo"],
];

export function ProcedurePanel({ result }) {
  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-kicker">Proceso</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Desarrollo matemático</h2>
        </div>
        <span className="chip">{result ? "calculado" : "pendiente"}</span>
      </div>

      <div className="mt-5 grid gap-4">
        {procedureBlocks.map((block) => {
          const groups = buildProcedureGroups(result?.[block.key]);

          return (
            <div key={block.title} className="panel-muted p-4">
              <h3 className="text-lg font-black text-slate-950">{block.title}</h3>
              {groups.length ? (
                <ol className="mt-4 space-y-3">
                  {groups.map((group, index) => (
                    <ProcedureStep group={group} index={index} key={`${block.title}-${index}`} />
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Este procedimiento aparecerá después de validar un RUT.</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProcedureStep({ group, index }) {
  const hasTitle = Boolean(group.title);

  return (
    <li className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[2.25rem_1fr]">
      <span className="text-xl font-black leading-none text-teal-700">{index + 1}.</span>
      <div className="min-w-0 space-y-3">
        {hasTitle ? (
          <h4 className="text-base font-extrabold text-slate-800">
            <MathText value={group.title} />
          </h4>
        ) : null}
        <div className={hasTitle ? "space-y-2" : "space-y-0"}>
          {group.lines.map((line, lineIndex) => (
            <ProcedureLine key={`${line}-${lineIndex}`} value={line} />
          ))}
        </div>
      </div>
    </li>
  );
}

function ProcedureLine({ value }) {
  const splitLine = splitStepTitleAndFormula(value);

  if (splitLine) {
    const formulas = splitLine.formulas || [splitLine.formula];

    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold leading-6 text-slate-600">
          <MathText value={splitLine.title} />
        </p>
        {formulas.map((formula) => (
          <FormulaBox key={formula} value={formula} />
        ))}
      </div>
    );
  }

  if (isFormulaLine(value)) {
    return <FormulaBox value={value} />;
  }

  return (
    <p className="text-sm leading-7 text-slate-700">
      <MathText value={value} />
    </p>
  );
}

function FormulaBox({ value }) {
  return (
    <div className="math-display rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-base text-slate-900">
      <MathText display value={value} />
    </div>
  );
}

function buildProcedureGroups(steps = []) {
  const cleanSteps = steps.map(normalizeProcedureStep).filter(Boolean);
  const groups = [];

  for (let index = 0; index < cleanSteps.length; index += 1) {
    const step = cleanSteps[index];

    if (isDecorativeHeading(step)) continue;

    const titleFormula = splitStepTitleAndFormula(step);
    if (titleFormula && !titleFormula.isBullet) {
      groups.push({
        title: titleFormula.title,
        lines: titleFormula.formulas || [titleFormula.formula],
      });
      continue;
    }

    if (isCollectingTitle(step)) {
      const group = {
        title: removeTrailingColon(step),
        lines: [],
      };
      let nextIndex = index + 1;

      while (nextIndex < cleanSteps.length && !isGroupBoundary(cleanSteps[nextIndex])) {
        group.lines.push(cleanSteps[nextIndex]);
        nextIndex += 1;
      }

      groups.push(group.lines.length ? group : { title: null, lines: [step] });
      index = nextIndex - 1;
      continue;
    }

    if (shouldPairWithNext(step, cleanSteps[index + 1])) {
      groups.push({
        title: step,
        lines: [cleanSteps[index + 1]],
      });
      index += 1;
      continue;
    }

    groups.push({ title: null, lines: [step] });
  }

  return groups;
}

function normalizeProcedureStep(step) {
  let text = String(step || "").trim();
  if (!text) return "";
  if (isRawDecorativeHeading(text)) return "";

  text = text.replace(/\s+/g, " ");
  text = text.replace(/\+\s*-/g, "- ");
  text = text.replace(/-\s*-/g, "+ ");
  text = text.replace(/->/g, "→");

  spanishDisplayReplacements.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement);
  });

  return text;
}

function isDecorativeHeading(step) {
  return isRawDecorativeHeading(step);
}

function isCollectingTitle(step) {
  return step.endsWith(":") && !splitStepTitleAndFormula(step);
}

function isGroupBoundary(step) {
  if (!step || isDecorativeHeading(step)) return true;
  if (isCollectingTitle(step)) return true;

  const splitLine = splitStepTitleAndFormula(step);
  return Boolean(splitLine && !splitLine.isBullet);
}

function shouldPairWithNext(step, nextStep) {
  if (!nextStep || isGroupBoundary(nextStep)) return false;
  if (!/sumando y restando/i.test(step)) return false;
  return isFormulaLine(nextStep);
}

function splitStepTitleAndFormula(step) {
  const centerExpansion = step.match(/^\(x - h\)\^2 se expande como (.+?),\s*y\s*\(y - k\)\^2 como (.+?)\.?$/i);
  if (centerExpansion) {
    return {
      formulas: [
        `(x - h)^2 = ${removeTrailingPeriod(centerExpansion[1])}`,
        `(y - k)^2 = ${removeTrailingPeriod(centerExpansion[2])}`,
      ],
      isBullet: false,
      title: "Se expanden los cuadrados",
    };
  }

  const comparison = step.match(/^Por comparación con\s+(.+?)(?:\.)?$/i);
  if (comparison) {
    return {
      formula: removeTrailingPeriod(comparison[1]),
      isBullet: false,
      title: "Por comparación con la forma estándar",
    };
  }

  const startsFrom = step.match(/^Se parte de\s+(.+?)(?:\.)?$/i);
  if (startsFrom) {
    return {
      formula: removeTrailingPeriod(startsFrom[1]),
      isBullet: false,
      title: "Se parte de la forma canónica",
    };
  }

  const orderedTerms = step.match(/^Se ordenan los términos como\s+(.+?)(?:\.)?$/i);
  if (orderedTerms) {
    return {
      formula: removeTrailingPeriod(orderedTerms[1]),
      isBullet: false,
      title: "Se ordenan los términos como",
    };
  }

  const separatorIndex = step.indexOf(":");
  if (separatorIndex === -1) return null;

  const title = step.slice(0, separatorIndex).trim();
  const formula = step.slice(separatorIndex + 1).trim();
  if (!title || !formula || !looksLikeMath(formula)) return null;

  return { title: removeLeadingListDash(title), formula, isBullet: title.startsWith("-") };
}

function isFormulaLine(value) {
  if (!looksLikeMath(value)) return false;
  const words = String(value).match(/[A-Za-zÁÉÍÓÚáéíóúñÑ]{3,}/g) || [];
  return words.length === 0;
}

function removeTrailingColon(value) {
  return value.replace(/:\s*$/, "");
}

function removeLeadingListDash(value) {
  return value.replace(/^-\s*/, "");
}

function removeTrailingPeriod(value) {
  return value.trim().replace(/\.$/, "");
}

function isRawDecorativeHeading(value) {
  return /^---\s*.+?\s*---$/.test(value.trim());
}
