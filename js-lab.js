const title = document.getElementById("js-title");
const message = document.getElementById("js-message");
const card = document.getElementById("js-card");

const changeText = document.getElementById("change-text");
const changeColor = document.getElementById("change-color");
const counterButton = document.getElementById("counter-button");

let counter = 0;


changeText.addEventListener("click", function () {

    title.textContent = "¡Cambiaste el contenido!";

    message.textContent =
        "JavaScript puede modificar elementos HTML.";

});


changeColor.addEventListener("click", function () {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    card.style.backgroundColor = randomColor;
});


counterButton.addEventListener("click", function () {

    counter++;

    document.getElementById("counter").textContent = counter;

});


