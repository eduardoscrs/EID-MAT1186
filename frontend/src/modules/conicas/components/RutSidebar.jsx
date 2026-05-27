import { ModuleStepsPanel } from "./ModuleStepsPanel";
import { RutFormPanel } from "./RutFormPanel";

export function RutSidebar({ rut, loading, validation, extractedDigits, onRutChange, onSubmit }) {
  return (
    <aside className="space-y-6">
      <RutFormPanel rut={rut} loading={loading} validation={validation} extractedDigits={extractedDigits} onRutChange={onRutChange} onSubmit={onSubmit} />
      <ModuleStepsPanel validation={validation} />
    </aside>
  );
}
