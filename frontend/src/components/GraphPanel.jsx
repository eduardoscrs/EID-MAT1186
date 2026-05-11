export function GraphPanel({ canvasRef, large = false }) {
  const width = large ? 1120 : 760;
  const height = large ? 620 : 460;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-black text-blue-950">Gráfico Cartesiano</h2>
          <p className="text-sm text-slate-500">La grilla se dibuja en canvas usando los puntos enviados por Flask.</p>
        </div>
      </div>
      <div className="mt-4 flex justify-center rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`h-auto w-full rounded-2xl bg-white shadow-inner ${large ? "max-w-[1120px]" : "max-w-[760px]"}`}
        />
      </div>
    </section>
  );
}
