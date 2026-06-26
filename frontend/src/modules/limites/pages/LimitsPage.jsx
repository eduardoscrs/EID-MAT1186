import { useRef } from "react";
import { DefenseFieldsPanel } from "../../../components/DefenseFieldsPanel";
import { ModuleStepsPanel } from "../../../components/ModuleStepsPanel";
import { RutFormPanel } from "../../../components/RutFormPanel";
import { limitDefenseFields, limitExampleRuts } from "../../../constants/ui";
import { useElementHeight } from "../../../hooks/useElementHeight";
import { getRutValidationState } from "../../shared/rut";
import { LimitGraphPanel } from "../components/LimitGraphPanel";
import { LimitStepsPanel, LimitTheoryPanel } from "../components/LimitTheoryPanel";
import { getRemovabilityLabel } from "../utils/discontinuity";

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="section-kicker text-amber-700">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}

function LimitsRutSummary({ defenseChecks, result, status, validation }) {
  const validationState = getRutValidationState(validation);
  const validationCardClass = validation?.valido
    ? "border-emerald-200 bg-emerald-50"
    : validation
      ? "border-rose-200 bg-rose-50"
      : "border-slate-200 bg-white";

  return (
    <>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Estado</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{status}</p>

      <div className="mt-5 grid gap-3">
        <div className={`rounded-lg border p-4 ${validationCardClass}`}>
          <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Validación</div>
          <div className={`mt-1 font-black ${validationState.className}`}>{validationState.label}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Removibilidad</div>
            <div className="mt-1 font-black text-slate-950">
              {defenseChecks?.tipo_discontinuidad?.status === "correct"
                ? getRemovabilityLabel(result?.continuidad?.clasificacion || result?.caso)
                : "--"}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Regla</div>
            <div className="mt-1 font-black text-slate-950">d8 % 3 = {result?.residuo ?? "--"}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export function LimitsPage({
  defenseChecks,
  defenseValues,
  loading,
  result,
  rut,
  status,
  validation,
  onDefenseChange,
  onDefenseValidate,
  onRutChange,
  onSubmit,
}) {
  const graphPanelRef = useRef(null);
  const graphPanelHeight = useElementHeight(graphPanelRef);
  const defensePanelStyle = graphPanelHeight
    ? { "--defense-panel-max-height": `${graphPanelHeight}px` }
    : undefined;

  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-7">
      <RutFormPanel
        actionLabel="Construir función"
        aside={<LimitsRutSummary defenseChecks={defenseChecks} result={result} status={status} validation={validation} />}
        description="Se calcula el punto de análisis, se selecciona el caso según d8 % 3 y se muestran los límites laterales, continuidad y discontinuidad."
        examples={limitExampleRuts}
        fieldId="rut-limites"
        kicker="Sección de límites"
        loading={loading}
        loadingLabel="Analizando..."
        rut={rut}
        title="Construcción automática desde el RUT"
        tone="amber"
        validation={validation}
        onRutChange={onRutChange}
        onSubmit={onSubmit}
      />

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Sección 1"
          title="Función, límites y evidencia"
          copy="La app construye la función por tramos, muestra la evidencia numérica y revisa continuidad en el punto crítico."
        />
        <LimitTheoryPanel defenseChecks={defenseChecks} result={result} />
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Sección 2"
          title="Gráfica"
          copy="La gráfica muestra el comportamiento lateral y los elementos de discontinuidad."
        />
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div ref={graphPanelRef}>
            <LimitGraphPanel
              defenseChecks={defenseChecks}
              samples={result?.samples}
              funcionPorTramos={result?.funcion_por_tramos}
              caso={result?.continuidad?.clasificacion || result?.caso}
              limites={result?.limites}
            />
          </div>
          <div className="defense-scroll-panel" style={defensePanelStyle}>
            <DefenseFieldsPanel
              checks={defenseChecks}
              compact
              fields={limitDefenseFields}
              title="Campos de límites"
              values={defenseValues}
              onChange={onDefenseChange}
              onValidate={onDefenseValidate}
            />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Sección 3"
          title="Desarrollo matemático"
          copy="La validación del RUT queda separada del procedimiento de límites para revisar cada parte sin mezclar pasos."
        />
        <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
          <ModuleStepsPanel validation={validation} />
          <LimitStepsPanel result={result} />
        </div>
      </section>
    </main>
  );
}
