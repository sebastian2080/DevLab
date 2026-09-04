import { auth, db } from "./firebase-config.js";
import { doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initAuthNav } from "./sync.js";

initAuthNav();

const missions = [
    {
        id: "git_01",
        title: "1. Iniciar Repositorio",
        targetDesc: "Inicializá un nuevo repositorio Git.",
        valid: (cmd) => cmd === "git init",
        output: "Initialized empty Git repository in /workspace/devlab/mi-proyecto/.git/"
    },
    {
        id: "git_02",
        title: "2. Revisar Estado",
        targetDesc: "Consultá el estado de los archivos en la carpeta.",
        valid: (cmd) => cmd === "git status",
        output: "On branch main\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\tindex.html\n\tstyle.css"
    },
    {
        id: "git_03",
        title: "3. Staging Area",
        targetDesc: "Agregá todos los archivos al área de preparación.",
        valid: (cmd) => cmd === "git add ." || cmd === "git add -A",
        output: "Changes to be committed:\n\tnew file: index.html\n\tnew file: style.css"
    },
    {
        id: "git_04",
        title: "4. Crear Commit",
        targetDesc: "Hacé un commit con un mensaje descriptivo.",
        valid: (cmd) => cmd.startsWith("git commit -m") && cmd.length > 16,
        output: "[main (root-commit) 8f3c1a2] feat: initial commit devlab\n 2 files changed, 45 insertions(+)"
    },
    {
        id: "git_05",
        title: "5. Crear Rama",
        targetDesc: "Creá y pasate a una nueva rama llamada 'feature'.",
        valid: (cmd) => cmd === "git checkout -b feature" || cmd === "git switch -c feature",
        output: "Switched to a new branch 'feature'"
    },
    {
        id: "git_06",
        title: "6. Push Remoto",
        targetDesc: "Subí los cambios a la rama principal de GitHub.",
        valid: (cmd) => cmd === "git push origin main" || cmd === "git push -u origin main" || cmd === "git push",
        output: "Enumerating objects: 4, done.\nTo https://github.com/usuario/mi-proyecto.git\n * [new branch]      main -> main"
    }
];

let currentMissionIndex = 0;
const terminalScreen = document.getElementById("terminal-screen");
const cliInput = document.getElementById("cli-input");

function appendLog(text, className = "") {
    const entry = document.createElement("div");
    entry.className = `log-entry ${className}`;
    entry.textContent = text;
    terminalScreen.appendChild(entry);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function updateMissionUI() {
    missions.forEach((m, idx) => {
        const el = document.getElementById(`mission-${idx}`);
        if (!el) return;

        el.classList.remove("active", "completed");
        const icon = el.querySelector(".status-icon");

        if (idx < currentMissionIndex) {
            el.classList.add("completed");
            icon.textContent = "🟢";
        } else if (idx === currentMissionIndex) {
            el.classList.add("active");
            icon.textContent = "🟡";
        } else {
            icon.textContent = "⚪";
        }
    });
}

cliInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const rawCmd = cliInput.value.trim();
        if (!rawCmd) return;

        appendLog(`devlab@git:~$ ${rawCmd}`, "log-cmd");
        cliInput.value = "";

        if (rawCmd.toLowerCase() === "clear") {
            terminalScreen.innerHTML = "";
            return;
        }

        if (rawCmd.toLowerCase() === "help") {
            appendLog("Comandos soportados en el laboratorio:\n- git init\n- git status\n- git add .\n- git commit -m \"...\"\n- git checkout -b feature\n- git push origin main\n- clear", "log-entry");
            return;
        }

        const currentMission = missions[currentMissionIndex];

        if (currentMission && currentMission.valid(rawCmd)) {
            appendLog(currentMission.output, "log-success");
            appendLog(`✔ ¡Misión ${currentMissionIndex + 1} completada con éxito!`, "log-success");

           
            const user = auth.currentUser;
            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    await updateDoc(userRef, {
                        completedGitMissions: arrayUnion(currentMission.id)
                    });
                } catch (err) {
                    console.error("Error guardando progreso Git:", err);
                }
            }

            currentMissionIndex++;
            if (currentMissionIndex < missions.length) {
                updateMissionUI();
                appendLog(`\n👉 Siguiente objetivo: ${missions[currentMissionIndex].targetDesc}`, "log-entry");
            } else {
                updateMissionUI();
                appendLog("\n🏆 ¡FELICITACIONES! Completaste todas las misiones del simulador de Git.", "log-success");
            }
        } else {
            appendLog(`git: comando no coincide con el objetivo actual.\nObjetivo: ${currentMission ? currentMission.targetDesc : "Todas completadas"}`, "log-error");
        }
    }
});

updateMissionUI();