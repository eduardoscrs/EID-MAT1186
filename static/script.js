let currentData = null;
let validationRequestId = 0;
const conicTypes = {
  Circunferencia: 0,
  Elipse: 1,
  Parábola: 2,
  Hipérbola: 3,
};

async function validarRUT() {
  const requestId = ++validationRequestId;
  const rutInput = document.getElementById("rutInput").value.trim();

  if (!rutInput) {
    alert("Por favor ingrese un RUT");
    return;
  }

  // --- Limpiamos la UI y los pasos antes de hacer la nueva petición ---
  limpiarUI();
  document.getElementById("resultBox").style.display = "none";
  limpiarPasosRut();

  try {
    console.log("Validando RUT:", rutInput);
    const response = await fetch("/api/validar_rut", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rut: rutInput }),
    });

    const data = await response.json();

    if (requestId !== validationRequestId) return;

    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    if (data.valido) {
      document.getElementById("resultBox").style.display = "block";
      document.getElementById("resultBox").className = "result-box success"; // Aplica borde verde
      document.getElementById("rutResult").textContent = "RUT Válido";
      document.getElementById("rutBadge").textContent = "OK";
      document.getElementById("rutBadge").className = "badge badge-success";
      document.getElementById("digitsDisplay").textContent = data.rut_limpio
        .split("")
        .join(" ");

      mostrarPasos(data.pasos);
      procesarEcuacion(data.cuerpo, data.digito_verificador, requestId);
    } else {
      document.getElementById("resultBox").style.display = "block";
      document.getElementById("resultBox").className = "result-box error"; // Aplica borde rojo
      document.getElementById("rutResult").textContent = "RUT Inválido";
      document.getElementById("rutBadge").textContent = "ERROR";
      document.getElementById("rutBadge").className = "badge badge-danger";

      limpiarPasosRut();

      // La zona central y derecha ya están limpias gracias a la llamada del principio
    }
  } catch (error) {
    if (requestId !== validationRequestId) return;
    console.error("Error:", error);
    alert("Error en la validación: " + error.message);
  }
}

function limpiarUI() {
  currentData = null;

  // Limpiar dígitos extraídos y ecuación
  document.getElementById("digitsDisplay").textContent = "_ _ _ _ _ _ _ _";
  document.getElementById("equationDisplay").textContent =
    "Ax² + Bxy + Cy² + Dx + Ey + F = 0";

  // Quitar la selección activa de los tipos de cónica
  document.querySelectorAll(".classification-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Limpiar parámetros geométricos
  document.getElementById("params").innerHTML = `h = __<br>k = __`;
  document.getElementById("centroVal").textContent = "C( ___ , ___ )";
  document.getElementById("focos1Val").textContent = "F₁( ___ , ___ )";
  document.getElementById("focos2Val").textContent = "F₂( ___ , ___ )";
  document.getElementById("vert1Val").textContent = "V₁( ___ , ___ )";
  document.getElementById("vert2Val").textContent = "V₂( ___ , ___ )";
  document.getElementById("aVal").textContent = "a = ___";
  document.getElementById("bVal").textContent = "b = ___";
  document.getElementById("cVal").textContent = "c = ___";
  document.getElementById("rVal").textContent = "r = ___";
  document.getElementById("eVal").textContent = "e = ___";
  document.getElementById("directrizVal").textContent = "y = ___";

  // Borrar el contenido del Canvas
  const canvas = document.getElementById("graphCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    // Pintar el fondo gris claro por defecto para tapar la gráfica anterior
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function limpiarPasosRut() {
  const container = document.getElementById("stepsContainer");
  const stepsSection = document.querySelector(".steps");

  if (container) {
    container.innerHTML = "";
  }

  if (stepsSection) {
    stepsSection.style.display = "none";
  }
}

function mostrarPasos(pasos) {
  const container = document.getElementById("stepsContainer");
  const stepsSection = document.querySelector(".steps");
  container.innerHTML = "";

  if (!pasos || pasos.length === 0) {
    limpiarPasosRut();
    return;
  }

  if (stepsSection) {
    stepsSection.style.display = "block";
  }

  pasos.forEach((paso, index) => {
    const stepDiv = document.createElement("div");
    stepDiv.className = "step";
    stepDiv.innerHTML = `
<span class="step-number">${index + 1}</span>
<span class="step-content">${paso}</span>
`;
    container.appendChild(stepDiv);
  });
}

async function procesarEcuacion(cuerpo, dv, requestId) {
  try {
    const response = await fetch("/api/procesar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cuerpo: cuerpo,
        digito_verificador: dv,
      }),
    });

    const respData = await response.json();

    if (requestId !== validationRequestId) return;

    if (respData.error) {
      alert("Error: " + respData.error);
      console.error("Error details:", respData.traceback);
      return;
    }

    currentData = respData;
    actualizarUI(respData);
    dibujarGrafica(respData);
  } catch (error) {
    if (requestId !== validationRequestId) return;
    console.error("Error:", error);
    alert("Error procesando la ecuación: " + error.message);
  }
}

function actualizarUI(data) {
  document.getElementById("equationDisplay").textContent = data.ecuacion;

  const tipo = data.tipo_conica;
  const items = document.querySelectorAll(".classification-item");
  items.forEach((item, index) => {
    item.classList.remove("active");
    if (index === conicTypes[tipo]) {
      item.classList.add("active");
    }
  });

  const h = data.h !== undefined ? data.h : 0;
  const k = data.k !== undefined ? data.k : 0;
  document.getElementById("params").innerHTML =
    `h = ${h.toFixed(2)}<br>k = ${k.toFixed(2)}`;

  // Limpiar valores previos antes de llenar
  document.getElementById("centroVal").textContent = "C( ___ , ___ )";
  document.getElementById("focos1Val").textContent = "F₁( ___ , ___ )";
  document.getElementById("focos2Val").textContent = "F₂( ___ , ___ )";
  document.getElementById("vert1Val").textContent = "V₁( ___ , ___ )";
  document.getElementById("vert2Val").textContent = "V₂( ___ , ___ )";
  document.getElementById("aVal").textContent = "a = ___";
  document.getElementById("bVal").textContent = "b = ___";
  document.getElementById("cVal").textContent = "c = ___";
  document.getElementById("rVal").textContent = "r = ___";
  document.getElementById("eVal").textContent = "e = ___";
  document.getElementById("directrizVal").textContent = "y = ___";

  if (tipo === "Circunferencia") {
    document.getElementById("centroVal").textContent =
      `C( ${data.centro[0].toFixed(2)}, ${data.centro[1].toFixed(2)} )`;
    document.getElementById("rVal").textContent =
      `r = ${data.radio.toFixed(2)}`;
  } else if (tipo === "Elipse") {
    document.getElementById("centroVal").textContent =
      `C( ${data.centro[0].toFixed(2)}, ${data.centro[1].toFixed(2)} )`;
    if (data.focos && data.focos.length >= 2) {
      document.getElementById("focos1Val").textContent =
        `F₁( ${data.focos[0][0].toFixed(2)}, ${data.focos[0][1].toFixed(2)} )`;
      document.getElementById("focos2Val").textContent =
        `F₂( ${data.focos[1][0].toFixed(2)}, ${data.focos[1][1].toFixed(2)} )`;
    }
    if (data.vertices && data.vertices.length >= 2) {
      document.getElementById("vert1Val").textContent =
        `V₁( ${data.vertices[0][0].toFixed(2)}, ${data.vertices[0][1].toFixed(2)} )`;
      document.getElementById("vert2Val").textContent =
        `V₂( ${data.vertices[1][0].toFixed(2)}, ${data.vertices[1][1].toFixed(2)} )`;
    }
    document.getElementById("aVal").textContent = `a = ${data.a.toFixed(2)}`;
    document.getElementById("bVal").textContent = `b = ${data.b.toFixed(2)}`;
    document.getElementById("cVal").textContent = `c = ${data.c.toFixed(2)}`;
    document.getElementById("eVal").textContent =
      `e = ${data.excentricidad.toFixed(2)}`;
  } else if (tipo === "Hipérbola") {
    document.getElementById("centroVal").textContent =
      `C( ${data.centro[0].toFixed(2)}, ${data.centro[1].toFixed(2)} )`;
    if (data.focos && data.focos.length >= 2) {
      document.getElementById("focos1Val").textContent =
        `F₁( ${data.focos[0][0].toFixed(2)}, ${data.focos[0][1].toFixed(2)} )`;
      document.getElementById("focos2Val").textContent =
        `F₂( ${data.focos[1][0].toFixed(2)}, ${data.focos[1][1].toFixed(2)} )`;
    }
    if (data.vertices && data.vertices.length >= 2) {
      document.getElementById("vert1Val").textContent =
        `V₁( ${data.vertices[0][0].toFixed(2)}, ${data.vertices[0][1].toFixed(2)} )`;
      document.getElementById("vert2Val").textContent =
        `V₂( ${data.vertices[1][0].toFixed(2)}, ${data.vertices[1][1].toFixed(2)} )`;
    }
    document.getElementById("aVal").textContent = `a = ${data.a.toFixed(2)}`;
    document.getElementById("bVal").textContent = `b = ${data.b.toFixed(2)}`;
    document.getElementById("cVal").textContent = `c = ${data.c.toFixed(2)}`;
    document.getElementById("eVal").textContent =
      `e = ${data.excentricidad.toFixed(2)}`;
  } else if (tipo === "Parábola") {
    document.getElementById("centroVal").textContent =
      `V( ${data.vertice[0].toFixed(2)}, ${data.vertice[1].toFixed(2)} )`;
    document.getElementById("focos1Val").textContent =
      `F( ${data.foco[0].toFixed(2)}, ${data.foco[1].toFixed(2)} )`;
    document.getElementById("directrizVal").textContent =
      `${data.directriz.toFixed(2)}`;
    document.getElementById("aVal").textContent = `p = ${data.p.toFixed(2)}`;
  }
}

function dibujarGrafica(data) {
  const canvas = document.getElementById("graphCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = 30;

  // Limpiar canvas
  ctx.fillStyle = "#f8f9fa";
  ctx.fillRect(0, 0, width, height);

  // Dibujar cuadrícula
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 0.5;
  for (let i = -10; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(centerX + i * scale, 0);
    ctx.lineTo(centerX + i * scale, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, centerY + i * scale);
    ctx.lineTo(width, centerY + i * scale);
    ctx.stroke();
  }

  // Dibujar ejes
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  const tipo = data.tipo_conica;
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 2.5;

  if (!data.puntos_grafica) {
    console.warn("No se generaron puntos para la gráfica");
    return;
  }

  if (tipo === "Circunferencia" || tipo === "Elipse") {
    const puntos = data.puntos_grafica;
    if (puntos.x && puntos.y_pos && puntos.y_neg) {
      ctx.beginPath();
      for (let i = 0; i < puntos.x.length; i++) {
        const x = centerX + puntos.x[i] * scale;
        const y = centerY - puntos.y_pos[i] * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let i = puntos.x.length - 1; i >= 0; i--) {
        const x = centerX + puntos.x[i] * scale;
        const y = centerY - puntos.y_neg[i] * scale;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  } else if (tipo === "Parábola") {
    const puntos = data.puntos_grafica;
    if (puntos.x && puntos.y_pos) {
      ctx.beginPath();
      for (let i = 0; i < puntos.x.length; i++) {
        const x = centerX + puntos.x[i] * scale;
        const y = centerY - puntos.y_pos[i] * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else if (tipo === "Hipérbola") {
    const puntos = data.puntos_grafica;
    if (puntos.rama_izq && puntos.rama_izq.x) {
      ctx.beginPath();
      for (let i = 0; i < puntos.rama_izq.x.length; i++) {
        const x = centerX + puntos.rama_izq.x[i] * scale;
        const y = centerY - puntos.rama_izq.y[i] * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    if (puntos.rama_der && puntos.rama_der.x) {
      ctx.beginPath();
      for (let i = 0; i < puntos.rama_der.x.length; i++) {
        const x = centerX + puntos.rama_der.x[i] * scale;
        const y = centerY - puntos.rama_der.y[i] * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  // Dibujar centro/vértice
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  let cx, cy;
  if (tipo === "Parábola") {
    cx = data.vertice[0] * scale;
    cy = data.vertice[1] * scale;
  } else {
    cx = (data.h !== undefined ? data.h : 0) * scale;
    cy = (data.k !== undefined ? data.k : 0) * scale;
  }
  ctx.arc(centerX + cx, centerY - cy, 4, 0, 2 * Math.PI);
  ctx.fill();
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

const rutInputElement = document.getElementById("rutInput");
if (rutInputElement) {
  rutInputElement.addEventListener("input", () => {
    validationRequestId++;
    limpiarUI();
    limpiarPasosRut();
    document.getElementById("resultBox").style.display = "none";
  });
}

limpiarPasosRut();
