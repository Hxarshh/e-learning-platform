document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("joinCourseForm");
    if (!form) return;

    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const codeInput = document.getElementById("enrollmentCode");
        const code = codeInput ? codeInput.value.trim() : "";
        const submitBtn = form.querySelector("button[type='submit']");

        if (!code) {
            showToast("Please enter an 8-character enrollment code.", "warning");
            return;
        }

        if (submitBtn) submitBtn.disabled = true;

        try {
            const result = await api.post("/api/student/courses/join", { enrollmentCode: code });
            showToast("Successfully enrolled in course!", "success");
            setTimeout(() => {
                window.location.href = "student-dashboard.html";
            }, 800);
        } catch (err) {
            showToast(err.message || "Failed to join course. Check your code.", "error");
            if (submitBtn) submitBtn.disabled = false;
        }
    });
});
