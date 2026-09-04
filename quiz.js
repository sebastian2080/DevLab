import { auth, db } from "./firebase-config.js";
import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initAuthNav } from "./sync.js";

initAuthNav();

const questions = [
    {
        question: "¿Cuál es la etiqueta HTML semántica adecuada para la cabecera principal de un sitio?",
        options: ["<header>", "<top>", "<head>", "<section>"],
        correct: 0
    },
    {
        question: "¿Qué propiedad de CSS se utiliza para alinear elementos sobre el eje transversal en Flexbox?",
        options: ["justify-content", "align-items", "flex-direction", "grid-gap"],
        correct: 1
    },
    {
        question: "¿Qué método de Array en JavaScript devuelve un nuevo array transformado?",
        options: ["forEach()", "filter()", "map()", "push()"],
        correct: 2
    },
    {
        question: "¿Cómo se cancela el comportamiento por defecto de un formulario al enviarse en JS?",
        options: ["event.stop()", "event.preventDefault()", "form.cancel()", "return false;"],
        correct: 1
    },
    {
        question: "¿Cuál es el selector CSS con mayor especificidad entre los siguientes?",
        options: [".clase-ejemplo", "#id-unico", "div > p", "button:hover"],
        correct: 1
    }
];

let currentIndex = 0;
let score = 0;
let timeLeft = 15;
let timer = null;

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-quiz-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const questionProgress = document.getElementById("question-progress");
const timerDisplay = document.getElementById("timer-display");
const finalScore = document.getElementById("final-score");
const resultFeedback = document.getElementById("result-feedback");

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);

function startQuiz() {
    currentIndex = 0;
    score = 0;
    startScreen.style.display = "none";
    resultScreen.style.display = "none";
    gameScreen.style.display = "block";
    showQuestion();
}

function showQuestion() {
    clearInterval(timer);
    timeLeft = 15;
    updateTimerText();

    const currentQ = questions[currentIndex];
    questionProgress.textContent = `Pregunta ${currentIndex + 1} de ${questions.length}`;
    questionText.textContent = currentQ.question;
    optionsContainer.innerHTML = "";

    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.className = "quiz-opt-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => checkAnswer(index, btn));
        optionsContainer.appendChild(btn);
    });

    timer = setInterval(() => {
        timeLeft--;
        updateTimerText();
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoTimeOut();
        }
    }, 1000);
}

function updateTimerText() {
    timerDisplay.textContent = `⏱️ ${timeLeft}s`;
}

function checkAnswer(selectedIndex, selectedBtn) {
    clearInterval(timer);
    const correctIndex = questions[currentIndex].correct;
    const buttons = optionsContainer.querySelectorAll(".quiz-opt-btn");

    buttons.forEach(b => b.disabled = true);

    if (selectedIndex === correctIndex) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("wrong");
        buttons[correctIndex].classList.add("correct");
    }

    setTimeout(nextQuestion, 1200);
}

function autoTimeOut() {
    const correctIndex = questions[currentIndex].correct;
    const buttons = optionsContainer.querySelectorAll(".quiz-opt-btn");
    buttons.forEach(b => b.disabled = true);
    buttons[correctIndex].classList.add("correct");
    setTimeout(nextQuestion, 1200);
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

async function finishQuiz() {
    gameScreen.style.display = "none";
    resultScreen.style.display = "block";

    finalScore.textContent = `${score} / ${questions.length}`;

    if (score === questions.length) {
        resultFeedback.textContent = "🏆 ¡Excelente puntaje! Dominás los conceptos clave.";
    } else if (score >= 3) {
        resultFeedback.textContent = "👍 ¡Buen intento! Repasá los temas en la sección de Aprendizaje para llegar al 100%.";
    } else {
        resultFeedback.textContent = "📚 Te recomendamos repasar los conceptos teóricos y volver a intentarlo.";
    }

   
    const user = auth.currentUser;
    if (user) {
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                lastQuizScore: score,
                quizCompletedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error al guardar puntuación de Quiz:", error);
        }
    }
}