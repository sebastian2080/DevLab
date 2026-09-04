
import { saveGameStats } from "./sync-games.js";

const CASES = [
    {
        title: "Caso 1: Botón no reacciona al clic",
        desc: "El botón tiene un error en la propiedad CSS de eventos que impide hacer clic.",
        brokenCode: `<button style="background: #6366f1; color: white; padding: 10px 20px; border: none; border-radius: 8px; pointer-events: none; cursor: pointer;">
  Enviar Datos
</button>`,
        solutionValidator: (code) => {
            return !code.includes("pointer-events: none") && code.includes("<button");
        }
    },
    {
        title: "Caso 2: Texto desbordado fuera de la tarjeta",
        desc: "El párrafo se escapa del contenedor porque no tiene permitido cortar palabras largas.",
        brokenCode: `<div style="width: 180px; background: #e2e8f0; padding: 12px; border-radius: 8px; white-space: nowrap;">
  <p style="margin:0; font-size:12px;">TextoExtremadamenteLargoQueDeberiaAjustarseAlContenedor</p>
</div>`,
        solutionValidator: (code) => {
            return !code.includes("white-space: nowrap") || code.includes("overflow-wrap: break-word") || code.includes("word-break: break-all");
        }
    },
    {
        title: "Caso 3: Elementos desalineados en el Navbar",
        desc: "Los elementos dentro del contenedor flexible no están centrados verticalmente.",
        brokenCode: `<div style="display: flex; align-items: flex-start; gap: 12px; background: #1e293b; padding: 10px; border-radius: 8px;">
  <span style="font-size: 24px;">🚀</span>
  <span style="color: white; font-weight: bold;">DevLab Rocket</span>
</div>`,
        solutionValidator: (code) => {
            return code.includes("align-items: center") || code.includes("align-items:center");
        }
    },
    {
        title: "Caso 4: Imagen distorsionada sin mantener proporción",
        desc: "La imagen pierde su relación de aspecto al forzar medidas sin ajuste de objeto.",
        brokenCode: `<img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100" style="width: 120px; height: 60px; object-fit: fill; border-radius: 8px;">`,
        solutionValidator: (code) => {
            return code.includes("object-fit: cover") || code.includes("object-fit: contain") || !code.includes("object-fit: fill");
        }
    }
];

let currentCaseIndex = 0;
let solvedCount = 0;

const caseCounterEl = document.getElementById("case-counter");
const statusLabelEl = document.getElementById("status-label");
const bugDescEl = document.getElementById("bug-description");
const previewArea = document.getElementById("preview-area");
const codeEditor = document.getElementById("code-editor");

const resetBtn = document.getElementById("reset-code-btn");
const applyBtn = document.getElementById("apply-code-btn");
const successBanner = document.getElementById("success-banner");
const nextCaseBtn = document.getElementById("next-case-btn");

const mainLayout = document.getElementById("main-inspector-layout");
const missionCompleteCard = document.getElementById("mission-complete-card");
const syncStatusEl = document.getElementById("sync-status");
const restartBtn = document.getElementById("restart-inspector-btn");

function loadCase(index) {
    const bugCase = CASES[index];
    caseCounterEl.textContent = `Caso ${index + 1} de ${CASES.length}`;
    caseCounterEl.className = "bug-badge";
    statusLabelEl.textContent = "🔴 Con Errores";
    statusLabelEl.style.color = "#ef4444";
    bugDescEl.textContent = bugCase.desc;
    
    codeEditor.value = bugCase.brokenCode;
    previewArea.innerHTML = bugCase.brokenCode;
    successBanner.style.display = "none";
    applyBtn.disabled = false;
}

function applyPatch() {
    const userCode = codeEditor.value;
    previewArea.innerHTML = userCode;

    const currentCase = CASES[currentCaseIndex];
    const isFixed = currentCase.solutionValidator(userCode);

    if (isFixed) {
        statusLabelEl.textContent = "🟢 Parche Aplicado";
        statusLabelEl.style.color = "#10b981";
        caseCounterEl.className = "bug-badge fixed-badge";
        successBanner.style.display = "flex";
        applyBtn.disabled = true;
        solvedCount++;
    } else {
        statusLabelEl.textContent = "❌ El bug persiste";
        statusLabelEl.style.color = "#ef4444";
    }
}

async function finishMission() {
    mainLayout.style.display = "none";
    successBanner.style.display = "none";
    missionCompleteCard.style.display = "block";
    syncStatusEl.textContent = "Sincronizando logros y puntuación...";

    try {
        const res = await saveGameStats("inspector", {
            score: 100
        });

        if (res) {
            syncStatusEl.textContent = "¡Misión registrada y logro 'Cazador de Bugs' evaluado! ✨";
            syncStatusEl.style.color = "#10b981";
        } else {
            syncStatusEl.textContent = "Modo invitado (Iniciá sesión para guardar tus medallas).";
            syncStatusEl.style.color = "#64748b";
        }
    } catch (e) {
        console.error("Error al guardar inspector:", e);
        syncStatusEl.textContent = "No se pudo sincronizar la puntuación.";
        syncStatusEl.style.color = "#ef4444";
    }
}

nextCaseBtn.addEventListener("click", () => {
    currentCaseIndex++;
    if (currentCaseIndex < CASES.length) {
        loadCase(currentCaseIndex);
    } else {
        finishMission();
    }
});

applyBtn.addEventListener("click", applyPatch);
resetBtn.addEventListener("click", () => {
    loadCase(currentCaseIndex);
});

restartBtn.addEventListener("click", () => {
    currentCaseIndex = 0;
    solvedCount = 0;
    missionCompleteCard.style.display = "none";
    mainLayout.style.display = "grid";
    loadCase(0);
});


loadCase(0);