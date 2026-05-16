import { useEffect, useMemo, useRef, useState } from "react";
import { processRut, validateRut } from "./api/conics";
import { drawGraph } from "./canvas/drawGraph";
import { AppFooter } from "./components/AppFooter";
import { AppHeader } from "./components/AppHeader";
import { initialMessage } from "./constants/ui";
import { ConicsPage } from "./pages/ConicsPage";
import { LimitsPage } from "./pages/LimitsPage";
import { normalizeConicName } from "./utils/conics";

function App() {
  const canvasRef = useRef(null);
  const [activePage, setActivePage] = useState("conicas");
  const [rut, setRut] = useState("");
  const [status, setStatus] = useState(initialMessage);
  const [validation, setValidation] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeType = result?.tipo_conica || "Circunferencia";
  const extractedDigits = useMemo(() => rut.replace(/[^0-9kK]/g, "").toUpperCase().split(""), [rut]);

  useEffect(() => {
    if (activePage !== "conicas") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    drawGraph(ctx, result, canvas.width, canvas.height);
  }, [activePage, result]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setValidation(null);
    setResult(null);
    setStatus("Validando RUT...");

    try {
      const validarData = await validateRut(rut);
      setValidation(validarData);

      if (!validarData.valido) {
        setStatus(
          validarData.mensaje || "El RUT no es valido. Revisa el digito verificador."
        );
        return;
      }

      setStatus("RUT válido. Calculando cónica...");

      const procesarData = await processRut({
        cuerpo: validarData.cuerpo,
        digito_verificador: validarData.digito_verificador,
      });

      setResult({
        ...procesarData,
        tipo_conica: normalizeConicName(procesarData.tipo_conica),
      });
      setActivePage("conicas");
      setStatus("Cónica calculada correctamente.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <AppHeader activePage={activePage} status={status} onPageChange={setActivePage} />

      {activePage === "conicas" ? (
        <ConicsPage
          activeType={activeType}
          canvasRef={canvasRef}
          extractedDigits={extractedDigits}
          loading={loading}
          result={result}
          rut={rut}
          validation={validation}
          onRutChange={setRut}
          onSubmit={handleSubmit}
        />
      ) : (
        <LimitsPage />
      )}

      <AppFooter />
    </div>
  );
}

export default App;
