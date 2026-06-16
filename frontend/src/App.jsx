import { useEffect, useMemo, useRef, useState } from "react";
import { AppFooter } from "./components/AppFooter";
import { AppHeader } from "./components/AppHeader";
import { initialMessage } from "./constants/ui";
import { processRut, validateRut } from "./modules/conicas/api/conics";
import { findDefensePointAtCanvasPosition } from "./modules/conicas/canvas/defenseOverlay";
import { drawGraph } from "./modules/conicas/canvas/drawGraph";
import { calculateViewport } from "./modules/conicas/canvas/viewport";
import { ConicsPage } from "./modules/conicas/pages/ConicsPage";
import { normalizeConicName } from "./modules/conicas/utils/conics";
import { buildConicDefenseOverlay, validateConicDefenseField } from "./modules/conicas/utils/defense";
import { processLimits } from "./modules/limites/api/limits";
import { LimitsPage } from "./modules/limites/pages/LimitsPage";
import { validateLimitDefenseField } from "./modules/limites/utils/defense";

function App() {
  const canvasRef = useRef(null);
  const [activePage, setActivePage] = useState("conicas");
  const [rut, setRut] = useState("");
  const [status, setStatus] = useState(initialMessage);
  const [validation, setValidation] = useState(null);
  const [result, setResult] = useState(null);
  const [limitsResult, setLimitsResult] = useState(null);
  const [conicResultRut, setConicResultRut] = useState("");
  const [limitsResultRut, setLimitsResultRut] = useState("");
  const [conicDefenseValues, setConicDefenseValues] = useState({});
  const [conicDefenseChecks, setConicDefenseChecks] = useState({});
  const [hoveredConicDefensePoint, setHoveredConicDefensePoint] = useState(null);
  const [limitDefenseValues, setLimitDefenseValues] = useState({});
  const [limitDefenseChecks, setLimitDefenseChecks] = useState({});
  const [loading, setLoading] = useState(false);

  const activeType = result?.tipo_conica || null;
  const rutKey = useMemo(() => cleanRutInput(rut), [rut]);
  const extractedDigits = useMemo(() => rut.replace(/[^0-9kK]/g, "").toUpperCase().split(""), [rut]);
  const conicDefenseOverlay = useMemo(
    () => buildConicDefenseOverlay(result, conicDefenseChecks, conicDefenseValues),
    [result, conicDefenseChecks, conicDefenseValues],
  );

  useEffect(() => {
    if (activePage !== "conicas") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    drawGraph(ctx, result, canvas.width, canvas.height, conicDefenseOverlay, hoveredConicDefensePoint);
  }, [activePage, result, conicDefenseOverlay, hoveredConicDefensePoint]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setValidation(null);
    setResult(null);
    setConicResultRut("");
    resetConicDefense();
    setStatus("Validando RUT...");

    try {
      const validarData = await validateCurrentRut();

      if (!validarData) {
        return;
      }

      const validatedRutKey = getRutKey(validarData, rut);
      if (limitsResultRut && limitsResultRut !== validatedRutKey) {
        setLimitsResult(null);
        setLimitsResultRut("");
        resetLimitDefense();
      }

      await calculateConic(validarData);
      setActivePage("conicas");
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
    setLimitsResultRut("");
    resetLimitDefense();
    setStatus("Validando RUT para límites...");

    try {
      const validarData = await validateCurrentRut("Validando RUT para límites...");

      if (!validarData) {
        return;
      }

      const validatedRutKey = getRutKey(validarData, rut);
      if (conicResultRut && conicResultRut !== validatedRutKey) {
        setResult(null);
        setConicResultRut("");
        resetConicDefense();
      }

      await calculateLimits(validarData);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePageChange(nextPage) {
    if (nextPage === activePage) return;

    setActivePage(nextPage);

    if (loading || !rutKey) return;

    const hasCurrentConic = nextPage === "conicas" && result && conicResultRut === rutKey;
    const hasCurrentLimits = nextPage === "limites" && limitsResult && limitsResultRut === rutKey;
    if (hasCurrentConic) {
      setStatus("Cónica calculada correctamente.");
      return;
    }
    if (hasCurrentLimits) {
      setStatus("Límites calculados correctamente.");
      return;
    }

    setLoading(true);

    try {
      const currentValidation =
        validation?.valido && getRutKey(validation, rut) === rutKey
          ? validation
          : await validateCurrentRut(nextPage === "limites" ? "Validando RUT para límites..." : "Validando RUT...");

      if (!currentValidation) return;

      if (nextPage === "conicas") {
        await calculateConic(currentValidation);
        return;
      }

      await calculateLimits(currentValidation);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleRutChange(value) {
    setRut(formatRutInput(value));
  }

  async function validateCurrentRut(message = "Validando RUT...") {
    setStatus(message);
    const validarData = await validateRut(rut);
    setValidation(validarData);

    if (!validarData.valido) {
      setStatus("El RUT no es válido. Revisa el dígito verificador.");
      return null;
    }

    return validarData;
  }

  async function calculateConic(validarData) {
    setStatus("RUT válido. Calculando cónica...");
    resetConicDefense();

    const procesarData = await processRut({
      cuerpo: validarData.cuerpo,
      digito_verificador: validarData.digito_verificador,
    });

    setResult({
      ...procesarData,
      tipo_conica: normalizeConicName(procesarData.tipo_conica),
    });
    setConicResultRut(getRutKey(validarData, rut));
    setStatus("Cónica calculada correctamente.");
  }

  async function calculateLimits(validarData) {
    setStatus("RUT válido. Construyendo función por tramos...");
    resetLimitDefense();

    const limitesData = await processLimits(rut);
    setLimitsResult(limitesData);
    setLimitsResultRut(cleanRutInput(limitesData?.rut_limpio || getRutKey(validarData, rut)));
    setStatus("Límites calculados correctamente.");
  }

  function resetConicDefense() {
    setConicDefenseValues({});
    setConicDefenseChecks({});
    setHoveredConicDefensePoint(null);
  }

  function resetLimitDefense() {
    setLimitDefenseValues({});
    setLimitDefenseChecks({});
  }

  function handleConicDefenseChange(fieldName, value) {
    setConicDefenseValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
    setConicDefenseChecks((currentChecks) => {
      if (!currentChecks[fieldName]) return currentChecks;
      const nextChecks = { ...currentChecks };
      delete nextChecks[fieldName];
      return nextChecks;
    });
    setHoveredConicDefensePoint(null);
  }

  function handleConicDefenseValidate(fieldName) {
    const check = validateConicDefenseField(result, fieldName, conicDefenseValues[fieldName]);
    setConicDefenseChecks((currentChecks) => ({
      ...currentChecks,
      [fieldName]: check,
    }));
    setHoveredConicDefensePoint(null);
  }

  function handleConicCanvasMouseMove(event) {
    if (!result?.puntos_grafica || !conicDefenseOverlay.points?.length) {
      event.currentTarget.style.cursor = "default";
      setHoveredConicDefensePoint(null);
      return;
    }

    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const canvasPosition = {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
    const viewport = calculateViewport(result, canvas.width, canvas.height);
    const nextHoveredPoint = findDefensePointAtCanvasPosition(conicDefenseOverlay, viewport, canvasPosition);

    canvas.style.cursor = nextHoveredPoint ? "help" : "default";
    setHoveredConicDefensePoint((currentPoint) => {
      if (currentPoint?.id === nextHoveredPoint?.id) return currentPoint;
      return nextHoveredPoint;
    });
  }

  function handleConicCanvasMouseLeave(event) {
    event.currentTarget.style.cursor = "default";
    setHoveredConicDefensePoint(null);
  }

  function handleLimitDefenseChange(fieldName, value) {
    setLimitDefenseValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));
    setLimitDefenseChecks((currentChecks) => {
      if (!currentChecks[fieldName]) return currentChecks;
      const nextChecks = { ...currentChecks };
      delete nextChecks[fieldName];
      return nextChecks;
    });
  }

  function handleLimitDefenseValidate(fieldName) {
    const check = validateLimitDefenseField(limitsResult, fieldName, limitDefenseValues[fieldName]);
    setLimitDefenseChecks((currentChecks) => ({
      ...currentChecks,
      [fieldName]: check,
    }));
  }

  return (
    <div className="app-bg min-h-screen text-slate-800 antialiased">
      <AppHeader activePage={activePage} status={status} onPageChange={handlePageChange} />

      {activePage === "conicas" ? (
        <ConicsPage
          activeType={activeType}
          canvasRef={canvasRef}
          defenseChecks={conicDefenseChecks}
          defenseValues={conicDefenseValues}
          extractedDigits={extractedDigits}
          loading={loading}
          result={result}
          rut={rut}
          validation={validation}
          onCanvasMouseLeave={handleConicCanvasMouseLeave}
          onCanvasMouseMove={handleConicCanvasMouseMove}
          onDefenseChange={handleConicDefenseChange}
          onDefenseValidate={handleConicDefenseValidate}
          onRutChange={handleRutChange}
          onSubmit={handleSubmit}
        />
      ) : (
        <LimitsPage
          defenseChecks={limitDefenseChecks}
          defenseValues={limitDefenseValues}
          loading={loading}
          result={limitsResult}
          rut={rut}
          status={status}
          validation={validation}
          onDefenseChange={handleLimitDefenseChange}
          onDefenseValidate={handleLimitDefenseValidate}
          onRutChange={handleRutChange}
          onSubmit={handleLimitsSubmit}
        />
      )}

      <AppFooter />
    </div>
  );
}

function formatRutInput(value) {
  const cleaned = cleanRutInput(value).slice(0, 9);

  if (!cleaned) return "";
  if (cleaned.length === 1) return `-${cleaned}`;

  return `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`;
}

function cleanRutInput(value) {
  return String(value || "")
    .replace(/[^0-9kK]/g, "")
    .toUpperCase();
}

function getRutKey(validarData, fallbackRut) {
  const rutFromParts =
    validarData?.cuerpo && validarData?.digito_verificador
      ? `${validarData.cuerpo}${validarData.digito_verificador}`
      : "";

  return cleanRutInput(validarData?.rut_limpio || rutFromParts || fallbackRut);
}

export default App;
