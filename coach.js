



export async function askGlobalAI(userPrompt) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const prompt = userPrompt.toLowerCase().trim();

   
    if (prompt.includes("pista") || prompt.includes("estoy haciendo el desafío")) {
        if (prompt.includes("git")) {
            return "💡 <strong>Pista Git:</strong> Revisá los comandos clave: <code>git init</code>, <code>git status</code>, <code>git add .</code>, <code>git commit -m 'mensaje'</code>, <code>git checkout -b rama</code> o <code>git push origin main</code>.";
        }
        if (prompt.includes("javascript") || prompt.includes("js")) {
            return "💡 <strong>Pista JavaScript:</strong> Recordá declarar con <code>const</code> o <code>let</code>, seleccionar con <code>document.querySelector()</code> y abrir la consola con F12 para depurar.";
        }
        if (prompt.includes("css")) {
            return "💡 <strong>Pista CSS:</strong> Verificá si el selector apunta a clase (<code>.nombre</code>) o ID (<code>#nombre</code>), terminá cada regla con punto y coma (<code>;</code>) y para maquetar recordá usar Flexbox (<code>display: flex</code>).";
        }
        if (prompt.includes("html")) {
            return "💡 <strong>Pista HTML:</strong> Verificá la apertura y cierre de las etiquetas (ej. <code>&lt;p&gt;...&lt;/p&gt;</code>) y asegurate de que los atributos lleven comillas.";
        }
        return "💡 <strong>Pista:</strong> Leé detenidamente la consigna y verificá la sintaxis en el editor.";
    }

   
    if (prompt.includes("git") || prompt.includes("commit") || prompt.includes("push") || prompt.includes("branch")) {
        return "Git es el sistema de control de versiones. Guardás puntos con <code>git commit</code> y sincronizás con GitHub usando <code>git push</code>.";
    }

    if (prompt.includes("js") || prompt.includes("javascript") || prompt.includes("let") || prompt.includes("const")) {
        return "JavaScript aporta interactividad. Usá <code>const</code> para valores fijos y <code>let</code> para variables reasignables.";
    }

    if (prompt.includes("css") || prompt.includes("flex") || prompt.includes("centrar")) {
        if (prompt.includes("centrar") || prompt.includes("flex")) {
            return "Para centrar con Flexbox en el padre aplicás:<br><code>display: flex;<br>justify-content: center;<br>align-items: center;</code>";
        }
        return "CSS define los estilos visuales y la maquetación responsiva.";
    }

    if (prompt.includes("html") || prompt.includes("etiqueta") || prompt.includes("div")) {
        return "HTML es el esqueleto de la web. Utilizá etiquetas semánticas (<code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;footer&gt;</code>) para mejorar accesibilidad y SEO.";
    }

    return `Sobre "<strong>${userPrompt}</strong>": Revisá la sintaxis o abrí la consola (F12) si algo no ejecuta. ¿Querés que revisemos HTML, CSS, JavaScript o Git?`;
}





function injectStackUI() {
    if (document.querySelector(".floating-stack-container")) return;

    const stack = document.createElement("div");
    stack.className = "floating-stack-container";
    stack.innerHTML = `
        <div id="coach-chat-window" class="coach-chat-window hidden">
            <div class="coach-header">
                <div class="coach-header-info">
                    <div class="coach-avatar">🤖</div>
                    <div>
                        <strong>DevBot</strong>
                        <span class="coach-status">● En línea</span>
                    </div>
                </div>
                <button id="coach-close-btn" class="coach-close-btn" type="button" aria-label="Cerrar chat">&times;</button>
            </div>
            <div id="coach-messages" class="coach-messages">
                <div class="coach-msg bot">
                    👋 ¡Hola! Soy tu asistente en <strong>DevLab</strong>. ¿Tenés dudas sobre HTML, CSS, JavaScript o Git?
                </div>
            </div>
            <div class="coach-chips">
                <button class="chip-btn" type="button" data-query="¿Cómo centrar un div en CSS?">Centrar div</button>
                <button class="chip-btn" type="button" data-query="¿Qué es una etiqueta semántica?">HTML semántico</button>
                <button class="chip-btn" type="button" data-query="¿Diferencia entre let y const?">let vs const</button>
                <button class="chip-btn" type="button" data-query="¿Cómo funciona Git?">Git básico</button>
            </div>
            <form id="coach-form" class="coach-input-area">
                <input type="text" id="coach-input" placeholder="Preguntale a DevBot..." autocomplete="off">
                <button type="submit" id="coach-send-btn">➔</button>
            </form>
        </div>
        <a href="playground.html" class="floating-btn-pill btn-pill-playground" aria-label="Abrir Playground de código">
            <span class="pill-icon">⚡</span>
            <span>Playground</span>
        </a>
        <button id="coach-toggle-btn" class="floating-btn-pill btn-pill-devbot" type="button" aria-label="Abrir DevBot IA">
            <span class="pill-icon">🤖</span>
            <span>DevBot IA</span>
        </button>
    `;
    document.body.appendChild(stack);
}

function postMsg(text, sender = "bot") {
    const messages = document.getElementById("coach-messages");
    if (!messages) return;
    const msgDiv = document.createElement("div");
    msgDiv.className = `coach-msg ${sender}`;
    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

export async function submitUserMessage(queryText) {
    const chatWindow = document.getElementById("coach-chat-window");
    const messages = document.getElementById("coach-messages");
    if (!chatWindow || !messages) return;

   
    chatWindow.classList.remove("hidden");

    postMsg(queryText, "user");

    const typingIndicator = document.createElement("div");
    typingIndicator.className = "coach-msg bot";
    typingIndicator.id = "coach-typing";
    typingIndicator.innerHTML = "<em>DevBot está pensando...</em>";
    messages.appendChild(typingIndicator);
    messages.scrollTop = messages.scrollHeight;

    try {
        const botResponse = await askGlobalAI(queryText);
        const typingEl = document.getElementById("coach-typing");
        if (typingEl) typingEl.remove();
        postMsg(botResponse, "bot");
    } catch {
        const typingEl = document.getElementById("coach-typing");
        if (typingEl) typingEl.remove();
        postMsg("Ocurrió un error. Probá de nuevo.", "bot");
    }
}

function setupChatListeners() {
    const toggleBtn = document.getElementById("coach-toggle-btn");
    const closeBtn = document.getElementById("coach-close-btn");
    const chatWindow = document.getElementById("coach-chat-window");
    const form = document.getElementById("coach-form");
    const input = document.getElementById("coach-input");

    if (toggleBtn && chatWindow) {
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            chatWindow.classList.toggle("hidden");
            if (!chatWindow.classList.contains("hidden") && input) input.focus();
        };
    }

    if (closeBtn && chatWindow) {
        closeBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            chatWindow.classList.add("hidden");
        };
    }

    if (form && input) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;
            input.value = "";
            await submitUserMessage(text);
        };
    }

    document.querySelectorAll(".chip-btn").forEach(chip => {
        chip.onclick = async () => {
            const q = chip.getAttribute("data-query");
            await submitUserMessage(q);
        };
    });
}


function detectTopic(card) {
    const path = window.location.pathname.toLowerCase();
    const docTitle = document.title.toLowerCase();
    const cardId = (card.id || "").toLowerCase();
    const cardClass = (card.className || "").toLowerCase();
    const cardText = (card.textContent || "").toLowerCase();

    if (path.includes("git") || docTitle.includes("git") || cardId.includes("git") || cardClass.includes("git")) {
        return "Git";
    }
    if (path.includes("css") || docTitle.includes("css") || cardId.includes("css") || cardClass.includes("css") || cardText.includes("css")) {
        return "CSS";
    }
    if (path.includes("js") || path.includes("javascript") || docTitle.includes("javascript") || cardId.includes("js") || cardClass.includes("js") || cardText.includes("javascript")) {
        return "JavaScript";
    }
    return "HTML";
}

export function injectCardsButtons() {
    const cards = document.querySelectorAll(
        "article[data-challenge], .html-challenge-card, .css-challenge-card, .js-challenge-card, .git-challenge-card, .challenge-card, .desafio-card, .challenge-box"
    );

    cards.forEach((card) => {
        if (card.querySelector(".btn-ask-coach-auto")) return;

        const titleEl = card.querySelector("strong, h2, h3, .challenge-info h2");
        const challengeTitle = titleEl ? titleEl.textContent.trim() : "este ejercicio";
        const topic = detectTopic(card);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-ask-coach btn-ask-coach-auto";
        btn.innerHTML = `<span>🤖</span> <span>Pedir pista</span>`;
        btn.style.margin = "0 8px 0 0";

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            askDevBotContext(challengeTitle, topic);
        };

        const btnCheck = card.querySelector(".btn-check");
        if (btnCheck && btnCheck.parentElement) {
            btnCheck.parentElement.insertBefore(btn, btnCheck);
        } else {
            const actions = card.querySelector(".challenge-action, .challenge-info, .card-actions, .actions") || card;
            actions.appendChild(btn);
        }
    });
}

export function askDevBotContext(challengeTitle, challengeTopic) {
    const promptText = `Estoy haciendo el desafío de ${challengeTopic}: "${challengeTitle}". ¿Me podés dar una pista sin darme el código resuelto directamente?`;
    submitUserMessage(promptText);
}

window.askDevBotContext = askDevBotContext;

function start() {
    injectStackUI();
    setupChatListeners();
    injectCardsButtons();

    const observer = new MutationObserver(() => {
        injectCardsButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}