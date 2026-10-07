document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get("moduleId") || 1;
    const questionsContainer = document.getElementById("questionsContainer");
    let questionCount = 0;

    function addQuestion() {
        questionCount++;
        const qId = questionCount;
        const qCard = document.createElement("div");
        qCard.className = "card question-block";
        qCard.dataset.qid = qId;
        qCard.innerHTML = `
            <div class="card-header">
                <span class="badge badge-primary">Question ${qId}</span>
                <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.question-block').remove()">Remove</button>
            </div>
            <div class="form-group">
                <input type="text" class="input q-text" placeholder="Enter your question text here..." required>
            </div>
            <div class="options-container flex flex-col gap-2" style="margin-top: var(--space-3);">
                <label class="form-label" style="font-size:0.8rem;">Answer Choices (Check correct answer)</label>
                <div class="flex items-center gap-2">
                    <input type="radio" name="correct_${qId}" class="correct-radio" checked>
                    <input type="text" class="input opt-text" placeholder="Option 1" required>
                </div>
                <div class="flex items-center gap-2">
                    <input type="radio" name="correct_${qId}" class="correct-radio">
                    <input type="text" class="input opt-text" placeholder="Option 2" required>
                </div>
                <div class="flex items-center gap-2">
                    <input type="radio" name="correct_${qId}" class="correct-radio">
                    <input type="text" class="input opt-text" placeholder="Option 3">
                </div>
                <div class="flex items-center gap-2">
                    <input type="radio" name="correct_${qId}" class="correct-radio">
                    <input type="text" class="input opt-text" placeholder="Option 4">
                </div>
            </div>
        `;
        questionsContainer.appendChild(qCard);
    }

    document.getElementById("addQuestionBtn").addEventListener("click", addQuestion);
    addQuestion(); // Add first by default

    document.getElementById("saveQuizBtn").addEventListener("click", async function() {
        const title = document.getElementById("quizTitle").value.trim();
        const timeLimit = parseInt(document.getElementById("quizTimeLimit").value) || null;
        if (!title) {
            showToast("Please enter a quiz title.", "warning");
            return;
        }

        const qBlocks = document.querySelectorAll(".question-block");
        if (!qBlocks.length) {
            showToast("Please add at least one question.", "warning");
            return;
        }

        const questions = [];
        qBlocks.forEach((block, idx) => {
            const qText = block.querySelector(".q-text").value.trim();
            if (!qText) return;
            const options = [];
            const optRows = block.querySelectorAll(".options-container .flex");
            optRows.forEach(row => {
                const optText = row.querySelector(".opt-text").value.trim();
                const isCorrect = row.querySelector(".correct-radio").checked;
                if (optText) {
                    options.push({ answerText: optText, correct: isCorrect });
                }
            });
            questions.push({
                questionText: qText,
                position: idx + 1,
                answers: options
            });
        });

        try {
            await api.post(`/api/teacher/quizzes/module/${moduleId}`, {
                title,
                timeLimitMinutes: timeLimit,
                status: "PUBLISHED",
                questions
            });
            showToast("Quiz published successfully!", "success");
            setTimeout(() => {
                window.location.href = "teacher-dashboard.html";
            }, 800);
        } catch (err) {
            showToast("Failed to save quiz: " + err.message, "error");
        }
    });
});
