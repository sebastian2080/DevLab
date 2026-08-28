const challenge1 = document.querySelector(
    '[data-challenge="1"]'
);

const challenge2 = document.querySelector(
    '[data-challenge="2"]'
);

const challenge3 = document.querySelector(
    '[data-challenge="3"]'
);


// DESAFÍO 01

if (
    localStorage.getItem("html-challenge-01") === "completed"
) {

    const status1 =
        challenge1.querySelector(".challenge-status");

    status1.textContent = "✓ Completado";

    status1.classList.add("completed-status");

}


// DESAFÍO 02

if (
    localStorage.getItem("html-challenge-02") === "completed"
) {

    const status2 =
        challenge2.querySelector(".challenge-status");

    status2.textContent = "✓ Completado";

    status2.classList.add("completed-status");

}


// DESAFÍO 03

if (
    localStorage.getItem("html-challenge-03") === "completed"
) {

    const status3 =
        challenge3.querySelector(".challenge-status");

    status3.textContent = "✓ Completado";

    status3.classList.add("completed-status");

}
for (let i = 1; i <= 6; i++) {
    const challenge = document.querySelector(`[data-challenge="${i}"]`);
    const key = `html-challenge-0${i}`;

    if (challenge && localStorage.getItem(key) === "completed") {
        const status = challenge.querySelector(".challenge-status");
        if (status) {
            status.textContent = "✓ Completado";
            status.classList.add("completed-status");
        }
    }
}