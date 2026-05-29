import { MathText } from "../../../components/MathText";

export function ModuleStepsPanel({ validation }) {
  return (
    <section className="panel p-5">
      <p className="section-kicker">Módulo 11</p>
      <h2 className="mt-1 text-lg font-black text-slate-950">Validación paso a paso</h2>
      <div className="mt-4 text-sm text-slate-700">
        {validation?.pasos?.length ? (
          <ol className="space-y-2">
            {validation.pasos.map((step, index) => (
              <li key={`${step}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="mr-2 font-black text-teal-700">{index + 1}.</span>
                <MathText value={step} />
              </li>
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
