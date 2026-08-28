const codeInput = document.getElementById("code-input");

const codeOutput = document.getElementById("code-output");

const formatButton = document.getElementById("format-button");

const copyButton = document.getElementById("copy-code");


function formatCode(code) {

    let formatted = "";

    let indent = 0;

    const lines = code
        .replace(/>\s*</g, "><")
        .replace(/;/g, ";\n")
        .replace(/{/g, "{\n")
        .replace(/}/g, "\n}\n")
        .split("\n");


    lines.forEach(function(line) {

        line = line.trim();

        if (line === "") {
            return;
        }


        if (line.startsWith("}")) {
            indent--;
        }


        formatted +=
            "    ".repeat(Math.max(indent, 0)) +
            line +
            "\n";


        if (line.endsWith("{")) {
            indent++;
        }

    });


    return formatted.trim();

}


formatButton.addEventListener("click", function() {

    const code = codeInput.value;

    if (code.trim() === "") {

        codeOutput.textContent =
            "Pegá algún código primero.";

        return;

    }


    const formattedCode =
        formatCode(code);

    codeOutput.textContent =
        formattedCode;

});


copyButton.addEventListener("click", function() {

    const code =
        codeOutput.textContent;

    if (code.trim() === "") {
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