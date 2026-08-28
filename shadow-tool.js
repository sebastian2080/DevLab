const offsetX = document.getElementById("offset-x");
const offsetY = document.getElementById("offset-y");
const blurRadius = document.getElementById("blur-radius");
const spreadRadius = document.getElementById("spread-radius");
const shadowOpacity = document.getElementById("shadow-opacity");
const shadowInset = document.getElementById("shadow-inset");

const offsetXVal = document.getElementById("offset-x-val");
const offsetYVal = document.getElementById("offset-y-val");
const blurRadiusVal = document.getElementById("blur-radius-val");
const spreadRadiusVal = document.getElementById("spread-radius-val");
const shadowOpacityVal = document.getElementById("shadow-opacity-val");

const shadowTarget = document.getElementById("shadow-target");
const shadowOutput = document.getElementById("shadow-output");
const copyButton = document.getElementById("copy-shadow");


function updateShadow() {
    const x = offsetX.value;
    const y = offsetY.value;
    const blur = blurRadius.value;
    const spread = spreadRadius.value;
    const opacity = (shadowOpacity.value / 100).toFixed(2);
    const isInset = shadowInset.checked ? "inset " : "";

    offsetXVal.textContent = x + "px";
    offsetYVal.textContent = y + "px";
    blurRadiusVal.textContent = blur + "px";
    spreadRadiusVal.textContent = spread + "px";
    shadowOpacityVal.textContent = shadowOpacity.value + "%";

    const shadowRule = `${isInset}${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`;

    shadowTarget.style.boxShadow = shadowRule;
    shadowOutput.textContent = `box-shadow: ${shadowRule};`;
}


[offsetX, offsetY, blurRadius, spreadRadius, shadowOpacity].forEach(input => {
    input.addEventListener("input", updateShadow);
});

shadowInset.addEventListener("change", updateShadow);


copyButton.addEventListener("click", function() {
    const code = shadowOutput.textContent.trim();
    if (!code) return;

    navigator.clipboard.writeText(code);
    copyButton.textContent = "✓ Copiado";

    setTimeout(function() {
        copyButton.textContent = "📋 Copiar";
    }, 1500);
});


updateShadow();