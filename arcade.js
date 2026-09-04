
import { saveGameStats } from "./sync-games.js";


const challengePool = [
    {
        prompt: "¿Qué etiqueta crea un enlace web?",
        code: '<___ href="https://devlab.com">Visitar</___>',
        options: ["a", "link", "url", "button"],
        correct: 0
    },
    {
        prompt: "Centrar contenido horizontal en Flexbox:",
        code: 'display: flex;\n___: center;',
        options: ["align-items", "justify-content", "text-align", "place-items"],
        correct: 1
    },
    {
        prompt: "Seleccionar por ID en JavaScript:",
        code: 'document.___\("mi-boton"\);',
        options: ["getElementById", "selectId", "queryId", "findId"],
        correct: 0
    },
    {
        prompt: "Ocultar un elemento sin eliminar su espacio:",
        code: 'visibility: ___;',
        options: ["none", "hidden", "collapse", "invisible"],
        correct: 1
    },
    {
        prompt: "Escuchar un clic en un botón:",
        code: 'boton.addEventListener\("___", ejecutar\);',
        options: ["click", "press", "onclick", "touch"],
        correct: 0
    },
    {
        prompt: "Espaciado interno de una caja:",
        code: '___: 20px;',
        options: ["margin", "padding", "border-spacing", "gap"],
        correct: 1
    },
    {
        prompt: "Convertir texto JSON a objeto en JS:",
        code: 'const data = JSON.___\(respuesta\);',
        options: ["stringify", "parse", "toObject", "convert"],
        correct: 1
    },
    {
        prompt: "Hacer un campo de solo lectura en HTML:",
        code: '<input type="text" ___>',
        options: ["disabled", "readonly", "static", "locked"],
        correct: 1
    },
    {
        prompt: "Declarar una constante inmutable en JS:",
        code: '___ PI = 3.1416;',
        options: ["let", "var", "const", "static"],
        correct: 2
    },
    {
        prompt: "Pasar todos los archivos modificados a Staging:",
        code: 'git add ___',
        options: [".", "*", "all", "-commit"],
        correct: 0
    },
    {
        prompt: "Cambiar el color del texto en CSS:",
        code: 'p {\n  ___: #ffffff;\n}',
        options: ["font-color", "text-color", "color", "textColor"],
        correct: 2
    },
    {
        prompt: "Crear una lista no ordenada (con viñetas):",
        code: '<___>\n  <li>Elemento</li>\n</___>',
        options: ["ol", "ul", "list", "dl"],
        correct: 1
    },
    {
        prompt: "Verificar tipo y valor estricto en JS:",
        code: 'if (edad ___ 18)',
        options: ["==", "=", "===", "equals"],
        correct: 2
    },
    {
        prompt: "Crear y posicionarse en una rama en Git:",
        code: 'git checkout -___ feature',
        options: ["n", "b", "r", "c"],
        correct: 1
    },
    {
        prompt: "Cambiar el grosor de la tipografía:",
        code: 'font-___: 700;',
        options: ["size", "style", "weight", "bold"],
        correct: 2
    },
    {
        prompt: "Obtener la cantidad de elementos de un array:",
        code: 'const total = items.___;',
        options: ["size", "count", "length", "total"],
        correct: 2
    },
    {
        prompt: "Atributo para texto alternativo en imágenes:",
        code: '<img src="foto.jpg" ___="Descripción">',
        options: ["title", "alt", "name", "desc"],
        correct: 1
    },
    {
        prompt: "Enviar commits locales a la nube:",
        code: 'git ___ origin main',
        options: ["push", "pull", "upload", "send"],
        correct: 0
    },
    {
        prompt: "Quitar el subrayado por defecto de un enlace:",
        code: 'text-decoration: ___;',
        options: ["hidden", "none", "transparent", "empty"],
        correct: 1
    },
    {
        prompt: "Imprimir mensajes de depuración en consola:",
        code: 'console.___\("Dato:", valor\);',
        options: ["print", "write", "log", "display"],
        correct: 2
    }
];

let timeLeft = 60;
let score = 0;
let streak = 0;
let multiplier = 1;
let timerInterval = null;
let currentQuestionIndex = 0;
let shuffledDeck = [];

const startScreen = document.getElementById("arcade-start");
const gameScreen = document.getElementById("arcade-game");
const resultScreen = document.getElementById("arcade-result");

const startBtn = document.getElementById("start-arcade-btn");
const retryBtn = document.getElementById("retry-arcade-btn");

const scoreDisplay = document.getElementById("arcade-score");
const timerDisplay = document.getElementById("arcade-timer");
const multiplierDisplay = document.getElementById("arcade-multiplier");
const streakDisplay = document.getElementById("arcade-streak");
const hudBar = document.getElementById("hud-bar");

const challengeCode = document.getElementById("challenge-code");
const challengePrompt = document.getElementById("challenge-prompt");
const optionsContainer = document.getElementById("arcade-options");

const finalScoreDisplay = document.getElementById("final-arcade-score");
const personalRecordMsg = document.getElementById("personal-record-msg");

startBtn.addEventListener("click", startArcade);
retryBtn.addEventListener("click", startArcade);

function startArcade() {
    score = 0;
    streak = 0;
    multiplier = 1;
    timeLeft = 60;
    
    scoreDisplay.textContent = "0";
    multiplierDisplay.textContent = "x1";
    streakDisplay.style.display = "none";
    timerDisplay.textContent = "60s";

    shuffledDeck = [...challengePool].sort(() => 0.5 - Math.random());
    currentQuestionIndex = 0;

    startScreen.style.display = "none";
    resultScreen.style.display = "none";
    gameScreen.style.display = "block";

    loadNextChallenge();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endArcade();
        }
    }, 1000);
}

function loadNextChallenge() {
    if (currentQuestionIndex >= shuffledDeck.length) {
        shuffledDeck = [...challengePool].sort(() => 0.5 - Math.random());
        currentQuestionIndex = 0;
    }

    const current = shuffledDeck[currentQuestionIndex];
    challengePrompt.textContent = current.prompt;
    challengeCode.textContent = current.code;
    optionsContainer.innerHTML = "";

    current.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.className = "arcade-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => handleAnswer(index, current.correct, btn));
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selectedIndex, correctIndex, buttonEl) {
    const buttons = optionsContainer.querySelectorAll(".arcade-btn");
    buttons.forEach(b => b.disabled = true);

    if (selectedIndex === correctIndex) {
        buttonEl.classList.add("correct-hit");
        
        streak++;
        if (streak >= 3) multiplier = 2;
        if (streak >= 6) multiplier = 3;
        if (streak >= 10) multiplier = 4;

        score += (100 * multiplier);
        scoreDisplay.textContent = score;
        multiplierDisplay.textContent = `x${multiplier}`;

        if (streak > 1) {
            streakDisplay.style.display = "inline-block";
            streakDisplay.textContent = `🔥 ${streak} seguidas`;
        }

        setTimeout(() => {
            currentQuestionIndex++;
            loadNextChallenge();
        }, 300);

    } else {
        buttonEl.classList.add("wrong-hit");
        buttons[correctIndex].classList.add("correct-hit");

        streak = 0;
        multiplier = 1;
        multiplierDisplay.textContent = "x1";
        streakDisplay.style.display = "none";

        timeLeft = Math.max(0, timeLeft - 3);
        timerDisplay.textContent = `${timeLeft}s`;

        hudBar.classList.add("time-penalty");
        setTimeout(() => hudBar.classList.remove("time-penalty"), 300);

        setTimeout(() => {
            currentQuestionIndex++;
            loadNextChallenge();
        }, 600);
    }
}

async function endArcade() {
    gameScreen.style.display = "none";
    resultScreen.style.display = "block";
    finalScoreDisplay.textContent = `${score} pts`;
    personalRecordMsg.textContent = "Sincronizando puntuación con DevLab...";

    if (score > 0) {
        try {
            const res = await saveGameStats("speedrun", {
                score: score
            });

            if (res && res.isNewMaxScore) {
                personalRecordMsg.textContent = "¡Nuevo récord personal registrado! 🏆";
                personalRecordMsg.style.color = "#16a34a";
            } else if (res) {
                personalRecordMsg.textContent = "Puntuación guardada con éxito.";
                personalRecordMsg.style.color = "#64748b";
            } else {
                personalRecordMsg.textContent = "Modo invitado (Iniciá sesión para rankear).";
                personalRecordMsg.style.color = "#64748b";
            }
        } catch (error) {
            console.error("Error al sincronizar speedrun:", error);
            personalRecordMsg.textContent = "No se pudo sincronizar la puntuación.";
            personalRecordMsg.style.color = "#ef4444";
        }
    } else {
        personalRecordMsg.textContent = "";
    }
}