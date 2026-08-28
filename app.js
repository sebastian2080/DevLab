const previewCard = document.getElementById("preview-card");

// CONTROLES
const backgroundColorInput = document.getElementById("background-color");

const widthInput = document.getElementById("card-width");
const widthValue = document.getElementById("width-value");

const radiusInput = document.getElementById("border-radius");
const radiusValue = document.getElementById("radius-value");

const paddingInput = document.getElementById("padding");
const paddingValue = document.getElementById("padding-value");

const resetButton = document.getElementById("reset-button");

// CÓDIGO
const generatedCode = document.getElementById("generated-code");
const copyButton = document.getElementById("copy-button");


// =========================
// ACTUALIZAR CÓDIGO
// =========================

function updateCode() {

    const width = widthInput.value;
    const radius = radiusInput.value;
    const padding = paddingInput.value;
    const backgroundColor = backgroundColorInput.value;

    generatedCode.textContent = `#preview-card {
    width: ${width}px;
    padding: ${padding}px;
    background-color: ${backgroundColor};
    border-radius: ${radius}px;
}`;
}


// =========================
// COLOR
// =========================

backgroundColorInput.addEventListener("input", function () {

    previewCard.style.backgroundColor =
        backgroundColorInput.value;

    updateCode();
});


// =========================
// ANCHO
// =========================

widthInput.addEventListener("input", function () {

    const width = widthInput.value;

    previewCard.style.width = width + "px";

    widthValue.textContent = width + "px";

    updateCode();
});


// =========================
// BORDER RADIUS
// =========================

radiusInput.addEventListener("input", function () {

    const radius = radiusInput.value;

    previewCard.style.borderRadius = radius + "px";

    radiusValue.textContent = radius + "px";

    updateCode();
});


// =========================
// PADDING
// =========================

paddingInput.addEventListener("input", function () {

    const padding = paddingInput.value;

    previewCard.style.padding = padding + "px";

    paddingValue.textContent = padding + "px";

    updateCode();
});


// =========================
// RESTABLECER
// =========================

resetButton.addEventListener("click", function () {

    backgroundColorInput.value = "#6366f1";
    widthInput.value = 320;
    radiusInput.value = 20;
    paddingInput.value = 24;

    previewCard.style.backgroundColor = "#6366f1";
    previewCard.style.width = "320px";
    previewCard.style.borderRadius = "20px";
    previewCard.style.padding = "24px";

    widthValue.textContent = "320px";
    radiusValue.textContent = "20px";
    paddingValue.textContent = "24px";

    updateCode();
});


// =========================
// COPIAR CSS
// =========================

copyButton.addEventListener("click", function () {

    navigator.clipboard.writeText(
        generatedCode.textContent
    );

    copyButton.textContent = "✓ Copiado";

    setTimeout(function () {

        copyButton.textContent = "📋 Copiar CSS";

    }, 1500);
});


// =========================
// EXPLICACIONES
// =========================

const infoButtons =
    document.querySelectorAll(".info-button");

const infoTitle =
    document.getElementById("info-title");

const infoText =
    document.getElementById("info-text");


const info = {

    width: {
        title: "Width",
        text: "Define el ancho de un elemento. En este laboratorio determina qué tan ancha es la tarjeta."
    },

    "background-color": {
        title: "Background Color",
        text: "Define el color de fondo de un elemento."
    },

    "border-radius": {
        title: "Border Radius",
        text: "Permite redondear las esquinas de un elemento. Cuanto mayor sea el valor, más redondeadas serán."
    },

    padding: {
        title: "Padding",
        text: "Define el espacio interno entre el contenido de un elemento y sus bordes."
    }

};


infoButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const property = button.dataset.info;

        if (info[property]) {

            infoTitle.textContent =
                info[property].title;

            infoText.textContent =
                info[property].text;
        }

    });

});


// =========================
// DESAFÍO 01
// BORDER RADIUS
// =========================

const challengeButton1 =
    document.getElementById("challenge-button");

const challengeResult1 =
    document.getElementById("challenge-result");

const challenge1 =
    document.querySelector('[data-challenge="1"]');


if (challengeButton1) {

    challengeButton1.addEventListener("click", function() {

        const radius =
            Number(radiusInput.value);

        if (radius === 50) {

            challengeResult1.textContent =
                "🎉 ¡Desafío completado!";

            challenge1.classList.add("completed");

            challengeButton1.textContent =
                "✓ Completado";

        } else {

            challengeResult1.textContent =
                "Todavía no. Llevá el border-radius a 50px.";

            challenge1.classList.remove("completed");

            challengeButton1.textContent =
                "Comprobar desafío";
        }

    });

}


// =========================
// DESAFÍO 02
// WIDTH
// =========================

const challengeButton2 =
    document.getElementById("challenge-button-2");

const challengeResult2 =
    document.getElementById("challenge-result-2");

const challenge2 =
    document.querySelector('[data-challenge="2"]');


if (challengeButton2) {

    challengeButton2.addEventListener("click", function() {

        const width =
            Number(widthInput.value);

        if (width === 450) {

            challengeResult2.textContent =
                "🎉 ¡Desafío completado!";

            challenge2.classList.add("completed");

            challengeButton2.textContent =
                "✓ Completado";

        } else {

            challengeResult2.textContent =
                "Todavía no. Llevá el width a 450px.";

            challenge2.classList.remove("completed");

            challengeButton2.textContent =
                "Comprobar desafío";
        }

    });

}


// =========================
// INICIO
// =========================

updateCode();