let htmlCompleted = 0;
let cssCompleted = 0;
let jsCompleted = 0;

for (let i = 1; i <= 6; i++) {
    if (localStorage.getItem(`html-challenge-0${i}`) === "completed") htmlCompleted++;
    if (localStorage.getItem(`css-challenge-0${i}`) === "completed") cssCompleted++;
    if (localStorage.getItem(`js-challenge-0${i}`) === "completed") jsCompleted++;
}


const htmlProgressBar = document.getElementById("html-progress-bar");
const htmlProgressText = document.getElementById("html-progress-text");
htmlProgressBar.style.width = ((htmlCompleted / 6) * 100) + "%";
htmlProgressText.textContent = htmlCompleted + " / 6 desafíos completados";


const cssProgressBar = document.getElementById("css-progress-bar");
const cssProgressText = document.getElementById("css-progress-text");
cssProgressBar.style.width = ((cssCompleted / 6) * 100) + "%";
cssProgressText.textContent = cssCompleted + " / 6 desafíos completados";


const jsProgressBar = document.getElementById("js-progress-bar");
const jsProgressText = document.getElementById("js-progress-text");
jsProgressBar.style.width = ((jsCompleted / 6) * 100) + "%";
jsProgressText.textContent = jsCompleted + " / 6 desafíos completados";

const gitKeys = ["git-01", "git-02", "git-03", "git-04", "git-05", "git-06"];
let gitCompleted = 0;
gitKeys.forEach(k => {
    if (localStorage.getItem(k) === "completed") gitCompleted++;
});

const gitBar = document.getElementById("git-progress-bar");
const gitText = document.getElementById("git-progress-text");
if (gitBar && gitText) {
    const percent = ((gitCompleted / 6) * 100).toFixed(0);
    gitBar.style.width = `${percent}%`;
    gitText.textContent = `${gitCompleted} / 6 desafíos completados`;
}