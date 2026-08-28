import { initAuthNav } from "./sync.js";

initAuthNav();

const htmlInput = document.getElementById("html-code");
const cssInput = document.getElementById("css-code");
const jsInput = document.getElementById("js-code");
const previewFrame = document.getElementById("preview-frame");

const resetBtn = document.getElementById("reset-template-btn");
const clearBtn = document.getElementById("clear-all-btn");
const downloadBtn = document.getElementById("download-code-btn");

const starterTemplate = {
    html: `<div class="card">
  <h2>¡Hola DevLab! 🚀</h2>
  <p>Probá editar el HTML, CSS o JS para ver los cambios al instante.</p>
  <button id="counter-btn">Clics: 0</button>
</div>`,
    css: `body {
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background: #f8fafc;
  margin: 0;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  text-align: center;
  max-width: 320px;
}

button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s;
}

button:active {
  transform: scale(0.95);
}`,
    js: `let count = 0;
const btn = document.getElementById('counter-btn');

btn.addEventListener('click', () => {
  count++;
  btn.textContent = \`Clics: \${count}\`;
});`
};

// Renderizar el código combinado en el iframe
function updatePreview() {
    const html = htmlInput.value;
    const css = cssInput.value;
    const js = jsInput.value;

    const source = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>
                try {
                    ${js}
                } catch (err) {
                    console.error(err);
                }
            <\/script>
        </body>
        </html>
    `;

    previewFrame.srcdoc = source;

    // Guardar borrador local
    localStorage.setItem("devlab-playground-html", html);
    localStorage.setItem("devlab-playground-css", css);
    localStorage.setItem("devlab-playground-js", js);
}

// Cargar estado inicial o borrador previo
function loadInitialState() {
    htmlInput.value = localStorage.getItem("devlab-playground-html") ?? starterTemplate.html;
    cssInput.value = localStorage.getItem("devlab-playground-css") ?? starterTemplate.css;
    jsInput.value = localStorage.getItem("devlab-playground-js") ?? starterTemplate.js;
    updatePreview();
}

// Debounce para optimizar el tipeo rápido
let timeout = null;
function handleInput() {
    clearTimeout(timeout);
    timeout = setTimeout(updatePreview, 300);
}

htmlInput.addEventListener("input", handleInput);
cssInput.addEventListener("input", handleInput);
jsInput.addEventListener("input", handleInput);

// Botones de acción
resetBtn.addEventListener("click", () => {
    if (confirm("¿Restablecer el código de la plantilla base?")) {
        htmlInput.value = starterTemplate.html;
        cssInput.value = starterTemplate.css;
        jsInput.value = starterTemplate.js;
        updatePreview();
    }
});

clearBtn.addEventListener("click", () => {
    if (confirm("¿Vaciar todos los editores?")) {
        htmlInput.value = "";
        cssInput.value = "";
        jsInput.value = "";
        updatePreview();
    }
});

downloadBtn.addEventListener("click", () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyecto DevLab</title>
    <style>
${cssInput.value}
    </style>
</head>
<body>
${htmlInput.value}

    <script>
${jsInput.value}
    <\/script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devlab-proyecto.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

loadInitialState();