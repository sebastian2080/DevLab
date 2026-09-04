


document.addEventListener("DOMContentLoaded", () => {
    initHeroDemo();
});


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