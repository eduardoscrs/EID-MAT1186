import { classificationItems } from "../../../constants/ui";

export function ClassificationPanel({ activeType, result }) {
  return (
    <section className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-black text-blue-950">Clasificación de la Cónica</h2>
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-950">{result?.tipo_conica || "Esperando cálculo"}</span>
      </div>

      <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
        {classificationItems.map((item) => {
          const isActive = item.keys.includes(activeType);
          return (
            <div
              key={item.name}
              className={`flex min-h-28 flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                isActive
                  ? "border-blue-700 bg-blue-900 text-white shadow-lg"
                  : "border-slate-200 bg-slate-100 text-slate-400 opacity-60 grayscale"
              }`}
            >
              <div className="text-4xl leading-none md:text-5xl">{item.icon}</div>
              <div className="mt-2 text-sm font-black">{item.name}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
