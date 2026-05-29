import { DefenseFieldsPanel } from "../../../components/DefenseFieldsPanel";
import { conicDefenseFields } from "../../../constants/ui";
import { ClassificationPanel } from "../components/ClassificationPanel";
import { EquationPanel } from "../components/EquationPanel";
import { GraphPanel } from "../components/GraphPanel";
import { ModuleStepsPanel } from "../components/ModuleStepsPanel";
import { ProcedurePanel } from "../components/ProcedurePanel";
import { RutFormPanel } from "../components/RutFormPanel";

export function ConicsPage({ activeType, canvasRef, extractedDigits, loading, result, rut, validation, onRutChange, onSubmit }) {
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-6">
      <RutFormPanel
        rut={rut}
        loading={loading}
        validation={validation}
        extractedDigits={extractedDigits}
        onRutChange={onRutChange}
        onSubmit={onSubmit}
      />

      <section className="space-y-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Seccion 1</p>
          <h2 className="mt-1 text-2xl font-black text-blue-950">Ecuacion y clasificacion</h2>
        </div>
        <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <EquationPanel result={result} />
          <ClassificationPanel activeType={activeType} result={result} />
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Seccion 2</p>
          <h2 className="mt-1 text-2xl font-black text-blue-950">Grafica</h2>
        </div>
        <GraphPanel canvasRef={canvasRef} large />
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Seccion 3</p>
          <h2 className="mt-1 text-2xl font-black text-blue-950">Desarrollo matematico</h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <ModuleStepsPanel validation={validation} />
          <ProcedurePanel result={result} />
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Seccion 4</p>
          <h2 className="mt-1 text-2xl font-black text-blue-950">Defensa oral</h2>
        </div>
        <DefenseFieldsPanel title="Campos de conica" fields={conicDefenseFields} />
      </section>
    </main>
  );
}
