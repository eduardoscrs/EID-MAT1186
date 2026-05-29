import { classificationItems } from "../../../constants/ui";

function displayConicType(type) {
  if (type === "Parabola") return "Parábola";
  if (type === "Hiperbola") return "Hipérbola";
  return type;
}

export function ClassificationPanel({ activeType, result }) {
  return (
    <section className="panel flex h-full flex-col p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="section-kicker">Clasificación</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Tipo de cónica</h2>
        </div>
        <span className="chip bg-teal-50 text-teal-800">
          <span className="status-dot" />
          {displayConicType(result?.tipo_conica) || "Sin resultado"}
        </span>
      </div>

      <div className="mt-5 grid flex-1 grid-cols-2 gap-3">
        {classificationItems.map((item) => {
          const isActive = item.keys.includes(activeType);
          return (
            <div
              key={item.name}
              aria-current={isActive ? "true" : undefined}
              className={`flex min-h-28 flex-col justify-between rounded-lg border p-4 transition ${
                isActive
                  ? "border-teal-500 bg-teal-950 text-white shadow-lg shadow-teal-950/15"
                  : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl font-black ${
                    isActive ? "bg-white text-teal-950" : "bg-white text-slate-700"
                  }`}
                >
                  {item.icon}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-amber-300" : "bg-slate-300"}`} />
              </div>
              <div>
                <div className="text-sm font-black">{item.name}</div>
                <div className={`mt-1 text-xs font-semibold ${isActive ? "text-teal-100" : "text-slate-400"}`}>{item.hint}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
