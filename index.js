// index.js

// Inicializar componentes interactivos de la Home
document.addEventListener("DOMContentLoaded", () => {
    initHeroDemo();
});

// Interactividad para la tarjeta de código del Hero
function initHeroDemo() {
    const previewBtn = document.querySelector(".hero-live-preview .preview-sample-btn");
    if (!previewBtn) return;

    previewBtn.addEventListener("mouseenter", () => {
        previewBtn.style.transform = "scale(1.05)";
    });

    previewBtn.addEventListener("mouseleave", () => {
        previewBtn.style.transform = "scale(1)";
    });
}