/**
 * Resource Card Component — Design System Aligned
 */
function renderResourceCard(res, role) {
    const isTeacher = role === 'TEACHER';
    return `
        <div class="card" data-resource-id="${res.id}">
            <div class="card-header">
                <h4 style="font-weight:600;">${res.title || 'Course Material'}</h4>
                <span class="badge badge-neutral">${res.fileType || 'File'}</span>
            </div>
            <div class="card-body">
                <p>${res.description || 'Downloadable document.'}</p>
            </div>
            <div class="card-footer">
                <a href="${res.fileUrl || '#'}" download class="btn btn-secondary btn-sm">Download 📥</a>
                ${isTeacher ? `<button onclick="deleteResource(${res.id})" class="btn btn-danger btn-sm">Delete</button>` : ''}
            </div>
        </div>
    `;
}
