const canvas = document.getElementById("html-canvas");
const generatedHTML = document.getElementById("generated-html");

const addTitle = document.getElementById("add-title");
const addText = document.getElementById("add-text");
const addButton = document.getElementById("add-button");
const addImage = document.getElementById("add-image");
const addLink = document.getElementById("add-link");

const clearContent = document.getElementById("clear-content");
const copyHTML = document.getElementById("copy-html");

const selectedTag = document.getElementById("selected-tag");

const buttonAttribute = document.getElementById("button-attribute");
const imageAttribute = document.getElementById("image-attribute");
const linkAttribute = document.getElementById("link-attribute");

const buttonText = document.getElementById("button-text");
const imageAlt = document.getElementById("image-alt");

const linkText = document.getElementById("link-text");
const linkURL = document.getElementById("link-url");


// =========================
// MENSAJE VACÍO
// =========================

function removeEmptyMessage() {

    const emptyMessage = canvas.querySelector(".empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }
}


function showEmptyMessage() {

    if (canvas.children.length === 0) {

        canvas.innerHTML = `
            <p class="empty-message">
                Tu página está vacía.
                <br>
                Agregá un elemento.
            </p>
        `;
    }
}


// =========================
// ACTUALIZAR HTML GENERADO
// =========================

function updateCode() {

    let code = "";

    const elements = canvas.children;

    for (let element of elements) {

        if (element.classList.contains("empty-message")) {
            continue;
        }

        // Si es un contenedor de imagen
        if (element.classList.contains("image-wrapper")) {

            const image = element.querySelector("img");

            if (image) {

                const clone = image.cloneNode(true);

                code += clone.outerHTML + "\n";
            }

            continue;
        }


        const clone = element.cloneNode(true);

        // Sacamos las X
        clone.querySelectorAll(".delete-element").forEach(button => {
            button.remove();
        });

        // Sacamos contenteditable
        clone.removeAttribute("contenteditable");

        clone.querySelectorAll("*").forEach(child => {
            child.removeAttribute("contenteditable");
        });

        code += clone.outerHTML + "\n";
    }

    generatedHTML.textContent = code;
}


// =========================
// BOTÓN X
// =========================

function addDeleteButton(element) {

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "×";
    deleteButton.className = "delete-element";
    deleteButton.type = "button";

deleteButton.setAttribute("aria-label", "Eliminar este elemento");
deleteButton.setAttribute("title", "Eliminar este elemento");
    deleteButton.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();

        element.remove();

        showEmptyMessage();
        updateCode();
    });


    element.addEventListener("mouseenter", function() {

        if (!element.contains(deleteButton)) {
            element.appendChild(deleteButton);
        }

    });


    element.addEventListener("mouseleave", function() {

        if (deleteButton.parentElement === element) {
            deleteButton.remove();
        }

    });
}


// =========================
// ELEMENTOS EDITABLES
// =========================

function makeEditable(element) {

    element.contentEditable = true;


    element.addEventListener("input", function() {
        updateCode();
    });


    element.addEventListener("focus", function() {
        element.classList.add("editing");
    });


    element.addEventListener("blur", function() {
        element.classList.remove("editing");
    });


    element.addEventListener("click", function(event) {

        if (event.target.classList.contains("delete-element")) {
            return;
        }


        if (selectedTag) {

            selectedTag.textContent =
                `<${element.tagName.toLowerCase()}>`;
        }


        // BOTÓN
        if (element.tagName === "BUTTON") {

            if (buttonAttribute) {
                buttonAttribute.style.display = "block";
            }

            if (imageAttribute) {
                imageAttribute.style.display = "none";
            }

            if (linkAttribute) {
                linkAttribute.style.display = "none";
            }


            if (buttonText) {

                buttonText.value = element.textContent;

                buttonText.oninput = function() {

                    element.textContent = buttonText.value;

                    updateCode();
                };
            }
        }


        // IMAGEN
        else if (element.tagName === "IMG") {

            if (buttonAttribute) {
                buttonAttribute.style.display = "none";
            }

            if (imageAttribute) {
                imageAttribute.style.display = "block";
            }

            if (linkAttribute) {
                linkAttribute.style.display = "none";
            }


            if (imageAlt) {

                imageAlt.value = element.alt;

                imageAlt.oninput = function() {

                    element.alt = imageAlt.value;

                    updateCode();
                };
            }
        }


        // ENLACE
        else if (element.tagName === "A") {

            if (buttonAttribute) {
                buttonAttribute.style.display = "none";
            }

            if (imageAttribute) {
                imageAttribute.style.display = "none";
            }

            if (linkAttribute) {
                linkAttribute.style.display = "block";
            }


            if (linkText) {

                linkText.value = element.textContent;

                linkText.oninput = function() {

                    element.textContent = linkText.value;

                    updateCode();
                };
            }


            if (linkURL) {

                linkURL.value = element.getAttribute("href") || "";

                linkURL.oninput = function() {

                    element.href = linkURL.value;

                    updateCode();
                };
            }
        }

    });


    addDeleteButton(element);
}


// =========================
// AGREGAR TÍTULO
// =========================

addTitle.addEventListener("click", function() {

    removeEmptyMessage();

    const title = document.createElement("h1");

    title.textContent = "Mi título";

    canvas.appendChild(title);

    makeEditable(title);

    updateCode();
});


// =========================
// AGREGAR PÁRRAFO
// =========================

addText.addEventListener("click", function() {

    removeEmptyMessage();

    const paragraph = document.createElement("p");

    paragraph.textContent =
        "Este es un párrafo creado con HTML.";

    canvas.appendChild(paragraph);

    makeEditable(paragraph);

    updateCode();
});


// =========================
// AGREGAR BOTÓN
// =========================

addButton.addEventListener("click", function() {

    removeEmptyMessage();

    const button = document.createElement("button");

    button.textContent = "Mi botón";

    canvas.appendChild(button);

    makeEditable(button);

    updateCode();
});


// =========================
// AGREGAR IMAGEN
// =========================

addImage.addEventListener("click", function() {

    removeEmptyMessage();


    // Creamos un contenedor
    const wrapper = document.createElement("div");

    wrapper.className = "image-wrapper";


    // Creamos imagen
    const image = document.createElement("img");

    image.src = "https://placehold.co/300x150";
    image.alt = "Imagen de ejemplo";


    wrapper.appendChild(image);

    canvas.appendChild(wrapper);


    // X para eliminar
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "×";
    deleteButton.className = "delete-element";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Eliminar imagen");
deleteButton.setAttribute("title", "Eliminar imagen");


    deleteButton.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();

        wrapper.remove();

        showEmptyMessage();
        updateCode();
    });


    wrapper.addEventListener("mouseenter", function() {

        if (!wrapper.contains(deleteButton)) {
            wrapper.appendChild(deleteButton);
        }

    });


    wrapper.addEventListener("mouseleave", function() {

        if (deleteButton.parentElement === wrapper) {
            deleteButton.remove();
        }

    });


    // Editar ALT haciendo click en la imagen
    image.addEventListener("click", function(event) {

        event.stopPropagation();

        if (selectedTag) {
            selectedTag.textContent = "<img>";
        }


        if (buttonAttribute) {
            buttonAttribute.style.display = "none";
        }

        if (imageAttribute) {
            imageAttribute.style.display = "block";
        }

        if (linkAttribute) {
            linkAttribute.style.display = "none";
        }


        if (imageAlt) {

            imageAlt.value = image.alt;

            imageAlt.oninput = function() {

                image.alt = imageAlt.value;

                updateCode();
            };
        }

    });


    updateCode();
});


// =========================
// AGREGAR ENLACE
// =========================

addLink.addEventListener("click", function() {

    removeEmptyMessage();

    const link = document.createElement("a");

    link.textContent = "Mi enlace";

    link.href = "https://www.google.com";

    link.target = "_blank";

    canvas.appendChild(link);

    makeEditable(link);

    updateCode();
});


// =========================
// LIMPIAR
// =========================

clearContent.addEventListener("click", function() {

    canvas.innerHTML = `
        <p class="empty-message">
            Tu página está vacía.
            <br>
            Agregá un elemento.
        </p>
    `;


    // Ocultamos los atributos
    if (buttonAttribute) {
        buttonAttribute.style.display = "none";
    }

    if (imageAttribute) {
        imageAttribute.style.display = "none";
    }

    if (linkAttribute) {
        linkAttribute.style.display = "none";
    }


    updateCode();
});


// =========================
// COPIAR HTML
// =========================

copyHTML.addEventListener("click", function() {

    navigator.clipboard.writeText(
        generatedHTML.textContent
    );


    copyHTML.textContent = "✓ Copiado";


    setTimeout(function() {

        copyHTML.textContent = "📋 Copiar HTML";

    }, 1500);
});


// =========================
// INICIO
// =========================

updateCode();