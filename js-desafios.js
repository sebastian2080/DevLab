const challenge1 = document.querySelector(
    '[data-challenge="1"]'
);

const challenge2 = document.querySelector(
    '[data-challenge="2"]'
);


if (
    localStorage.getItem("js-challenge-01") === "completed"
) {

    const status1 =
        challenge1.querySelector(".challenge-status");

    status1.textContent = "✓ Completado";

    status1.classList.add("completed-status");

}


if (
    localStorage.getItem("js-challenge-02") === "completed"
) {

    const status2 =
        challenge2.querySelector(".challenge-status");

    status2.textContent = "✓ Completado";

    status2.classList.add("completed-status");

}
for (let i = 1; i <= 6; i++) {
    const challenge = document.querySelector(`[data-challenge="${i}"]`);
    const key = `js-challenge-0${i}`;

    if (challenge && localStorage.getItem(key) === "completed") {
        const status = challenge.querySelector(".challenge-status");
        if (status) {
            status.textContent = "✓ Completado";
            status.classList.add("completed-status");
        }
    }
}