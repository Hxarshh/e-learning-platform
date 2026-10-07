document.addEventListener("DOMContentLoaded", async function() {
    const courseListEl = document.getElementById("courseList") || document.getElementById("coursesContainer");
    if (!courseListEl) return;

    courseListEl.innerHTML = '<div class="loading-container"><div class="spinner"></div><span>Loading your courses...</span></div>';

    try {
        const courses = await api.get("/api/teacher/courses");
        if (!courses || courses.length === 0) {
            courseListEl.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">📚</div>
                    <h3 class="empty-state-title">No Courses Created Yet</h3>
                    <p class="empty-state-desc">You haven't published any courses. Create your first course to begin teaching.</p>
                    <a href="teacher-course-create.html" class="btn btn-primary">Create New Course</a>
                </div>
            `;
            return;
        }

        courseListEl.innerHTML = courses.map(c => renderCourseCard(c, "TEACHER")).join("");
    } catch (err) {
        showToast("Error loading courses: " + err.message, "error");
        courseListEl.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><p class="empty-state-title">Failed to load courses</p><p class="empty-state-desc">${err.message}</p></div>`;
    }
});
