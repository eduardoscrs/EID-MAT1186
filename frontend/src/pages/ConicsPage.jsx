import { ClassificationPanel } from "../components/ClassificationPanel";
import { DefenseFieldsPanel, MetricsPanel, SummaryPanel } from "../components/MetricsSidebar";
import { EquationPanel } from "../components/EquationPanel";
import { GraphPanel } from "../components/GraphPanel";
import { ModuleStepsPanel } from "../components/ModuleStepsPanel";
import { NavigationTabs } from "../components/NavigationTabs";
import { ProcedurePanel } from "../components/ProcedurePanel";
import { RutFormPanel } from "../components/RutFormPanel";

function EquationView({ activeType, result }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="space-y-6">
        <EquationPanel result={result} />
        <ClassificationPanel activeType={activeType} result={result} />
      </section>
      <section className="space-y-4">
        <SummaryPanel result={result} />
        <MetricsPanel result={result} />
      </section>
    </div>
  );
}

function DevelopmentView({ result, validation }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <ModuleStepsPanel validation={validation} />
      <ProcedurePanel result={result} />
    </div>
  );
}

function GraphView({ canvasRef, result }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <SummaryPanel result={result} />
        <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Vista activa</p>
          <p className="mt-2 text-2xl font-black text-blue-950">{result?.tipo_conica || "Gráfica preliminar"}</p>
        </div>
      </div>
      <GraphPanel canvasRef={canvasRef} large />
    </section>
  );
}

function FunctionsView({ result }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <DefenseFieldsPanel />
      <section className="space-y-4">
        <SummaryPanel result={result} />
        <MetricsPanel result={result} />
      </section>
    </div>
  );
}

export function ConicsPage({
  activeTab,
  activeType,
  canvasRef,
  extractedDigits,
  loading,
  result,
  rut,
  validation,
  onRutChange,
  onSubmit,
  onTabChange,
}) {
  return (
    <>
      <NavigationTabs activeTab={activeTab} onTabChange={onTabChange} />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <RutFormPanel
          rut={rut}
          loading={loading}
          validation={validation}
          extractedDigits={extractedDigits}
          onRutChange={onRutChange}
          onSubmit={onSubmit}
        />

        {activeTab === "ecuacion" && <EquationView activeType={activeType} result={result} />}
        {activeTab === "desarrollo" && <DevelopmentView result={result} validation={validation} />}
        {activeTab === "grafica" && <GraphView canvasRef={canvasRef} result={result} />}
        {activeTab === "funciones" && <FunctionsView result={result} />}
      </main>
    </>
  );
}
