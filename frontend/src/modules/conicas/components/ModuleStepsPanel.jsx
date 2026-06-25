import { MathText } from "../../../components/MathText";

export function ModuleStepsPanel({ validation }) {
  const steps = buildValidationSteps(validation?.pasos);

  return (
    <section className="panel p-5">
      <p className="section-kicker">Módulo 11</p>
      <h2 className="mt-1 text-lg font-black text-slate-950">Validación paso a paso</h2>
      <div className="mt-4 text-sm text-slate-700">
        {steps.length ? (
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <ValidationStep index={index} key={`${step.title}-${index}`} step={step} />
            ))}
          </ol>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-slate-500">
            Cuando valides un RUT, aparecerá aquí.
          </div>
        )}
      </div>
    </section>
  );
}

function ValidationStep({ index, step }) {
  return (
    <li className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[2.25rem_1fr]">
      <span className="text-xl font-black leading-none text-teal-700">{index + 1}.</span>
      <div className="min-w-0 space-y-3">
        <h3 className="font-extrabold leading-6 text-slate-800">
          <MathText value={step.title} />
        </h3>

        {step.description ? (
          <p className="leading-6 text-slate-600">
            <MathText value={step.description} />
          </p>
        ) : null}

        {step.formula ? <FormulaBox value={step.formula} /> : null}
        {step.rows?.length ? <MultiplicationRows rows={step.rows} /> : null}
      </div>
    </li>
  );
}

function MultiplicationRows({ rows }) {
  return (
    <div className="grid gap-2">
      {rows.map((row, index) => (
        <div
          className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
          key={`${row.digit}-${row.factor}-${index}`}
        >
          <span className="font-semibold text-slate-600">Dígito desde la derecha</span>
          <span className="math-display font-bold text-slate-900">
            <MathText value={`${row.digit} * ${row.factor} = ${row.product}`} />
          </span>
          <span className="text-slate-500">
            Suma parcial: <MathText value={row.partial} />
          </span>
        </div>
      ))}
    </div>
  );
}

function FormulaBox({ value }) {
  return (
    <div className="math-display rounded-md border border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-900">
      <MathText display value={value} />
    </div>
  );
}

function buildValidationSteps(rawSteps = []) {
  const steps = rawSteps.map(normalizeValidationStep).filter(Boolean);
  if (!steps.length) return [];

  const rut = findFirstMatch(steps, /RUT a validar \(sin DV\):\s*([0-9K]+)/i)?.[1];
  const series = findFirstMatch(steps, /serie\s+([0-9,\s]+)/i)?.[1]?.replace(/\s+/g, "");
  const multiplicationRows = steps.map(parseMultiplicationStep).filter(Boolean);
  const total = findFirstMatch(steps, /Suma total obtenida\s*=\s*(\d+)/i)?.[1];
  const remainder = findFirstMatch(steps, /Calculando resto:\s*(\d+)\s*%\s*11\s*=\s*(\d+)/i);
  const expectedDigit = findFirstMatch(steps, /D[ií]gito verificador esperado\s*=\s*([0-9K])/i)?.[1];
  const enteredDigit = findFirstMatch(steps, /DV ingresado\s*\(([0-9K])\)/i)?.[1];
  const matches = /Si/i.test(findFirstMatch(steps, /Coincide.*\?\s*(Si|No)/i)?.[1] || "");

  const groupedSteps = [];

  if (rut) {
    groupedSteps.push({
      title: "RUT a validar",
      formula: `RUT_{sin\\ DV} = ${rut}`,
    });
  }

  if (multiplicationRows.length) {
    groupedSteps.push({
      title: "Multiplicación de derecha a izquierda",
      description: `Se usa la serie ${series || "2,3,4,5,6,7"} y se acumula cada producto.`,
      rows: multiplicationRows,
    });
  }

  if (total) {
    groupedSteps.push({
      title: "Suma total",
      formula: `S = ${total}`,
    });
  }

  if (remainder) {
    groupedSteps.push({
      title: "Resto módulo 11",
      formula: `${remainder[1]} % 11 = ${remainder[2]}`,
    });
  }

  if (expectedDigit) {
    const remainderValue = remainder?.[2];
    groupedSteps.push({
      title: "Dígito verificador esperado",
      formula: remainderValue ? `11 - ${remainderValue} = ${expectedDigit}` : `DV = ${expectedDigit}`,
    });
  }

  if (enteredDigit) {
    groupedSteps.push({
      title: matches ? "Comparación final correcta" : "Comparación final incorrecta",
      description: matches ? "El dígito verificador ingresado coincide con el calculado." : "El dígito verificador ingresado no coincide con el calculado.",
      formula: `DV = ${enteredDigit}`,
    });
  }

  if (groupedSteps.length) return groupedSteps;

  return steps.map((step) => ({
    title: stripLeadingStepNumber(step),
  }));
}

function normalizeValidationStep(step) {
  return stripLeadingStepNumber(String(step || "").trim().replace(/\s+/g, " "));
}

function stripLeadingStepNumber(step) {
  return step.replace(/^\d+\.\s*/, "");
}

function parseMultiplicationStep(step) {
  const match = step.match(/D[ií]gito\s+([0-9K])\s*\*\s*(\d+)\s*=\s*(\d+)\s*\(Suma parcial:\s*(\d+)\)/i);
  if (!match) return null;

  return {
    digit: match[1],
    factor: match[2],
    partial: match[4],
    product: match[3],
  };
}

function findFirstMatch(steps, pattern) {
  for (const step of steps) {
    const match = step.match(pattern);
    if (match) return match;
  }

  return null;
}
