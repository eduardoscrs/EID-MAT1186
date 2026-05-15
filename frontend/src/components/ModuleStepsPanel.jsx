import { MathText } from "./MathText";

export function ModuleStepsPanel({ validation }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <h2 className="text-lg font-black text-blue-950">Desarrollo Módulo 11</h2>
      <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
        {validation?.pasos?.length ? (
          <ol className="space-y-2">
            {validation.pasos.map((step, index) => (
              <li key={`${step}-${index}`} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                <span className="mr-2 font-black text-blue-900">{index + 1}.</span>
                <MathText value={step} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-slate-500">Cuando valides un RUT, aparecerá aquí.</p>
        )}
      </div>
    </section>
  );
}
