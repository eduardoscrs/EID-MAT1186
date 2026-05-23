import { useEffect, useRef } from "react";

function formatY(y) {
  if (y === null || y === undefined) return "—";
  if (y === Infinity) return "+∞";
  if (y === -Infinity) return "-∞";
  return Number(y).toFixed(4);
}

export function LimitGraphPanel({ samples }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !samples) return;

    const ctx = canvas.getContext("2d");

    const w = (canvas.width = 900);
    const h = (canvas.height = 500);

    ctx.clearRect(0, 0, w, h);

    const pad = 60;
    const CLAMP = 50;

    const xs = (samples.xs || []).map((v) =>
      v === null || v === undefined ? v : Number(v)
    );

    const ys = (samples.ys || []).map((v) => {
      if (v === null || v === undefined) return null;

      let n = Number(v);

      if (!isFinite(n)) return n;

      if (n > CLAMP) n = CLAMP;
      if (n < -CLAMP) n = -CLAMP;

      return n;
    });

    if (!xs.length) return;

    const a = Number(samples?.a);

    const analIzq = samples?.analytic?.izq;
    const analDer = samples?.analytic?.der;

    const extension = samples?.extension;

    // =========================================
    // CALCULAR RANGOS
    // =========================================

    const ysValid = ys.filter(
      (v) => v !== null && v !== undefined && isFinite(v)
    );

    let minX = Math.min(...xs, a, 0);
    let maxX = Math.max(...xs, a, 0);

    let minY = ysValid.length ? Math.min(...ysValid) : -10;
    let maxY = ysValid.length ? Math.max(...ysValid) : 10;

    if (typeof analIzq === "number") {
      minY = Math.min(minY, analIzq);
      maxY = Math.max(maxY, analIzq);
    }

    if (typeof analDer === "number") {
      minY = Math.min(minY, analDer);
      maxY = Math.max(maxY, analDer);
    }

    if (typeof extension === "number") {
      minY = Math.min(minY, extension);
      maxY = Math.max(maxY, extension);
    }

    minY = Math.min(minY, 0);
    maxY = Math.max(maxY, 0);

    // margen extra visual
    minY -= 2;
    maxY += 2;

    // =========================================
    // MAPEO
    // =========================================

    const mapX = (x) =>
      ((x - minX) / (maxX - minX || 1)) * (w - pad * 2) + pad;

    const mapY = (y) =>
      h -
      (((y - minY) / (maxY - minY || 1)) * (h - pad * 2) + pad);

    // =========================================
    // FUNCIONES DE DIBUJO
    // =========================================

    function drawAxes() {
      const originX = mapX(0);
      const originY = mapY(0);

      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;

      ctx.beginPath();

      // eje x
      ctx.moveTo(pad, originY);
      ctx.lineTo(w - pad, originY);

      // eje y
      ctx.moveTo(originX, pad);
      ctx.lineTo(originX, h - pad);

      ctx.stroke();

      // etiquetas
      ctx.fillStyle = "#000";
      ctx.font = "13px Arial";

      ctx.fillText("x", w - pad + 10, originY + 5);
      ctx.fillText("y", originX + 10, pad - 10);

      // ticks eje Y
      const ticks = 8;

      for (let i = 0; i <= ticks; i++) {
        const t = i / ticks;

        const yVal = minY + (maxY - minY) * t;

        const yPos = mapY(yVal);

        ctx.strokeStyle = "#cbd5e1";

        ctx.beginPath();
        ctx.moveTo(pad, yPos);
        ctx.lineTo(w - pad, yPos);
        ctx.stroke();

        ctx.fillStyle = "#64748b";
        ctx.fillText(yVal.toFixed(1), pad - 40, yPos + 4);
      }
    }

    function drawCriticalLine() {
      if (!isFinite(a)) return;

      const ax = mapX(a);

      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;

      ctx.setLineDash([8, 6]);

      ctx.beginPath();
      ctx.moveTo(ax, pad);
      ctx.lineTo(ax, h - pad);
      ctx.stroke();

      ctx.setLineDash([]);

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 14px Arial";

      ctx.fillText(`x = ${a}`, ax + 10, pad + 20);

      ctx.fillText("Punto crítico", ax + 10, pad + 40);
    }

    function drawCurve(side = "left") {
      ctx.lineWidth = 3;

      ctx.strokeStyle =
        side === "left"
          ? "#2563eb" // azul
          : "#16a34a"; // verde

      ctx.beginPath();

      let started = false;

      for (let i = 0; i < xs.length; i++) {
        const x = xs[i];
        const y = ys[i];

        if (
          x === null ||
          y === null ||
          !isFinite(x) ||
          !isFinite(y)
        ) {
          started = false;
          continue;
        }

        // separar tramos
        if (side === "left" && x >= a) continue;
        if (side === "right" && x < a) continue;

        const cx = mapX(x);
        const cy = mapY(y);

        if (!started) {
          ctx.moveTo(cx, cy);
          started = true;
        } else {
          ctx.lineTo(cx, cy);
        }
      }

      ctx.stroke();
    }

    function drawLimitLines() {
      ctx.setLineDash([4, 4]);

      if (typeof analIzq === "number") {
        const y = mapY(analIzq);

        ctx.strokeStyle = "#f59e0b";

        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(w - pad, y);
        ctx.stroke();

        ctx.fillStyle = "#f59e0b";
        ctx.fillText(`lim⁻ = ${analIzq}`, w - pad - 120, y - 10);
      }

      if (typeof analDer === "number") {
        const y = mapY(analDer);

        ctx.strokeStyle = "#7c3aed";

        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(w - pad, y);
        ctx.stroke();

        ctx.fillStyle = "#7c3aed";
        ctx.fillText(`lim⁺ = ${analDer}`, w - pad - 120, y - 10);
      }

      ctx.setLineDash([]);
    }

    function drawOpenCircle(x, y, color = "#0f172a") {
      const cx = mapX(x);
      const cy = mapY(y);

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.stroke();
    }

    function drawClosedCircle(x, y, color = "#0f172a") {
      const cx = mapX(x);
      const cy = mapY(y);

      ctx.fillStyle = color;

      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawArrows() {
      const ax = mapX(a);

      ctx.strokeStyle = "#dc2626";

      // izquierda
      ctx.beginPath();
      ctx.moveTo(ax - 80, h - 40);
      ctx.lineTo(ax - 20, h - 40);
      ctx.stroke();

      // punta
      ctx.beginPath();
      ctx.moveTo(ax - 20, h - 40);
      ctx.lineTo(ax - 30, h - 45);

      ctx.moveTo(ax - 20, h - 40);
      ctx.lineTo(ax - 30, h - 35);

      ctx.stroke();

      // derecha
      ctx.beginPath();
      ctx.moveTo(ax + 80, h - 40);
      ctx.lineTo(ax + 20, h - 40);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(ax + 20, h - 40);
      ctx.lineTo(ax + 30, h - 45);

      ctx.moveTo(ax + 20, h - 40);
      ctx.lineTo(ax + 30, h - 35);

      ctx.stroke();
    }

    function drawDiscontinuity() {
      const sameLimit =
        typeof analIzq === "number" &&
        typeof analDer === "number" &&
        Math.abs(analIzq - analDer) < 0.0001;

      // REMOVIBLE
      if (sameLimit && extension === null) {
        drawOpenCircle(a, analIzq, "#0f172a");

        ctx.fillStyle = "#0f172a";
        ctx.fillText(
          "Discontinuidad removible",
          mapX(a) + 15,
          mapY(analIzq) - 15
        );
      }

      // SALTO
      else if (
        typeof analIzq === "number" &&
        typeof analDer === "number" &&
        analIzq !== analDer
      ) {
        drawOpenCircle(a, analIzq, "#2563eb");

        drawClosedCircle(a, analDer, "#16a34a");

        ctx.fillStyle = "#000";

        ctx.fillText(
          "Discontinuidad de salto",
          mapX(a) + 15,
          mapY((analIzq + analDer) / 2)
        );
      }

      // INFINITA
      else {
        ctx.fillStyle = "#dc2626";

        ctx.fillText(
          "Asíntota vertical",
          mapX(a) + 15,
          pad + 70
        );
      }
    }

    // =========================================
    // RENDER
    // =========================================

    drawAxes();

    drawLimitLines();

    drawCriticalLine();

    drawCurve("left");

    drawCurve("right");

    drawArrows();

    drawDiscontinuity();

  }, [samples]);

  if (!samples) return null;

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 className="text-2xl font-black text-slate-900">
          Análisis gráfico de límites
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Representación visual del comportamiento lateral,
          discontinuidades y continuidad en torno al punto crítico.
        </p>

        <div className="mt-4 flex flex-wrap gap-5 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-600" />
            Tramo izquierdo
          </span>

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-600" />
            Tramo derecho
          </span>

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            Punto crítico
          </span>
        </div>
      </div>

      <div className="flex justify-center bg-slate-100 p-6">
        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          className="w-full max-w-[900px] rounded-2xl bg-white shadow-inner ring-1 ring-slate-200"
        />
      </div>

    </section>
  );
}