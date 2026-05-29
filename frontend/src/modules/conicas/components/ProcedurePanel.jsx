import { MathText } from "../../../components/MathText";

const procedureBlocks = [
  { title: "Construcción de la ecuación general", key: "pasos_ecuacion" },
  { title: "Transformación a forma canónica", key: "pasos_canonica" },
  { title: "Procedimiento inverso", key: "pasos_inverso" },
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
          const steps = result?.[block.key];

          return (
            <div key={block.title} className="panel-muted p-4">
              <h3 className="font-black text-slate-950">{block.title}</h3>
              {steps?.length ? (
                <ol className="mt-3 space-y-2 text-sm text-slate-700">
                  {steps.map((step, index) => (
                    <li key={`${block.title}-${index}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <span className="mr-2 font-black text-teal-700">{index + 1}.</span>
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
