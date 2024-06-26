$(document).ready(function () {
    let answers = {};

    function loadNextQuestion() {
        $.ajax({
            url: "/next_question",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(answers),
            success: function (response) {
                let questionHtml = `<div class="question" data-key="${response.key}">
                    <p>${response.question}</p>`;

                if (response.options.length > 0) {
                    response.options.forEach((option) => {
                        questionHtml += `<label><input type="radio" name="${response.key}" value="${option}"> ${option}</label><br>`;
                    });
                } else {
                    questionHtml += `<input type="text" name="${response.key}">`;
                }

                questionHtml += `</div>`;
                $("#questions-container").append(questionHtml);
            },
        });
    }

    $(document).on("change", ".question input", function () {
        let key = $(this).closest(".question").data("key");
        let value = $(this).val();
        answers[key] = value;
    });

    $("#questionnaire-form").submit(function (e) {
        e.preventDefault();
        let formData = new FormData(this);
        $.ajax({
            url: "/next_question",
            method: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function () {
                $("#questions-container").empty(); // Clear questions
                loadNextQuestion(); // Load next question
            },
        });
    });

    loadNextQuestion(); // Initial load
});
