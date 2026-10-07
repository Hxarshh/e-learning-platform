document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get("id") || 1;
    const container = document.getElementById("quizContainer");

    try {
        const quiz = await api.get(`/api/student/quizzes/${quizId}`);
        const questions = quiz.questions || [];
        let currentIndex = 0;
        const answers = {};

        function renderQuestion() {
            if (currentIndex >= questions.length) {
                renderSummary();
                return;
            }

            const q = questions[currentIndex];
            container.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <span class="badge badge-primary">Question ${currentIndex + 1} of ${questions.length}</span>
                        ${quiz.timeLimitMinutes ? `<span class="badge badge-warning">⏱ ${quiz.timeLimitMinutes} min limit</span>` : ''}
                    </div>
                    <div class="card-body">
                        <h2 style="font-size:1.25rem; font-weight:700; color:var(--text-main); margin-bottom:var(--space-6);">
                            ${q.questionText}
                        </h2>
                        <div class="flex flex-col gap-3">
                            ${q.answers.map(a => `
                                <label class="card card-interactive flex items-center gap-3" style="padding:var(--space-3); border-color:${answers[q.id] === a.id ? 'var(--primary)' : 'var(--border-color)'};">
                                    <input type="radio" name="opt_${q.id}" value="${a.id}" ${answers[q.id] === a.id ? 'checked' : ''} onchange="selectOption(${q.id}, ${a.id})">
                                    <span style="font-weight:500;">${a.answerText}</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-secondary" ${currentIndex === 0 ? 'disabled' : ''} onclick="prevQuestion()">Previous</button>
                        <button class="btn btn-primary" onclick="nextQuestion()">${currentIndex === questions.length - 1 ? 'Finish & Submit' : 'Next Question'}</button>
                    </div>
                </div>
            `;
        }

        window.selectOption = function(qId, aId) {
            answers[qId] = aId;
        };

        window.prevQuestion = function() {
            if (currentIndex > 0) {
                currentIndex--;
                renderQuestion();
            }
        };

        window.nextQuestion = function() {
            if (currentIndex < questions.length - 1) {
                currentIndex++;
                renderQuestion();
            } else {
                submitQuiz();
            }
        };

        async function submitQuiz() {
            container.innerHTML = '<div class="loading-container"><div class="spinner"></div><span>Grading your quiz...</span></div>';
            try {
                const result = await api.post(`/api/student/quizzes/${quizId}/submit`, answers);
                const pct = Math.round((result.score / result.totalQuestions) * 100);
                container.innerHTML = `
                    <div class="card" style="text-align:center; padding: var(--space-8);">
                        <div style="font-size:3.5rem; margin-bottom:var(--space-2);">${pct >= 70 ? '🎉' : '📚'}</div>
                        <h2 class="page-title">Quiz Completed!</h2>
                        <p class="page-subtitle">Your score has been computed and recorded.</p>
                        <div style="margin: var(--space-6) 0; font-size: 2.5rem; font-weight:800; color: ${pct >= 70 ? 'var(--success)' : 'var(--warning)'};">
                            ${result.score} / ${result.totalQuestions} <span style="font-size:1.25rem;">(${pct}%)</span>
                        </div>
                        <a href="student-dashboard.html" class="btn btn-primary">Return to Dashboard</a>
                    </div>
                `;
            } catch (err) {
                showToast("Submission failed: " + err.message, "error");
            }
        }

        renderQuestion();

    } catch (err) {
        container.innerHTML = `<div class="empty-state"><p class="empty-state-title">Unable to load quiz</p><p class="empty-state-desc">${err.message}</p></div>`;
    }
});
