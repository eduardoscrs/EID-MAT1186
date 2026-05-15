import { MathText } from "./MathText";

const procedureBlocks = [
  { title: "Construcción de la ecuación general", key: "pasos_ecuacion" },
  { title: "Transformación a forma canónica", key: "pasos_canonica" },
  { title: "Procedimiento inverso", key: "pasos_inverso" },
];

export function ProcedurePanel({ result }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <h2 className="text-xl font-black text-blue-950">Desarrollo matemático</h2>
      <div className="mt-4 grid gap-4">
        {procedureBlocks.map((block) => {
          const steps = result?.[block.key];

          return (
            <div key={block.title} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <h3 className="font-black text-blue-950">{block.title}</h3>
              {steps?.length ? (
                <ol className="mt-3 space-y-2 text-sm text-slate-700">
                  {steps.map((step, index) => (
                    <li key={`${block.title}-${index}`} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                      <span className="mr-2 font-black text-blue-900">{index + 1}.</span>
                      <MathText value={step} />
                    </li>
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
