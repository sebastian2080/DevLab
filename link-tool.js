const linkText = document.getElementById("link-text");

const linkUrl = document.getElementById("link-url");

const linkTarget = document.getElementById("link-target");

const generateButton =
    document.getElementById("generate-link");

const linkOutput =
    document.getElementById("link-output");

const copyButton =
    document.getElementById("copy-link");


generateButton.addEventListener("click", function() {

    const text = linkText.value.trim();

    const url = linkUrl.value.trim();

    const target = linkTarget.value;


    if (text === "" || url === "") {

        linkOutput.textContent =
            "Completá el texto y la URL.";

        return;

    }


    let code =
        `<a href="${url}" target="${target}">${text}</a>`;


    if (target === "_blank") {

        code =
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;

    }


    linkOutput.textContent = code;

});


copyButton.addEventListener("click", function() {

    const code =
        linkOutput.textContent.trim();


    if (
        code === "" ||
        code === "Completá los campos para generar tu enlace."
    ) {

        return;

    }


    navigator.clipboard.writeText(code);

    copyButton.textContent =
        "✓ Copiado";


    setTimeout(function() {

        copyButton.textContent =
            "📋 Copiar";

    }, 1500);

});