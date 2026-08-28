const valueInput = document.getElementById("unit-value");

const unitFrom = document.getElementById("unit-from");

const pxResult = document.getElementById("px-result");
const remResult = document.getElementById("rem-result");
const emResult = document.getElementById("em-result");
const percentResult = document.getElementById("percent-result");


function updateConversions() {

    const value = Number(valueInput.value);
    const unit = unitFrom.value;

    let px;


    // Convertir todo primero a PX

    if (unit === "px") {

        px = value;

    }

    if (unit === "rem") {

        px = value * 16;

    }

    if (unit === "em") {

        px = value * 16;

    }

    if (unit === "percent") {

        px = value * 16 / 100;

    }


    // Mostrar conversiones

    const rem = px / 16;

    const em = px / 16;

    const percent = (px / 16) * 100;


    pxResult.textContent =
        Number(px.toFixed(2)) + "px";

    remResult.textContent =
        Number(rem.toFixed(2)) + "rem";

    emResult.textContent =
        Number(em.toFixed(2)) + "em";

    percentResult.textContent =
        Number(percent.toFixed(2)) + "%";

}


valueInput.addEventListener(
    "input",
    updateConversions
);


unitFrom.addEventListener(
    "change",
    updateConversions
);


updateConversions();