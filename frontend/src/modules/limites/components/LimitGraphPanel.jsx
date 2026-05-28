import { useEffect, useRef } from "react";
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
    <span className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function LimitMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-blue-950">{value}</p>
    </div>
  );
}

export function LimitGraphPanel({ samples, funcionPorTramos, caso, limites }) {
  const canvasRef = useRef(null);
  const piecewiseRows = parsePiecewiseFunction(funcionPorTramos);

  useEffect(() => {
    drawLimitGraph(canvasRef.current, { samples, caso });
  }, [samples, caso]);

  if (!samples) return null;

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">
      <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
        <h2 className="text-2xl font-black text-slate-900">Analisis grafico de limites</h2>
        <p className="mt-2 text-sm text-slate-600">
          Representacion visual del comportamiento lateral, discontinuidades y continuidad en torno al punto critico.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm font-semibold md:grid-cols-4">
          <LegendDot color="bg-blue-600" label="Tramo izquierdo" />
          <LegendDot color="bg-green-600" label="Tramo derecho" />
          <LegendDot color="bg-red-600" label="Punto critico" />
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-slate-700" />
            Punto no definido
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-slate-500 md:grid-cols-4">
          <div>
            <span className="font-semibold">●</span> = Punto definido
          </div>
          <div>
            <span className="font-semibold">○</span> = Punto no definido
          </div>
        </div>
      </div>

      {funcionPorTramos ? (
        <div className="border-b border-slate-200 bg-blue-50 px-6 py-5">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">Funcion por ramas</p>
          <div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-blue-200">
            {piecewiseRows ? (
              <div className="flex items-center justify-center overflow-x-auto font-mono text-sm text-slate-900 sm:text-base">
                <span className="mr-3 font-sans text-lg font-black">f(x) =</span>
                <span className="mr-3 font-serif text-6xl leading-none text-blue-900">{"{"}</span>
                <div className="grid gap-2">
                  {piecewiseRows.map((row) => (
                    <div key={`${row.expression}-${row.condition}`} className="grid grid-cols-[minmax(80px,auto)_auto] gap-5">
                      <span className="font-bold">{row.expression}</span>
                      <span className="text-slate-600">si {row.condition}</span>
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

      <div className="flex justify-center bg-slate-100 p-6">
        <canvas
          ref={canvasRef}
          width={LIMIT_CANVAS_WIDTH}
          height={LIMIT_CANVAS_HEIGHT}
          className="w-full max-w-[1000px] rounded-2xl bg-white shadow-inner ring-1 ring-slate-200"
        />
      </div>

      {caso && limites ? (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
          <div className="grid gap-4 md:grid-cols-3">
            <LimitMetric label="Limite izquierdo" value={limites.izquierdo} />
            <LimitMetric label="Limite derecho" value={limites.derecho} />
            <LimitMetric
              label="Tipo de discontinuidad"
              value={caso === "continua" ? "No hay discontinuidad" : caso}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
