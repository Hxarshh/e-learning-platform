/**
 * Video Card Component — Design System Aligned
 */
function renderVideoCard(video, role) {
    const videoId = video.id;
    const isTeacher = role === 'TEACHER';
    
    return `
        <div class="card card-interactive" data-video-id="${videoId}">
            <div class="card-header">
                <h4 style="font-weight:600; color:var(--text-main);">${video.title || 'Video Lesson'}</h4>
                <span class="badge badge-info">Video</span>
            </div>
            <div class="card-body">
                <p style="margin-bottom: 8px;">${video.description || 'No description provided.'}</p>
                ${video.duration ? `<span style="font-size:0.8rem; color:var(--text-muted);">⏱ ${video.duration} mins</span>` : ''}
            </div>
            <div class="card-footer">
                <a href="${video.videoUrl || '#'}" target="_blank" class="btn btn-outline btn-sm">Watch Video 🎬</a>
                ${isTeacher ? `<button onclick="deleteVideo(${videoId})" class="btn btn-danger btn-sm">Delete</button>` : ''}
            </div>
        </div>
    `;
}
