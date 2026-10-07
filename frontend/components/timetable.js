/**
 * Reusable Timetable Grid Component
 * Renders a Day × Time grid from timetable entries.
 * 
 * @param {Array} entries - Array of timetable entry objects
 * @param {string} role - User role (for display purposes)
 * @returns {string} HTML string for the timetable grid
 */
function renderTimetableGrid(entries, role) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = [];
    for (let h = 8; h <= 18; h++) {
        hours.push(`${h.toString().padStart(2, '0')}:00`);
    }

    // Group entries by day
    const entriesByDay = {};
    days.forEach(day => entriesByDay[day] = []);
    entries.forEach(entry => {
        if (entriesByDay[entry.dayOfWeek]) {
            entriesByDay[entry.dayOfWeek].push(entry);
        }
    });

    let html = '<div class="timetable-grid">';
    html += '<table class="timetable-table"><thead><tr><th>Time</th>';
    days.forEach(day => {
        html += `<th>${day.substring(0, 3)}</th>`;
    });
    html += '</tr></thead><tbody>';

    hours.forEach(hour => {
        html += `<tr><td class="time-cell">${hour}</td>`;
        days.forEach(day => {
            const dayEntries = entriesByDay[day].filter(e => {
                const startHour = parseInt(e.startTime.split(':')[0]);
                return startHour === parseInt(hour);
            });
            if (dayEntries.length > 0) {
                html += '<td class="entry-cell">';
                dayEntries.forEach(entry => {
                    html += `<div class="timetable-entry">
                        <strong>${entry.course?.name || 'Course'}</strong>
                        <span>${entry.startTime} - ${entry.endTime}</span>
                    </div>`;
                });
                html += '</td>';
            } else {
                html += '<td class="empty-cell"></td>';
            }
        });
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    return html;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderTimetableGrid };
}