const navigationItems = [
  { id: "conicas", label: "Cónicas", accent: "bg-teal-500" },
  { id: "limites", label: "Límites", accent: "bg-amber-500" },
];

export function AppHeader({ activePage, status, onPageChange }) {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 px-4 py-5 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="section-kicker">MAT1186</span>
            <span className="hidden h-1.5 w-1.5 rounded-full bg-slate-300 sm:inline-block" />
            <span className="text-sm font-semibold text-slate-500">Evaluación Integrada de Desempeño N°1</span>
          </div>
          <h1 className="mt-2 max-w-4xl text-2xl font-black leading-tight tracking-tight text-slate-950 md:text-4xl">
            Cónicas y funciones por tramos desde el RUT
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            Calcula, grafica y organiza la evidencia matemática para la defensa oral.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          <nav className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1" aria-label="Módulos">
            {navigationItems.map((item) => {
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  aria-pressed={isActive}
                  className={`inline-flex min-w-28 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-extrabold transition ${
                    isActive ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                  onClick={() => onPageChange(item.id)}
                  type="button"
                >
                  <span className={`h-2 w-2 rounded-full ${isActive ? item.accent : "bg-slate-300"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Estado</p>
            <p className="mt-1 max-w-sm font-semibold text-slate-800">{status}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
