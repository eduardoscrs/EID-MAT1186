import { useEffect, useMemo, useRef, useState } from "react";
import { processRut, validateRut } from "./api/conics";
import { processLimits } from "./api/limits";
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
  const [limitsResult, setLimitsResult] = useState(null);
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
    setLimitsResult(null);
    setStatus("Validando RUT...");

    try {
      const validarData = await validateRut(rut);
      setValidation(validarData);

      if (!validarData.valido) {
        setStatus("El RUT no es válido. Revisa el dígito verificador.");
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

  async function handleLimitsSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setValidation(null);
    setLimitsResult(null);
    setStatus("Validando RUT para límites...");

    try {
      const validarData = await validateRut(rut);
      setValidation(validarData);

      if (!validarData.valido) {
        setStatus("El RUT no es válido. Revisa el dígito verificador.");
        return;
      }

      setStatus("RUT válido. Construyendo función por tramos...");

      const limitesData = await processLimits(rut);
      setLimitsResult(limitesData);
      setStatus("Límites calculados correctamente.");
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
        <LimitsPage
          loading={loading}
          result={limitsResult}
          rut={rut}
          status={status}
          validation={validation}
          onRutChange={setRut}
          onSubmit={handleLimitsSubmit}
        />
      )}

      <AppFooter />
    </div>
  );
}

export default App;
