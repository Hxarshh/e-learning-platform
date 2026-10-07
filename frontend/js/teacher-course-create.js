document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("createCourseForm");
    if (!form) return;

    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const name = document.getElementById("courseName").value.trim();
        const courseCode = document.getElementById("courseCode").value.trim();
        const department = document.getElementById("department") ? document.getElementById("department").value.trim() : "";
        const semester = document.getElementById("semester") ? document.getElementById("semester").value.trim() : "";
        const description = document.getElementById("description") ? document.getElementById("description").value.trim() : "";
        const submitBtn = form.querySelector("button[type='submit']");

        if (submitBtn) submitBtn.disabled = true;

        try {
            const payload = { name, courseCode, department, semester, description };
            const created = await api.post("/api/teacher/courses", payload);
            showToast("Course created successfully!", "success");
            setTimeout(() => {
                window.location.href = `teacher-course-detail.html?id=${created.id || ''}`;
            }, 700);
        } catch (err) {
            showToast("Failed to create course: " + err.message, "error");
            if (submitBtn) submitBtn.disabled = false;
        }
    });
});
