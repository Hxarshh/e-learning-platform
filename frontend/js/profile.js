document.addEventListener("DOMContentLoaded", async function() {
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profileRole = document.getElementById("profileRole");
    const bioInput = document.getElementById("bioInput");
    const avatarImg = document.getElementById("avatarImg");
    const avatarPreview = document.getElementById("avatarPreview");
    const avatarInput = document.getElementById("avatarInput");
    const saveBioBtn = document.getElementById("saveBioBtn");
    const certsContainer = document.getElementById("certificatesContainer");

    async function loadProfile() {
        try {
            const data = await api.get("/api/profile/mine");
            profileName.textContent = data.name || "User";
            profileEmail.textContent = data.email;
            profileRole.textContent = data.role;
            profileRole.className = "badge " + (data.role === 'ADMIN' ? 'badge-danger' : data.role === 'TEACHER' ? 'badge-primary' : 'badge-success');
            bioInput.value = data.bio || "";

            if (data.avatarRef) {
                avatarImg.src = data.avatarRef;
                avatarImg.style.display = "block";
                avatarPreview.style.display = "none";
            }
        } catch (err) {
            showToast("Failed to load profile: " + err.message, "error");
        }
    }

    async function loadCertificates() {
        if (!certsContainer) return;
        try {
            const certs = await api.get("/api/student/certificates");
            if (!certs || certs.length === 0) {
                certsContainer.innerHTML = `
                    <div class="empty-state" style="margin:0; padding:var(--space-6);">
                        <div class="empty-state-icon">🎓</div>
                        <h4 class="empty-state-title">No Certificates Yet</h4>
                        <p class="empty-state-desc">Complete all modules and assignments in a course to earn verified credentials.</p>
                    </div>
                `;
                return;
            }

            certsContainer.className = "grid grid-2";
            certsContainer.innerHTML = certs.map(c => `
                <div class="card card-interactive">
                    <div class="card-header">
                        <h4 style="font-size:1.05rem; font-weight:700;">${c.courseName}</h4>
                        <span class="badge badge-success">Verified</span>
                    </div>
                    <div class="card-body">
                        <p style="font-size:0.8rem; color:var(--text-subtle);">Ref: <code>${c.certificateRef}</code></p>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">Issued: ${new Date(c.issuedAt).toLocaleDateString()}</p>
                    </div>
                    <div class="card-footer">
                        <a href="/api/certificates/${c.certificateRef}/render" target="_blank" class="btn btn-primary btn-sm">
                            View / Print 🖨️
                        </a>
                    </div>
                </div>
            `).join("");
        } catch (err) {
            certsContainer.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">Certificates available for student accounts.</p>`;
        }
    }

    saveBioBtn.addEventListener("click", async function() {
        saveBioBtn.disabled = true;
        try {
            await api.put("/api/profile/mine", { bio: bioInput.value });
            showToast("Profile bio updated successfully!", "success");
        } catch (err) {
            showToast("Error updating bio: " + err.message, "error");
        } finally {
            saveBioBtn.disabled = false;
        }
    });

    avatarInput.addEventListener("change", async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        showToast("Uploading avatar...", "info");
        try {
            const res = await api.upload("/api/profile/avatar", formData);
            if (res.avatarUrl) {
                avatarImg.src = res.avatarUrl;
                avatarImg.style.display = "block";
                avatarPreview.style.display = "none";
            }
            showToast("Avatar updated successfully!", "success");
        } catch (err) {
            showToast("Avatar upload failed: " + err.message, "error");
        }
    });

    loadProfile();
    loadCertificates();
});
