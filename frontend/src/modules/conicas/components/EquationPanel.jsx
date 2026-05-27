import { MathText } from "../../../components/MathText";

export function EquationPanel({ result }) {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-white to-blue-50 p-6 text-center shadow-md ring-1 ring-slate-200">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Ecuación de la cónica</div>
      <div className="mt-3 overflow-x-auto text-2xl font-black text-blue-950 md:text-4xl">
        <MathText value={result?.ecuacion || "Ax^2 + By^2 + Cx + Dy + E = 0"} display />
      </div>
      <div className="mt-5 rounded-2xl bg-white/80 p-4 text-left shadow-sm ring-1 ring-blue-100">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Forma canónica</div>
        <div className="mt-2 overflow-x-auto text-lg font-bold text-blue-950">
          {result?.forma_canonica ? <MathText value={result.forma_canonica} display /> : "Pendiente de cálculo"}
        </div>
      </div>
    </section>
  );
}
