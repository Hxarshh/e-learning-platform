// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check for JWT token
    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    
    const authButtonsEl = document.getElementById('authButtons');
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const logoutBtn = document.getElementById('logoutBtn');
    const userGreeting = document.getElementById('userGreeting');
    
    // Auth buttons (Sign In & Sign Up) - shown when no token
    const authButtonsHtml = `
        <a href="login.html" class="btn-login">Sign In</a>
        <a href="register.html" class="btn-create">Sign Up</a>
    `;
    
    if (!token) {
        // No token, show auth buttons and hide user info
        if (authButtonsEl) {
            authButtonsEl.innerHTML = authButtonsHtml;
        }
        userGreeting.style.display = 'none';
        // Hide logout and user info
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userRoleEl) userRoleEl.style.display = 'none';
        // Hide sidebar when not logged in
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.style.display = 'none';
        return;
    }
    
    // Decode JWT to get user info (simple parsing - no verification for display)
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        
        // Display user name and role
        if (userNameEl && payload.name) {
            userNameEl.textContent = payload.name;
        }
        
        if (userRoleEl && payload.role) {
            userRoleEl.textContent = 'Role: ' + payload.role;
            // Add appropriate class based on role
            userRoleEl.className = 'role-badge ' + (payload.role.toLowerCase());
        }
        
        // Show user area and logout button
        userGreeting.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        
    } catch (e) {
        console.error('Could not decode token', e);
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Remove token from storage
            localStorage.removeItem('jwtToken');
            sessionStorage.removeItem('jwtToken');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
});