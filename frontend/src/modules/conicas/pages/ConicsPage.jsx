import { DefenseFieldsPanel } from "../../../components/DefenseFieldsPanel";
import { conicDefenseFields, conicExampleRuts } from "../../../constants/ui";
import { ClassificationPanel } from "../components/ClassificationPanel";
import { EquationPanel } from "../components/EquationPanel";
import { GraphPanel } from "../components/GraphPanel";
import { MetricsPanel, SummaryPanel } from "../components/MetricsSidebar";
import { ModuleStepsPanel } from "../components/ModuleStepsPanel";
import { ProcedurePanel } from "../components/ProcedurePanel";
import { RutFormPanel } from "../components/RutFormPanel";

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="section-kicker">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}

export function ConicsPage({ activeType, canvasRef, extractedDigits, loading, result, rut, validation, onRutChange, onSubmit }) {
  return (
    <main className="mx-auto max-w-7xl space-y-9 px-4 py-7">
      <RutFormPanel
        rut={rut}
        loading={loading}
        validation={validation}
        extractedDigits={extractedDigits}
        examples={conicExampleRuts}
        onRutChange={onRutChange}
        onSubmit={onSubmit}
      />

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Sección 1"
          title="Ecuación, clasificación y elementos"
          copy="La app organiza la ecuación general, la forma canónica y los componentes geométricos clave."
        />
        <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <EquationPanel result={result} />
          <ClassificationPanel activeType={activeType} result={result} />
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <MetricsPanel result={result} />
          <SummaryPanel result={result} />
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Sección 2"
          title="Gráfica"
          copy="El plano se ajusta a los puntos calculados y resalta focos, vértices, centro y líneas auxiliares."
        />
        <GraphPanel canvasRef={canvasRef} result={result} large />
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Sección 3"
          title="Desarrollo matemático"
          copy="Pasos de validación, transformación y procedimiento inverso listos para revisar."
        />
        <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
          <ModuleStepsPanel validation={validation} />
          <ProcedurePanel result={result} />
        </div>
      </section>

      <section className="space-y-5">
        <DefenseFieldsPanel title="Campos de cónica" fields={conicDefenseFields} />
      </section>
    </main>
  );
}
