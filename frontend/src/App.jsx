import React, { useEffect, useMemo, useRef, useState } from "react";

const initialMessage = "Ingresa un RUT chileno válido para construir y graficar la cónica.";

function drawGrid(ctx, width, height, scale) {
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#dbeafe";
  ctx.lineWidth = 1;

  for (let x = centerX % scale; x <= width; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = centerY % scale; y <= height; y += scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#1e3a8a";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
}

function drawPath(ctx, points, width, height, scale) {
  if (!points?.x?.length || !points?.y?.length) return;

  const centerX = width / 2;
  const centerY = height / 2;

  ctx.beginPath();
  points.x.forEach((xValue, index) => {
    const x = centerX + xValue * scale;
    const y = centerY - points.y[index] * scale;

    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}
// DIBUJAR GRAFICO
// DIBUJAR GRAFICO
function drawGraph(ctx, data, width, height) {
  const scale = 28;
  drawGrid(ctx, width, height, scale);

  if (!data?.puntos_grafica) {
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 82, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }

  const tipo = data.tipo_conica;
  const puntos = data.puntos_grafica;

  console.log("TIPO:", tipo);
  console.log("PUNTOS:", puntos);

  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 3;

  if (tipo === "Circunferencia" || tipo === "Elipse") {
    drawPath(ctx, { x: puntos.x, y: puntos.y_pos }, width, height, scale);
    drawPath(ctx, { x: puntos.x, y: puntos.y_neg }, width, height, scale);
  }

  // CAMBIO AQUÍ
  if (tipo === "Parábola") {
    drawPath(ctx, { x: puntos.x, y: puntos.y_pos }, width, height, scale);

    if (puntos.y_neg) {
      drawPath(ctx, { x: puntos.x, y: puntos.y_neg }, width, height, scale);
    }
  }

  // CAMBIO AQUÍ
  if (tipo === "Hipérbola") {
    drawPath(ctx, puntos.rama_izq, width, height, scale);

    drawPath(
      ctx,
      puntos.rama_izq
        ? { x: puntos.rama_izq.x, y: puntos.rama_izq.y_neg }
        : null,
      width,
      height,
      scale,
    );

    drawPath(ctx, puntos.rama_der, width, height, scale);

    drawPath(
      ctx,
      puntos.rama_der
        ? { x: puntos.rama_der.x, y: puntos.rama_der.y_neg }
        : null,
      width,
      height,
      scale,
    );
  }

  // CAMBIO AQUÍ
  const point = tipo === "Parábola"
    ? data.vertice
    : data.centro;

  if (point) {
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = "#dc2626";
    ctx.beginPath();

    ctx.arc(
      centerX + point[0] * scale,
      centerY - point[1] * scale,
      5,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }
}

function normalizeConicName(name) {
  const plainName = name?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (plainName?.includes("Circunferencia")) return "Circunferencia";
  if (plainName?.includes("Elipse")) return "Elipse";
  if (plainName?.includes("Par")) return "Parabola";
  if (plainName?.includes("Hip")) return "Hiperbola";

  return plainName;
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Number(value).toFixed(2);
}

function formatPoint(point) {
  if (!point?.length) return "--";
  return `(${formatNumber(point[0])}, ${formatNumber(point[1])})`;
}

function App() {
  const canvasRef = useRef(null);
  const [rut, setRut] = useState("");
  const [status, setStatus] = useState(initialMessage);
  const [validation, setValidation] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeType = result?.tipo_conica || "Circunferencia";
  const extractedDigits = useMemo(() => rut.replace(/[^0-9kK]/g, "").toUpperCase().split(""), [rut]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    drawGraph(ctx, result, canvas.width, canvas.height);
  }, [result]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setValidation(null);
    setResult(null);
    setStatus("Validando RUT...");

    try {
      const validarResponse = await fetch("/api/validar_rut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut }),
      });

      const validarData = await validarResponse.json();

      if (!validarResponse.ok || validarData.error) {
        throw new Error(validarData.error || "No se pudo validar el RUT.");
      }

      setValidation(validarData);

      if (!validarData.valido) {
        setStatus("El RUT no es válido. Revisa el dígito verificador.");
        return;
      }

      setStatus("RUT válido. Calculando cónica...");

      const procesarResponse = await fetch("/api/procesar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuerpo: validarData.cuerpo,
          digito_verificador: validarData.digito_verificador,
        }),
      });

      const procesarData = await procesarResponse.json();

      if (!procesarResponse.ok || procesarData.error) {
        throw new Error(procesarData.error || "No se pudo procesar la cónica.");
      }

      setResult({
        ...procesarData,
        tipo_conica: normalizeConicName(procesarData.tipo_conica),
      });
      setStatus("Cónica calculada correctamente.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  const classificationItems = [
    { icon: "○", name: "Circunferencia", keys: ["Circunferencia"] },
    { icon: "⬭", name: "Elipse", keys: ["Elipse"] },
    { icon: "⌓", name: "Parábola", keys: ["Parabola"] },
    { icon: "⋈", name: "Hipérbola", keys: ["Hiperbola"] },
  ];

  const metrics = [
    {
      label: result?.tipo_conica === "Parabola" ? "Vértice" : "Centro",
      value: result?.centro ? formatPoint(result.centro) : formatPoint(result?.vertice),
      accent: "bg-red-500",
    },
    { label: "Radio", value: formatNumber(result?.radio), accent: "bg-blue-500" },
    { label: "Eje a", value: formatNumber(result?.a), accent: "bg-purple-500" },
    { label: "Eje b", value: formatNumber(result?.b), accent: "bg-green-500" },
    { label: "Eje c", value: formatNumber(result?.c), accent: "bg-orange-500" },
    { label: "Excentricidad", value: formatNumber(result?.excentricidad), accent: "bg-sky-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-800 px-6 py-8 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200">MAT1186</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">Análisis de Secciones Cónicas</h1>
            <p className="mt-2 max-w-2xl text-blue-100">Frontend React conectado a la API Flask, con validación de RUT, desarrollo módulo 11 y gráfico cartesiano.</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm backdrop-blur">
            <p className="font-semibold text-blue-100">Estado actual</p>
            <p className="mt-1 font-bold text-white">{status}</p>
          </div>
        </div>
      </header>

      <nav className="mx-auto mt-6 flex max-w-7xl flex-wrap justify-center gap-3 px-4">
        {["Ecuación", "Desarrollo Matemático", "Gráfica", "Funciones"].map((tab, index) => (
          <button
            key={tab}
            className={`rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              index === 0 ? "bg-blue-900 text-white" : "bg-white text-blue-950 hover:bg-blue-50"
            }`}
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[330px_1fr_310px]">
        <aside className="space-y-6">
          <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <h2 className="text-xl font-black text-blue-950">Validación RUT</h2>
            <p className="mt-1 text-sm text-slate-500">Ingresa el RUT y la aplicación consultará tu backend para generar la cónica.</p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="rut" className="text-sm font-bold text-slate-600">RUT</label>
                <input
                  id="rut"
                  value={rut}
                  onChange={(event) => setRut(event.target.value)}
                  placeholder="12345678-5"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-800 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !rut.trim()}
                className="w-full rounded-2xl bg-blue-900 px-4 py-3 font-black text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Calculando..." : "Validar y graficar"}
              </button>
            </form>

            <div className={`mt-4 rounded-2xl border p-4 ${validation?.valido ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Resultado</div>
              <div className="mt-1 flex items-center justify-between gap-3 font-bold text-blue-950">
                <span>{validation ? (validation.valido ? "RUT válido" : "RUT inválido") : "Sin validar"}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs text-white ${validation?.valido ? "bg-emerald-600" : "bg-slate-500"}`}>
                  {validation ? (validation.valido ? "OK" : "No OK") : "--"}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-100 p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Dígitos extraídos</div>
              <div className="mt-2 min-h-8 font-mono text-lg tracking-[0.25em] text-blue-950">
                {extractedDigits.length ? extractedDigits.join(" ") : "_ _ _ _ _ _ _ _"}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <h2 className="text-lg font-black text-blue-950">Desarrollo Módulo 11</h2>
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
              {validation?.pasos?.length ? (
                <ol className="space-y-2">
                  {validation.pasos.map((step, index) => (
                    <li key={`${step}-${index}`} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                      <span className="mr-2 font-black text-blue-900">{index + 1}.</span>{step}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-slate-500">Cuando valides un RUT, aparecerán los pasos aquí. Nada de magia negra: puro módulo 11.</p>
              )}
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <section className="rounded-3xl bg-gradient-to-br from-white to-blue-50 p-6 text-center shadow-md ring-1 ring-slate-200">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Ecuación de la cónica</div>
            <div className="mt-3 break-words text-2xl font-black text-blue-950 md:text-4xl">
              {result?.ecuacion || "Ax² + Bxy + Cy² + Dx + Ey + F = 0"}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-black text-blue-950">Clasificación de la Cónica</h2>
              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-950">
                {result?.tipo_conica || "Esperando cálculo"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {classificationItems.map((item) => {
                const isActive = item.keys.includes(activeType);
                return (
                  <div
                    key={item.name}
                    className={`rounded-2xl border p-4 text-center transition ${
                      isActive ? "border-blue-700 bg-blue-900 text-white shadow-lg" : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="text-4xl leading-none">{item.icon}</div>
                    <div className="mt-2 text-sm font-black">{item.name}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-black text-blue-950">Gráfico Cartesiano</h2>
                <p className="text-sm text-slate-500">La grilla se dibuja en canvas usando los puntos enviados por Flask.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <canvas ref={canvasRef} width="760" height="460" className="h-auto w-full max-w-[760px] rounded-2xl bg-white shadow-inner" />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
              <div className="text-sm font-black text-blue-950">General → Canónica</div>
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 font-mono text-sm">x² + y² + Dx + Ey + F = 0</div>
              <div className="py-2 text-center text-2xl text-blue-900">↓</div>
              <div className="rounded-2xl bg-slate-50 p-3 font-mono text-sm">(x - h)² + (y - k)² = r²</div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-slate-200">
              <div className="text-sm font-black text-blue-950">Canónica → General</div>
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 font-mono text-sm">(x - h)² + (y - k)² = r²</div>
              <div className="py-2 text-center text-2xl text-blue-900">↓</div>
              <div className="rounded-2xl bg-slate-50 p-3 font-mono text-sm">x² + y² - 2hx - 2ky + (h² + k² - r²) = 0</div>
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          {metrics.map((metric) => (
            <section key={metric.label} className="rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-200">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
                <span className={`h-3 w-3 rounded-full ${metric.accent}`} />
                {metric.label}
              </div>
              <div className="mt-3 text-2xl font-black text-blue-950">{metric.value}</div>
            </section>
          ))}

          <section className="rounded-3xl bg-blue-950 p-5 text-white shadow-md">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">Resumen</p>
            <p className="mt-3 text-sm leading-6 text-blue-50">
              {result
                ? `Se generó una ${result.tipo_conica} a partir del RUT ingresado.`
                : "Aún no hay cónica calculada. Valida un RUT para activar los resultados."}
            </p>
          </section>
        </aside>
      </main>

      <footer className="mt-4 bg-slate-900 px-6 py-5 text-center text-sm text-slate-200">
        <span className="font-semibold text-slate-400">Integrantes: </span>
        <strong>Eduardo Escares, Patricio Benavides, Marcelo Santana</strong>
      </footer>
    </div>
  );
}

export default App;
