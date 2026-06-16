function LegendItem({ color, label }) {
  return (
    <span className="chip">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

export function GraphPanel({ canvasRef, result, large = false, onCanvasMouseLeave, onCanvasMouseMove }) {
  const width = large ? 1120 : 760;
  const height = large ? 620 : 460;

  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-kicker">Plano cartesiano</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Gráfico de la cónica</h2>
          <p className="mt-1 text-sm text-slate-500">
            {result ? "Escala ajustada a los puntos calculados por Flask." : "Vista previa del plano antes de calcular."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LegendItem color="bg-teal-600" label="Cónica" />
          <LegendItem color="bg-rose-600" label="Centro" />
          <LegendItem color="bg-violet-600" label="Vértice" />
          <LegendItem color="bg-amber-500" label="Foco" />
          <LegendItem color="bg-blue-600" label="Eje" />
          <LegendItem color="bg-red-600" label="Directriz / asíntota" />
        </div>
      </div>
      <div className="bg-slate-100/80 p-3 sm:p-5">
        <div className="mx-auto w-full max-w-[1120px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={`h-auto w-full bg-white ${large ? "max-w-[1120px]" : "max-w-[760px]"}`}
            onMouseLeave={onCanvasMouseLeave}
            onMouseMove={onCanvasMouseMove}
          />
        </div>
      </div>
    </section>
  );
}
