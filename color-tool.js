const colorPicker = document.getElementById("color-picker");

const colorPreview = document.getElementById("color-preview");

const hexValue = document.getElementById("hex-value");

const rgbValue = document.getElementById("rgb-value");

const copyButtons = document.querySelectorAll(".copy-color");


function updateColor() {

    const hex = colorPicker.value;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const rgb = `rgb(${r}, ${g}, ${b})`;

    colorPreview.style.backgroundColor = hex;

    hexValue.textContent = hex.toUpperCase();

    rgbValue.textContent = rgb;

}


colorPicker.addEventListener("input", updateColor);


copyButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        let value;

        if (button.dataset.copy === "hex") {

            value = hexValue.textContent;

        } else {

            value = rgbValue.textContent;

        }

        navigator.clipboard.writeText(value);

        button.textContent = "✓ Copiado";

        setTimeout(function() {

            button.textContent = "Copiar";

        }, 1500);

    });

});


updateColor();