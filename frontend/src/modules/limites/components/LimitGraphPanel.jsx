import { useEffect, useRef } from "react";
import { MathText } from "../../../components/MathText";
import { formatDisplayValue } from "../../../utils/displayNumbers";
import { LIMIT_CANVAS_HEIGHT, LIMIT_CANVAS_WIDTH, drawLimitGraph } from "../canvas/drawLimitGraph";

function parsePiecewiseFunction(funcionStr) {
  if (!funcionStr) return null;

  const match = funcionStr.match(/f\(x\)\s*=\s*\{\s*(.+?)\s*,\s*si\s+(.+?);\s*(.+?)\s*,\s*si\s+(.+?)\s*\}/);
  if (!match) return null;

  const [, expr1, cond1, expr2, cond2] = match;
  return [
    { expression: expr1.trim(), condition: cond1.trim() },
    { expression: expr2.trim(), condition: cond2.trim() },
  ];
}

function LegendDot({ color, label }) {
  return (
    <span className="chip">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function isCorrect(checks, fieldName) {
  return checks?.[fieldName]?.status === "correct";
}

function LimitMetric({ label, value, fieldName, defenseChecks }) {
  const revealed = isCorrect(defenseChecks, fieldName);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-2 text-xl font-black ${revealed ? "text-slate-950" : "text-slate-400"}`}>
        {revealed ? value : "--"}
      </p>
    </div>
  );
}

export function LimitGraphPanel({ defenseChecks = {}, samples, funcionPorTramos, caso, limites }) {
  const canvasRef = useRef(null);
  const piecewiseRows = parsePiecewiseFunction(funcionPorTramos);

  useEffect(() => {
    drawLimitGraph(canvasRef.current, { samples, caso });
  }, [samples, caso]);

  if (!samples) {
    return (
      <section className="panel p-5">
        <p className="section-kicker text-amber-700">Gráfica</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">Análisis gráfico de límites</h2>
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          La gráfica aparecerá cuando se construya la función por tramos.
        </div>
      </section>
    );
  }

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker text-amber-700">Gráfica</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">Análisis gráfico de límites</h2>
            <p className="mt-1 text-sm text-slate-600">
              Comportamiento lateral, discontinuidades y continuidad cerca del punto crítico.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <LegendDot color="bg-blue-600" label="Tramo izquierdo" />
            <LegendDot color="bg-green-600" label="Tramo derecho" />
            <LegendDot color="bg-red-600" label="Punto crítico" />
            <span className="chip">
              <span className="inline-block h-3 w-3 rounded-full border-2 border-slate-700" />
              Punto no definido
            </span>
          </div>
        </div>
      </div>

      {funcionPorTramos ? (
        <div className="border-b border-slate-200 bg-amber-50/70 px-5 py-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">Función por ramas</p>
          <div className="mt-4 rounded-lg border border-amber-200 bg-white p-5">
            {piecewiseRows ? (
              <div className="flex items-center justify-center overflow-x-auto font-mono text-sm text-slate-900 sm:text-base">
                <span className="mr-3 font-sans text-lg font-black">f(x) =</span>
                <span className="mr-3 font-serif text-6xl leading-none text-amber-700">{"{"}</span>
                <div className="grid gap-2">
                  {piecewiseRows.map((row) => (
                    <div key={`${row.expression}-${row.condition}`} className="grid grid-cols-[minmax(80px,auto)_auto] gap-5">
                      <span className="font-black">
                        <MathText value={formatDisplayValue(row.expression)} />
                      </span>
                      <span className="text-slate-600">
                        si <MathText value={formatDisplayValue(row.condition)} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <pre className="overflow-x-auto text-sm text-slate-900">{funcionPorTramos}</pre>
            )}
          </div>
        </div>
      ) : null}

      <div className="bg-slate-100/80 p-3 sm:p-5">
        <div className="mx-auto w-full max-w-[1000px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner">
          <canvas ref={canvasRef} width={LIMIT_CANVAS_WIDTH} height={LIMIT_CANVAS_HEIGHT} className="w-full bg-white" />
        </div>
      </div>

      {caso && limites ? (
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-5">
          <div className="grid gap-4 md:grid-cols-3">
            <LimitMetric defenseChecks={defenseChecks} fieldName="limite_izquierdo" label="Límite izquierdo" value={formatDisplayValue(limites.izquierdo)} />
            <LimitMetric defenseChecks={defenseChecks} fieldName="limite_derecho" label="Límite derecho" value={formatDisplayValue(limites.derecho)} />
            <LimitMetric
              defenseChecks={defenseChecks}
              fieldName="tipo_discontinuidad"
              label="Tipo de discontinuidad"
              value={caso === "continua" ? "No hay discontinuidad" : caso}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
