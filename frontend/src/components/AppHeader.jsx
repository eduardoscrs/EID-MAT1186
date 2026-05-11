export function AppHeader({ activePage, status, onPageChange }) {
  return (
    <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-800 px-6 py-8 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200">MAT1186</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">Evaluación Integrada de Desempeño N°1</h1>
          <p className="mt-2 max-w-2xl text-blue-100">
            Análisis y Modelamiento de Secciones Cónicas y Funciones por Tramos a partir
del RUT
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                activePage === "conicas" ? "bg-white text-blue-950" : "bg-white/10 text-blue-100 hover:bg-white/20"
              }`}
              onClick={() => onPageChange("conicas")}
              type="button"
            >
              Análisis de cónicas
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                activePage === "limites" ? "bg-white text-blue-950" : "bg-white/10 text-blue-100 hover:bg-white/20"
              }`}
              onClick={() => onPageChange("limites")}
              type="button"
            >
              Límites
            </button>
          </div>
        </div>
        <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm backdrop-blur">
          <p className="font-semibold text-blue-100">Estado actual</p>
          <p className="mt-1 font-bold text-white">{status}</p>
        </div>
      </div>
    </header>
  );
}
