/**
 * Assignment Card Component — Design System Aligned
 */
function renderAssignmentCard(assignment, role) {
    const isTeacher = role === 'TEACHER';
    const dueDate = assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No deadline';
    
    return `
        <div class="card" data-assignment-id="${assignment.id}">
            <div class="card-header">
                <h4 style="font-weight:600;">${assignment.title || 'Assignment'}</h4>
                <span class="badge badge-warning">Due: ${dueDate}</span>
            </div>
            <div class="card-body">
                <p>${assignment.description || 'Follow instructions and submit your work before the deadline.'}</p>
                <p style="margin-top:6px; font-weight:600; color:var(--primary);">Max Marks: ${assignment.maxMarks || 100}</p>
            </div>
            <div class="card-footer">
                ${isTeacher 
                    ? `<a href="teacher-assignment-submissions.html?id=${assignment.id}" class="btn btn-primary btn-sm">Submissions</a>`
                    : `<a href="student-assignment-submit.html?id=${assignment.id}" class="btn btn-primary btn-sm">Submit Work</a>`
                }
            </div>
        </div>
    `;
}
