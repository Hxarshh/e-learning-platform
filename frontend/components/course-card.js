/**
 * Course Card Component — Design System Aligned with Visual Progress Bar
 */
function renderCourseCard(course, role) {
    const courseId = course.id;
    let actionBtn = '';
    const progress = course.progress !== undefined ? course.progress : (course.enrolled ? 45 : 0);

    if (role === 'STUDENT') {
        actionBtn = `<a href="student-course-detail.html?id=${courseId}" class="btn btn-primary btn-sm">Enter Course</a>`;
    } else if (role === 'TEACHER') {
        actionBtn = `<a href="teacher-course-detail.html?id=${courseId}" class="btn btn-primary btn-sm">Manage Course</a>`;
    } else {
        actionBtn = `<a href="admin-dashboard.html" class="btn btn-secondary btn-sm">Inspect</a>`;
    }

    const statusBadge = course.codeActive !== false 
        ? '<span class="badge badge-success">Active</span>' 
        : '<span class="badge badge-neutral">Archived</span>';

    // Progress bar for students
    const progressBarHtml = role === 'STUDENT' ? `
        <div style="margin: var(--space-3) 0;">
            <div class="flex items-center justify-between" style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">
                <span>Course Progress</span>
                <strong>${progress}%</strong>
            </div>
            <div style="height:6px; background:var(--bg-surface-alt); border-radius:var(--radius-full); overflow:hidden;">
                <div style="width:${progress}%; height:100%; background:var(--primary); border-radius:var(--radius-full); transition:width 0.4s ease;"></div>
            </div>
        </div>
    ` : '';

    return `
        <div class="card card-interactive" data-course-id="${course.id}">
            <div class="card-header">
                <h3 class="section-title" style="margin-bottom:0; font-size:1.1rem;">${course.name || 'Untitled Course'}</h3>
                ${statusBadge}
            </div>
            <div class="card-body">
                <p style="font-weight:600; color:var(--primary); margin-bottom:4px;">${course.courseCode || ''}</p>
                <p>${course.department ? 'Dept: ' + course.department : ''} ${course.semester ? '• Sem ' + course.semester : ''}</p>
                ${progressBarHtml}
            </div>
            <div class="card-footer">
                <span style="font-size:0.75rem; color:var(--text-subtle);">${course.enrollmentCode ? 'Code: <code>' + course.enrollmentCode + '</code>' : ''}</span>
                ${actionBtn}
            </div>
        </div>
    `;
}
