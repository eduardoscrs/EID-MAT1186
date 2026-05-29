import { useEffect, useMemo, useRef, useState } from "react";
import { AppFooter } from "./components/AppFooter";
import { AppHeader } from "./components/AppHeader";
import { initialMessage } from "./constants/ui";
import { processRut, validateRut } from "./modules/conicas/api/conics";
import { drawGraph } from "./modules/conicas/canvas/drawGraph";
import { ConicsPage } from "./modules/conicas/pages/ConicsPage";
import { normalizeConicName } from "./modules/conicas/utils/conics";
import { processLimits } from "./modules/limites/api/limits";
import { LimitsPage } from "./modules/limites/pages/LimitsPage";

function App() {
  const canvasRef = useRef(null);
  const [activePage, setActivePage] = useState("conicas");
  const [rut, setRut] = useState("");
  const [status, setStatus] = useState(initialMessage);
  const [validation, setValidation] = useState(null);
  const [result, setResult] = useState(null);
  const [limitsResult, setLimitsResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeType = result?.tipo_conica || null;
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

  function handleRutChange(value) {
    setRut(formatRutInput(value));
  }

  return (
    <div className="app-bg min-h-screen text-slate-800 antialiased">
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
          onRutChange={handleRutChange}
          onSubmit={handleSubmit}
        />
      ) : (
        <LimitsPage
          loading={loading}
          result={limitsResult}
          rut={rut}
          status={status}
          validation={validation}
          onRutChange={handleRutChange}
          onSubmit={handleLimitsSubmit}
        />
      )}

      <AppFooter />
    </div>
  );
}

function formatRutInput(value) {
  const cleaned = value.replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);

  if (!cleaned) return "";
  if (cleaned.length === 1) return `-${cleaned}`;

  return `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`;
}

export default App;
