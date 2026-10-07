/**
 * Reusable Attendance Table Component
 * Renders attendance records as a table.
 * 
 * @param {Array} records - Array of {studentName, status, joinTime, leaveTime, duration} objects
 * @param {boolean} editable - If true, renders Present/Absent buttons per row
 * @returns {string} HTML string for the attendance table
 */
function renderAttendanceTable(records, editable) {
    let html = '<table class="user-table"><thead><tr><th>Student</th><th>Status</th><th>Join Time</th><th>Leave Time</th><th>Duration</th>';
    if (editable) html += '<th>Actions</th>';
    html += '</tr></thead><tbody>';

    records.forEach(record => {
        const statusClass = record.status === 'PRESENT' ? 'badge-active' : (record.status === 'LATE' ? 'badge-inactive' : 'badge-draft');
        html += `<tr>
            <td>${record.studentName}</td>
            <td><span class="badge ${statusClass}">${record.status}</span></td>
            <td>${record.joinTime ? new Date(record.joinTime).toLocaleTimeString() : '—'}</td>
            <td>${record.leaveTime ? new Date(record.leaveTime).toLocaleTimeString() : '—'}</td>
            <td>${record.durationMinutes ? record.durationMinutes + ' min' : '—'}</td>`;
        if (editable) {
            html += `<td>
                <button onclick="markAttendance(${record.studentId}, 'PRESENT')" class="btn-action btn-activate">Present</button>
                <button onclick="markAttendance(${record.studentId}, 'ABSENT')" class="btn-action btn-deactivate">Absent</button>
                <button onclick="markAttendance(${record.studentId}, 'LATE')" class="btn-action btn-reset">Late</button>
            </td>`;
        }
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderAttendanceTable };
}