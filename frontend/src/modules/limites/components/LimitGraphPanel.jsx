import { useEffect, useRef } from "react";
import { MathText } from "../../../components/MathText";

function formatarFuncionPorRamas(funcionStr) {
  if (!funcionStr) return null;
  
  const match = funcionStr.match(/f\(x\)\s*=\s*\{\s*(.+?)\s*,\s*si\s+(.+?);\s*(.+?)\s*,\s*si\s+(.+?)\s*\}/);
  
  if (!match) return funcionStr;
  
  const [, expr1, cond1, expr2, cond2] = match;
  
  const latex = `f(x) = \\begin{cases} ${expr1.trim()} & \\text{si } ${cond1.trim()} \\\\ ${expr2.trim()} & \\text{si } ${cond2.trim()} \\end{cases}`;
  
  return latex;
}

export function LimitGraphPanel({ samples, funcionPorTramos, caso, limites }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !samples) return;

    const ctx = canvas.getContext("2d");

    const w = (canvas.width = 1000);
    const h = (canvas.height = 600);

    ctx.clearRect(0, 0, w, h);

    const pad = 70;
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

    // =========================================
    // CALCULAR RANGOS - MEJORADO ZOOM
    // =========================================

    const ysValid = ys.filter(
      (v) => v !== null && v !== undefined && isFinite(v)
    );

    let minX = Math.min(...xs, a, 0);
    let maxX = Math.max(...xs, a, 0);

    let minY = ysValid.length ? Math.min(...ysValid) : -10;
    let maxY = ysValid.length ? Math.max(...ysValid) : 10;

    if (typeof analIzq === "number" && isFinite(analIzq)) {
      minY = Math.min(minY, analIzq);
      maxY = Math.max(maxY, analIzq);
    }

    if (typeof analDer === "number" && isFinite(analDer)) {
      minY = Math.min(minY, analDer);
      maxY = Math.max(maxY, analDer);
    }

    // Zoom mejorado: centrarse más alrededor del punto crítico
    const rangoX = maxX - minX;
    const rangoY = maxY - minY;
    
    minX = a - rangoX * 0.6;
    maxX = a + rangoX * 0.6;
    
    minY -= rangoY * 0.2;
    maxY += rangoY * 0.2;

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

      // Fondo del canvas
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(pad, pad, w - pad * 2, h - pad * 2);

      // ticks / líneas de rejilla horizontales
      const ticks = 10;

      for (let i = 0; i <= ticks; i++) {
        const t = i / ticks;
        const yVal = minY + (maxY - minY) * t;
        const yPos = mapY(yVal);

        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad, yPos);
        ctx.lineTo(w - pad, yPos);
        ctx.stroke();

        ctx.fillStyle = "#64748b";
        ctx.font = "11px Arial";
        ctx.textAlign = "right";
        ctx.fillText(yVal.toFixed(2), pad - 15, yPos + 4);
        ctx.textAlign = "left";
      }

      // Líneas de rejilla verticales
      for (let i = 0; i <= ticks; i++) {
        const t = i / ticks;
        const xVal = minX + (maxX - minX) * t;
        const xPos = mapX(xVal);

        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xPos, pad);
        ctx.lineTo(xPos, h - pad);
        ctx.stroke();
      }

      // ejes cartesianos
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pad, originY);
      ctx.lineTo(w - pad, originY);
      ctx.moveTo(originX, pad);
      ctx.lineTo(originX, h - pad);
      ctx.stroke();

      // Puntas de flecha en los ejes
      ctx.fillStyle = "#1f2937";
      ctx.beginPath();
      ctx.moveTo(w - pad, originY);
      ctx.lineTo(w - pad - 8, originY - 6);
      ctx.lineTo(w - pad - 8, originY + 6);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(originX, pad);
      ctx.lineTo(originX - 6, pad + 8);
      ctx.lineTo(originX + 6, pad + 8);
      ctx.closePath();
      ctx.fill();

      // etiquetas de ejes
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 14px Arial";
      ctx.fillText("x", w - pad - 28, originY + 20);
      ctx.fillText("y", originX + 12, pad - 15);

      ctx.font = "11px Arial";
      ctx.fillText("O", originX - 14, originY + 20);
    }

    function drawCriticalLineWithGlow() {
      if (!isFinite(a)) return;

      const ax = mapX(a);

      // Efecto glow
      ctx.shadowColor = "rgba(239, 68, 68, 0.6)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 6]);

      ctx.beginPath();
      ctx.moveTo(ax, pad);
      ctx.lineTo(ax, h - pad);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.setLineDash([]);

      // Etiqueta destacada
      ctx.fillStyle = "#dc2626";
      ctx.font = "bold 14px Arial";
      ctx.fillText(`x = ${a}`, ax + 15, pad + 28);
      ctx.fillText("Punto crítico", ax + 15, pad + 46);
    }

    function drawSmoothCurve(side = "left") {
      if (side === "left") {
        ctx.strokeStyle = "#2563eb";
      } else {
        ctx.strokeStyle = "#16a34a";
      }

      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 8;

      // Recolectar puntos del lado
      const points = [];
      for (let i = 0; i < xs.length; i++) {
        const x = xs[i];
        const y = ys[i];

        if (x === null || y === null || !isFinite(x) || !isFinite(y)) {
          continue;
        }

        if (side === "left" && x >= a) continue;
        if (side === "right" && x < a) continue;

        points.push({ x, y, px: mapX(x), py: mapY(y) });
      }

      if (points.length < 2) {
        ctx.shadowBlur = 0;
        return;
      }

      // Dibujar con curvas suaves
      ctx.beginPath();
      ctx.moveTo(points[0].px, points[0].py);

      for (let i = 1; i < points.length; i++) {
        const curr = points[i];
        const prev = points[i - 1];

        if (caso === "infinita") {
          // En discontinuidades infinitas, separar cerca del punto crítico
          const distToCritical = Math.abs(curr.x - a);
          if (distToCritical < 0.5) {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(curr.px, curr.py);
            continue;
          }
        }

        // Usar quadraticCurveTo para curvas suaves
        const ctrlX = (prev.px + curr.px) / 2;
        const ctrlY = (prev.py + curr.py) / 2;
        ctx.quadraticCurveTo(ctrlX, ctrlY, curr.px, curr.py);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function drawLimitLines() {
      ctx.setLineDash([6, 3]);
      ctx.lineWidth = 2.5;

      if (typeof analIzq === "number" && isFinite(analIzq)) {
        const y = mapY(analIzq);

        ctx.strokeStyle = "#2563eb";
        ctx.globalAlpha = 0.5;

        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(w - pad, y);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.fillStyle = "#1e40af";
        ctx.font = "bold 12px Arial";
        ctx.fillText(`← lim x→a⁻ = ${analIzq.toFixed(4)}`, pad + 12, y - 10);

        // Dibuja punto en el límite si no coincide con f(a)
        if (analDer !== analIzq) {
          drawOpenCircle(a, analIzq, "#2563eb");
        }
      }

      if (typeof analDer === "number" && isFinite(analDer)) {
        const y = mapY(analDer);

        ctx.strokeStyle = "#16a34a";
        ctx.globalAlpha = 0.5;

        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(w - pad, y);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.fillStyle = "#15803d";
        ctx.font = "bold 12px Arial";
        ctx.fillText(`← lim x→a⁺ = ${analDer.toFixed(4)}`, pad + 12, y + 14);

        // Dibuja punto en el límite si no coincide con f(a)
        if (analIzq !== analDer) {
          drawOpenCircle(a, analDer, "#16a34a");
        }
      }

      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    function drawOpenCircle(x, y, color = "#111827") {
      const cx = mapX(x);
      const cy = mapY(y);
      const radius = 9;

      ctx.shadowColor = color;
      ctx.shadowBlur = 12;

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;
    }

    function drawClosedCircle(x, y, color = "#111827") {
      const cx = mapX(x);
      const cy = mapY(y);
      const radius = 8;

      ctx.shadowColor = color;
      ctx.shadowBlur = 12;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;
    }

    function drawDiscontinuity() {
      // REMOVIBLE
      if (caso === "removible") {
        if (analIzq !== null && isFinite(analIzq)) {
          drawOpenCircle(a, analIzq, "#0f172a");

          ctx.fillStyle = "#0f172a";
          ctx.font = "bold 12px Arial";
          ctx.fillText(
            "○ Discontinuidad removible",
            mapX(a) + 20,
            mapY(analIzq) - 20
          );
        }
      }

      // SALTO
      else if (caso === "salto") {
        if (analIzq !== null && isFinite(analIzq)) {
          drawOpenCircle(a, analIzq, "#2563eb");
        }
        if (analDer !== null && isFinite(analDer)) {
          drawClosedCircle(a, analDer, "#16a34a");
        }

        ctx.fillStyle = "#000";
        ctx.font = "bold 12px Arial";

        const midY = analIzq && analDer ? (analIzq + analDer) / 2 : analIzq || analDer;
        ctx.fillText(
          "Discontinuidad de salto",
          mapX(a) + 20,
          mapY(midY)
        );
      }

      // INFINITA
      else if (caso === "infinita") {
        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 12px Arial";
        ctx.fillText(
          "Asíntota vertical",
          mapX(a) + 20,
          pad + 70
        );
      }
    }

    // =========================================
    // RENDER MEJORADO
    // =========================================

    drawAxes();
    drawLimitLines();
    drawCriticalLineWithGlow();
    drawSmoothCurve("left");
    drawSmoothCurve("right");
    drawDiscontinuity();

  }, [samples, caso]);

  if (!samples) return null;

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">
      <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
        <h2 className="text-2xl font-black text-slate-900">
          Análisis gráfico de límites
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Representación visual del comportamiento lateral, discontinuidades y continuidad en torno al punto crítico.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-600" />
            Tramo izquierdo
          </span>

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-600" />
            Tramo derecho
          </span>

          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-600" />
            Punto crítico
          </span>

          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-slate-700" />
            Punto no definido
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold">●</span> = Punto definido
          </div>
          <div>
            <span className="font-semibold">○</span> = Punto no definido
          </div>
        </div>
      </div>

      {funcionPorTramos && (
        <div className="border-b border-slate-200 bg-blue-50 px-6 py-5">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">Función por ramas</p>
          <div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-blue-200">
            <div className="overflow-x-auto flex justify-center">
              <MathText value={formatarFuncionPorRamas(funcionPorTramos)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center bg-slate-100 p-6">
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          className="w-full max-w-[1000px] rounded-2xl bg-white shadow-inner ring-1 ring-slate-200"
        />
      </div>

      {caso && limites && (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Límite izquierdo</p>
              <p className="mt-2 text-xl font-black text-blue-950">{limites.izquierdo}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Límite derecho</p>
              <p className="mt-2 text-xl font-black text-blue-950">{limites.derecho}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tipo de discontinuidad</p>
              <p className="mt-2 text-xl font-black capitalize text-blue-950">{caso}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
