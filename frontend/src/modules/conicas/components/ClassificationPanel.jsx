import { classificationItems } from "../../../constants/ui";

export function ClassificationPanel({ activeType, result }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-black text-blue-950">Clasificación de la Cónica</h2>
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-950">{result?.tipo_conica || "Esperando cálculo"}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {classificationItems.map((item) => {
          const isActive = item.keys.includes(activeType);
          return (
            <div
              key={item.name}
              className={`rounded-2xl border p-4 text-center transition ${
                isActive ? "border-blue-700 bg-blue-900 text-white shadow-lg" : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <div className="text-4xl leading-none">{item.icon}</div>
              <div className="mt-2 text-sm font-black">{item.name}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
