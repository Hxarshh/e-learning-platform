document.addEventListener("DOMContentLoaded", async function() {
    const tableBody = document.getElementById("usersTableBody");
    const roleFilter = document.getElementById("roleFilter");
    let allUsers = [];

    async function loadUsers() {
        if (!tableBody) return;
        tableBody.innerHTML = '<tr><td colspan="6" class="loading-container"><div class="spinner"></div><span>Loading users...</span></td></tr>';
        
        try {
            allUsers = await api.get("/api/admin/users");
            renderUsers();
        } catch (err) {
            showToast("Failed to fetch user list: " + err.message, "error");
            tableBody.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">⚠️</div><p class="empty-state-title">Error loading users</p><p class="empty-state-desc">' + err.message + '</p></td></tr>';
        }
    }

    function renderUsers() {
        const selectedRole = roleFilter ? roleFilter.value : "";
        const filtered = selectedRole ? allUsers.filter(u => u.role === selectedRole) : allUsers;

        if (!filtered.length) {
            tableBody.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">👥</div><p class="empty-state-title">No users found</p><p class="empty-state-desc">Try changing your filter settings.</p></td></tr>';
            return;
        }

        tableBody.innerHTML = filtered.map(user => `
            <tr>
                <td><strong>${user.id}</strong></td>
                <td>${user.name || user.fullName || 'N/A'}</td>
                <td>${user.email}</td>
                <td><span class="badge ${user.role === 'ADMIN' ? 'badge-danger' : user.role === 'TEACHER' ? 'badge-primary' : 'badge-success'}">${user.role}</span></td>
                <td><span class="badge ${user.active !== false ? 'badge-success' : 'badge-neutral'}">${user.active !== false ? 'Active' : 'Inactive'}</span></td>
                <td>
                    <button onclick="toggleUserStatus(${user.id}, ${user.active !== false})" class="btn ${user.active !== false ? 'btn-danger' : 'btn-success'} btn-sm">
                        ${user.active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onclick="resetPassword(${user.id})" class="btn btn-secondary btn-sm" style="margin-left:6px;">Reset Pwd</button>
                </td>
            </tr>
        `).join("");
    }

    window.toggleUserStatus = async function(id, currentActive) {
        try {
            await api.patch(`/api/admin/users/${id}/status?active=${!currentActive}`);
            showToast(`User account ${!currentActive ? 'activated' : 'deactivated'} successfully.`, "success");
            loadUsers();
        } catch (err) {
            showToast("Failed to update user status: " + err.message, "error");
        }
    };

    window.resetPassword = async function(id) {
        const newPassword = prompt("Enter new temporary password for user:");
        if (!newPassword) return;

        try {
            await api.patch(`/api/admin/users/${id}/reset-password`, { newPassword });
            showToast("Password reset successfully!", "success");
        } catch (err) {
            showToast("Failed to reset password: " + err.message, "error");
        }
    };

    if (roleFilter) roleFilter.addEventListener("change", renderUsers);
    loadUsers();
});
