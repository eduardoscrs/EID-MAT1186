import { MathText } from "../../../components/MathText";

export function EquationPanel({ result }) {
  return (
    <section className="panel flex h-full min-h-[260px] flex-col overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <p className="section-kicker">Ecuación de la cónica</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-white via-slate-50 to-teal-50/70 px-5 py-8 text-center">
        <div className="math-display max-w-full text-2xl font-black leading-tight text-slate-950 md:text-4xl">
          <MathText value={result?.ecuacion || "Ax^2 + By^2 + Cx + Dy + E = 0"} display />
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Forma canónica</p>
          <div className="math-display max-w-full text-base font-extrabold text-slate-950 md:text-lg">
            {result?.forma_canonica ? <MathText value={result.forma_canonica} display /> : "Pendiente de cálculo"}
          </div>
        </div>
      </div>
    </section>
  );
}
