import { MathText } from "../../../components/MathText";
import { formatDisplayValue } from "../../../utils/displayNumbers";

function badgeClass(kind) {
  if (kind === "removible") return "bg-emerald-600 text-white";
  if (kind === "salto") return "bg-amber-600 text-white";
  if (kind === "infinita") return "bg-rose-600 text-white";
  if (kind === "continua") return "bg-teal-700 text-white";
  return "bg-slate-700 text-white";
}

function classificationText(kind) {
  if (kind === "continua") return "Continua";
  return `Discontinuidad ${kind || "--"}`;
}

function isCorrect(checks, fieldName) {
  return checks?.[fieldName]?.status === "correct";
}

function revealValue(value, checks, fieldName) {
  return isCorrect(checks, fieldName) ? formatDisplayValue(value) : "--";
}

function MetricCell({ label, value, fieldName, defenseChecks }) {
  const revealed = isCorrect(defenseChecks, fieldName);

  return (
    <div className="border-b border-slate-200 px-4 py-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-black ${revealed ? "text-slate-950" : "text-slate-400"}`}>
        {revealed ? value : "--"}
      </p>
    </div>
  );
}

function formatEvidenceValue(value) {
  return formatDisplayValue(value);
}

function buildEvidenceColumns(evidence = [], a) {
  const numericA = Number(a);
  const ordered = [...evidence].sort((first, second) => Number(first.x) - Number(second.x));

  if (!Number.isFinite(numericA)) {
    return ordered.map((row) => ({ ...row, side: "sample" }));
  }

  const left = ordered.filter((row) => Number(row.x) < numericA);
  const right = ordered.filter((row) => Number(row.x) > numericA);

  return [
    ...left.map((row) => ({ ...row, side: "left" })),
    { x: a, y: null, side: "center" },
    ...right.map((row) => ({ ...row, side: "right" })),
  ];
}

function evidenceSideLabel(side) {
  if (side === "center") return "Centro";
  if (side === "left") return "Izq.";
  if (side === "right") return "Der.";
  return "Valor";
}

function selectionRuleFormula(result) {
  if (!result) return "--";
  const d8 = result.digitos?.d8 ?? "d_8";
  return `d8 = ${d8} -> d8 % 3 = ${result.residuo}`;
}

function buildPiecewiseFormula(tramos = []) {
  if (tramos.length < 2) return "--";

  return [
    "\\begin{cases}",
    `${tramos[0].expresion}, & \\text{si } ${tramos[0].condicion}`,
    "\\\\",
    `${tramos[1].expresion}, & \\text{si } ${tramos[1].condicion}`,
    "\\end{cases}",
  ].join(" ");
}

function limitJustificationText(result) {
  if (!result) return "--";

  const a = result.a;
  const left = result.limites?.izquierdo ?? "--";
  const right = result.limites?.derecho ?? "--";
  const classification = result.continuidad?.clasificacion || result.caso;

  if (classification === "removible") {
    return (
      `La expresión tiene un factor (x - ${a}) en numerador y denominador. ` +
      "Al simplificar, los límites laterales coinciden, pero la expresión original no está definida en x = a; " +
      "por eso la discontinuidad es removible."
    );
  }

  if (classification === "salto") {
    return (
      `Los límites laterales son lim x-> ${a}- f(x) = ${left} y lim x-> ${a}+ f(x) = ${right}. ` +
      "Como son distintos, la discontinuidad es de salto."
    );
  }

  if (classification === "continua") {
    return (
      `Los límites laterales coinciden en ${left} y f(${a}) = ${right}. ` +
      "Como la función está definida en el punto, es continua."
    );
  }

  return (
    `Al acercarse x->${a}, el denominador tiende a 0 y el numerador no se anula. ` +
    "La función diverge a infinito según el lado, por eso la discontinuidad es infinita y hay asíntota vertical."
  );
}

export function LimitTheoryPanel({ defenseChecks = {}, result }) {
  const tramos = result?.tramos || [];
  const classification = result?.continuidad?.clasificacion;
  const evidenceColumns = buildEvidenceColumns(result?.evidence || [], result?.a);
  const classificationRevealed = isCorrect(defenseChecks, "tipo_discontinuidad");
  const justificationRevealed = isCorrect(defenseChecks, "justificacion");

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-kicker text-amber-700">Regla</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Construcción de la función por tramos</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${badgeClass(classificationRevealed ? classification : null)}`}>
          {classificationRevealed ? classificationText(classification) : "Pendiente defensa"}
        </span>
      </div>

      {result ? (
        <div className="mt-5 space-y-5">
          <div className="grid overflow-hidden rounded-lg border border-slate-200 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
            <div className="bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">Regla de selección</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                <MathText value={selectionRuleFormula(result)} />
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Punto de análisis: <span className="font-black text-slate-950">a = {formatDisplayValue(result.a)}</span>
              </p>
            </div>

            <div className="border-t border-slate-200 bg-slate-950 p-4 text-white lg:border-l lg:border-t-0">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">Función generada</p>
              <pre className="mt-3 overflow-x-auto text-sm leading-6 text-slate-100">{formatDisplayValue(result.funcion_por_tramos)}</pre>
              {result.extension_sugerida && isCorrect(defenseChecks, "valor_en_a") ? (
                <p className="mt-3 text-sm text-slate-200">
                  Extensión sugerida: <span className="font-black text-white">{formatDisplayValue(result.extension_sugerida)}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white md:grid-cols-3">
            <MetricCell defenseChecks={defenseChecks} fieldName="limite_izquierdo" label="Límite izquierdo" value={formatDisplayValue(result.limites?.izquierdo)} />
            <MetricCell defenseChecks={defenseChecks} fieldName="limite_derecho" label="Límite derecho" value={formatDisplayValue(result.limites?.derecho)} />
            <MetricCell defenseChecks={defenseChecks} fieldName="existe_limite" label="Existe el límite?" value={result.limites?.existe ? "Sí" : "No"} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">Clasificación</p>
              <p className={`mt-2 text-lg font-black ${classificationRevealed ? "text-slate-950" : "text-slate-400"}`}>
                {classificationRevealed ? classificationText(classification) : "--"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Definida en a: <span className="font-black text-slate-900">{isCorrect(defenseChecks, "valor_en_a") ? (result.continuidad?.definida_en_a ? "Sí" : "No") : "--"}</span>
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Continua en a: <span className="font-black text-slate-900">{isCorrect(defenseChecks, "continuidad") ? (result.continuidad?.continua_en_a ? "Sí" : "No") : "--"}</span>
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-black text-slate-700">Justificación matemática</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {justificationRevealed ? <MathText value={limitJustificationText(result)} /> : "--"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">Evidencia numérica</p>
              <p className="mt-1 text-sm text-slate-600">Tabla de valores alrededor de a, con el centro destacado.</p>
              <div className="mt-3 overflow-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-slate-100">
                    <tr className="text-center text-xs uppercase tracking-[0.12em] text-slate-500">
                      <th className="w-20 px-3 py-2 text-left">Lado</th>
                      {evidenceColumns.map((column, i) => (
                        <th
                          className={`px-3 py-2 ${
                            column.side === "center" ? "border-x border-amber-200 bg-amber-100 text-amber-900" : ""
                          }`}
                          key={`side-${column.x}-${i}`}
                        >
                          {evidenceSideLabel(column.side)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100">
                      <th className="px-3 py-2 text-left font-black text-slate-600">x</th>
                      {evidenceColumns.map((column, i) => (
                        <td
                          className={`px-3 py-2 text-center font-mono ${
                            column.side === "center" ? "border-x border-amber-200 bg-amber-50 font-black text-amber-900" : ""
                          }`}
                          key={`x-${column.x}-${i}`}
                        >
                          {column.side === "center" ? `a = ${formatDisplayValue(column.x)}` : formatDisplayValue(column.x)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-100">
                      <th className="px-3 py-2 text-left font-black text-slate-600">f(x)</th>
                      {evidenceColumns.map((column, i) => (
                        <td
                          className={`px-3 py-2 text-center font-mono ${
                            column.side === "center" ? "border-x border-amber-200 bg-amber-50 font-black text-amber-900" : ""
                          }`}
                          key={`y-${column.x}-${i}`}
                        >
                          {formatEvidenceValue(column.y)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Aproximaciones numéricas: <span className="font-black">izq = {revealValue(result.numeric_limits?.izq, defenseChecks, "limite_izquierdo")}</span>,{" "}
                <span className="font-black">der = {revealValue(result.numeric_limits?.der, defenseChecks, "limite_derecho")}</span>
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">Puntos críticos</p>
              {tramos.length ? (
                <div className="mt-3 space-y-3">
                  {tramos.map((tramo, index) => (
                    <div className="rounded-lg border border-slate-200 bg-white p-3" key={`${tramo.condicion}-${index}`}>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{tramo.condicion}</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        <MathText value={formatDisplayValue(tramo.expresion)} />
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {result.puntos_criticos?.length ? (
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {result.puntos_criticos.map((punto, index) => (
                    <li className="rounded-lg border border-slate-200 bg-white px-3 py-2" key={`${punto.x}-${index}`}>
                      x = <span className="font-black text-slate-950">{formatDisplayValue(punto.x)}</span> -{" "}
                      {justificationRevealed ? punto.motivo : "--"}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          Ingresa un RUT para construir la función por tramos y analizar el límite.
        </div>
      )}
    </section>
  );
}

export function LimitStepsPanel({ result }) {
  const groups = buildLimitProcedureGroups(result);

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-kicker text-amber-700">Proceso</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Desarrollo matemático</h2>
        </div>
        <span className="chip">{result ? "calculado" : "pendiente"}</span>
      </div>

      <div className="mt-5 grid gap-4">
        {groups.length ? (
          groups.map((group, index) => <LimitProcedureGroup group={group} index={index} key={group.title} />)
        ) : (
          <>
            <PlaceholderBlock title="Construcción de la función por tramos" />
            <PlaceholderBlock title="Cálculo de límites laterales" />
            <PlaceholderBlock title="Conclusión de continuidad" />
          </>
        )}
      </div>
    </section>
  );
}

function PlaceholderBlock({ title }) {
  return (
    <div className="panel-muted p-4">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-sm text-slate-500">Este procedimiento aparecerá después de validar un RUT.</p>
    </div>
  );
}

function LimitProcedureGroup({ group, index }) {
  return (
    <article className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[2.25rem_1fr]">
      <span className="text-xl font-black leading-none text-amber-700">{index + 1}.</span>
      <div className="min-w-0 space-y-3">
        <h3 className="text-base font-extrabold text-slate-800">{group.title}</h3>
        {group.description ? (
          <p className="text-sm leading-6 text-slate-600">
            <MathText value={group.description} />
          </p>
        ) : null}
        {group.formulas?.length ? (
          <div className="grid gap-2">
            {group.formulas.map((formula) => (
              <FormulaBox key={formula} value={formula} />
            ))}
          </div>
        ) : null}
        {group.notes?.length ? (
          <div className="grid gap-2 text-sm leading-6 text-slate-700">
            {group.notes.map((note) => (
              <p key={note}>
                <MathText value={note} />
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function FormulaBox({ value }) {
  return (
    <div className="math-display rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-base text-slate-900">
      <MathText display value={formatDisplayValue(value)} />
    </div>
  );
}

function buildLimitProcedureGroups(result) {
  if (!result) return [];

  const d8 = result.digitos?.d8 ?? "--";
  const limitExists = result.limites?.existe ? "Sí" : "No";
  const continuity = result.continuidad?.continua_en_a ? "Sí" : "No";
  const valueAtA = result.continuidad?.definida_en_a
    ? result.limites?.derecho ?? result.limites?.izquierdo ?? "--"
    : null;
  const valueAtANote = valueAtA === null
    ? "La función no está definida en x = a."
    : `Valor en el punto: f(a) = ${valueAtA}.`;

  return [
    {
      title: "Datos del RUT para límites",
      description: "Con los dígitos extraídos se define el punto crítico y el caso de análisis.",
      formulas: [
        `a = d3 = ${result.a}`,
        `d8 = ${d8}`,
        `d8 % 3 = ${result.residuo}`,
      ],
      notes: [`El residuo selecciona el caso ${result.caso}.`],
    },
    {
      title: "Función por tramos",
      description: "Se construye la función alrededor del punto crítico.",
      formulas: [buildPiecewiseFormula(result.tramos)],
    },
    {
      title: "Cálculo de límites laterales",
      description: "Se comparan los comportamientos cuando x se acerca a a por cada lado.",
      formulas: [
        `\\lim_{x -> ${result.a}^{-}} f(x) = ${result.limites?.izquierdo ?? "--"}`,
        `\\lim_{x -> ${result.a}^{+}} f(x) = ${result.limites?.derecho ?? "--"}`,
      ],
    },
    {
      title: "Continuidad y clasificación",
      notes: [
        `Existe el límite: ${limitExists}.`,
        valueAtANote,
        `Continua en a: ${continuity}.`,
        limitJustificationText(result),
      ],
    },
  ];
}
