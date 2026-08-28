const answers = document.querySelectorAll(".answer");
const feedback = document.getElementById("challenge-feedback");

let completed =
    localStorage.getItem("js-challenge-01") === "completed";


if (completed) {

    feedback.textContent =
        "🎉 ¡Desafío completado! Ya resolviste este desafío.";

    feedback.className = "correct-feedback";

    answers.forEach(function (button) {

        button.disabled = true;

        if (button.classList.contains("correct")) {
            button.classList.add("answer-correct");
        }

    });

}


answers.forEach(function (answer) {

    answer.addEventListener("click", function () {

        if (completed) {
            return;
        }


        if (answer.classList.contains("correct")) {

            completed = true;

            localStorage.setItem(
                "js-challenge-01",
                "completed"
            );

            feedback.textContent =
                "🎉 ¡Correcto! let permite declarar una variable cuyo valor puede cambiar.";

            feedback.className = "correct-feedback";

            answer.classList.add("answer-correct");


            answers.forEach(function (button) {
                button.disabled = true;
            });


        } else {

            feedback.textContent =
                "❌ No es correcto. Intentá nuevamente.";

            feedback.className = "wrong-feedback";

            answer.classList.add("answer-wrong");


            setTimeout(function () {
                answer.classList.remove("answer-wrong");
            }, 600);

        }

    });

});