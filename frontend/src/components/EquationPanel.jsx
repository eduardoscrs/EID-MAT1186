export function EquationPanel({ result }) {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-white to-blue-50 p-6 text-center shadow-md ring-1 ring-slate-200">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Ecuación de la cónica</div>
      <div className="mt-3 break-words text-2xl font-black text-blue-950 md:text-4xl">{result?.ecuacion || "Ax² + By² + Cx + Dy + E = 0"}</div>
      <div className="mt-5 rounded-2xl bg-white/80 p-4 text-left shadow-sm ring-1 ring-blue-100">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Forma canónica</div>
        <div className="mt-2 break-words font-mono text-lg font-bold text-blue-950">{result?.forma_canonica || "Pendiente de cálculo"}</div>
      </div>
    </section>
  );
}
