function LegendItem({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-600">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

export function GraphPanel({ canvasRef, large = false }) {
  const width = large ? 1120 : 760;
  const height = large ? 620 : 460;

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Plano cartesiano</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Gráfico de la cónica</h2>
          <p className="text-sm text-slate-500">Escala automática según los puntos calculados por Flask.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LegendItem color="bg-teal-600" label="Cónica" />
          <LegendItem color="bg-rose-600" label="Centro" />
          <LegendItem color="bg-violet-600" label="Vértice" />
          <LegendItem color="bg-amber-500" label="Foco" />
          <LegendItem color="bg-blue-600" label="Eje" />
          <LegendItem color="bg-red-600" label="Directriz / asíntota" />
        </div>
      </div>
      <div className="flex justify-center bg-slate-100 p-3 sm:p-5">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`h-auto w-full rounded-2xl bg-white shadow-inner ring-1 ring-slate-200 ${large ? "max-w-[1120px]" : "max-w-[760px]"}`}
        />
      </div>
    </section>
  );
}
