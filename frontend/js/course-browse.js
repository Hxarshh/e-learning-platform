document.addEventListener("DOMContentLoaded", function() {
    const grid = document.getElementById("coursesGrid");
    const searchInput = document.getElementById("searchInput");
    const deptInput = document.getElementById("deptInput");
    const semInput = document.getElementById("semInput");
    const paginationContainer = document.getElementById("paginationContainer");
    let currentPage = 0;

    async function loadCourses(page = 0) {
        currentPage = page;
        grid.innerHTML = '<div class="loading-container" style="grid-column: 1 / -1;"><div class="spinner"></div><span>Loading courses...</span></div>';

        const q = searchInput.value.trim();
        const dept = deptInput.value.trim();
        const sem = semInput.value.trim();

        try {
            const data = await api.get(`/api/courses/search?q=${encodeURIComponent(q)}&department=${encodeURIComponent(dept)}&semester=${encodeURIComponent(sem)}&page=${page}&size=9`);
            const courses = data.content || [];

            if (!courses.length) {
                grid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <div class="empty-state-icon">🔍</div>
                        <h3 class="empty-state-title">No matching courses found</h3>
                        <p class="empty-state-desc">Try clearing or adjusting your search filters.</p>
                    </div>
                `;
                paginationContainer.innerHTML = '';
                return;
            }

            grid.innerHTML = courses.map(c => `
                <div class="card card-interactive">
                    <div class="card-header">
                        <h3 style="font-size:1.1rem; font-weight:700; margin:0;">${c.name}</h3>
                        ${c.isEnrolled ? '<span class="badge badge-success">Enrolled</span>' : '<span class="badge badge-neutral">Not Enrolled</span>'}
                    </div>
                    <div class="card-body">
                        <p style="font-weight:600; color:var(--primary); margin-bottom:4px;">${c.courseCode || ''}</p>
                        <p>${c.department || ''} ${c.semester ? '• Sem ' + c.semester : ''}</p>
                        <div style="margin-top:8px; display:flex; align-items:center; gap:6px;">
                            <span style="color:#f59e0b; font-weight:700;">★ ${c.avgRating || 'New'}</span>
                            <span style="font-size:0.8rem; color:var(--text-subtle);">(${c.reviewCount || 0} reviews)</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <span style="font-size:0.8rem; color:var(--text-muted);">Instructor: ${c.teacherName || 'Faculty'}</span>
                        ${c.isEnrolled 
                            ? `<a href="student-course-detail.html?id=${c.id}" class="btn btn-outline btn-sm">Enter Course</a>`
                            : `<a href="student-join-course.html" class="btn btn-primary btn-sm">Join with Code</a>`
                        }
                    </div>
                </div>
            `).join("");

            paginationContainer.innerHTML = renderPaginationControls(data, "window.onBrowsePageChange");
        } catch (err) {
            grid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><p class="empty-state-title">Error loading courses</p><p class="empty-state-desc">${err.message}</p></div>`;
        }
    }

    window.onBrowsePageChange = function(page) {
        loadCourses(page);
    };

    let debounceTimer;
    function debounceLoad() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => loadCourses(0), 300);
    }

    searchInput.addEventListener("input", debounceLoad);
    deptInput.addEventListener("input", debounceLoad);
    semInput.addEventListener("input", debounceLoad);

    loadCourses(0);
});
