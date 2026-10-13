// ========================================
// ADMIN SETTINGS
// ========================================

// ========================================
// API BASE URL
// ========================================

const API_BASE_URL = "https://digital-marketplace-rikz.onrender.com/api";


// ========================================
// ADMIN TOKEN
// ========================================

const adminToken = localStorage.getItem("adminToken");


// ========================================
// DOM ELEMENTS
// ========================================

const settingsMessage =
    document.getElementById("settingsMessage");

const adminName =
    document.getElementById("adminName");

const adminAvatar =
    document.getElementById("adminAvatar");

const adminNameInput =
    document.getElementById("adminNameInput");

const adminEmailInput =
    document.getElementById("adminEmailInput");

const saveProfileButton =
    document.getElementById("saveProfileButton");

const currentPasswordInput =
    document.getElementById("currentPassword");

const newPasswordInput =
    document.getElementById("newPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const changePasswordButton =
    document.getElementById("changePasswordButton");

const logoutButton =
    document.getElementById("logoutButton");

const sidebarToggle =
    document.getElementById("sidebarToggle");


// ========================================
// CHECK LOGIN
// ========================================

if (!adminToken) {
    window.location.href = "./login.html";
}


// ========================================
// AUTH HEADERS
// ========================================

function getAuthHeaders() {
    return {
        "Authorization": `Bearer ${adminToken}`,
        "Content-Type": "application/json"
    };
}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(message, type = "error") {

    if (!settingsMessage) {
        return;
    }

    settingsMessage.textContent = message;

    settingsMessage.className =
        `settings-message show ${type}`;
}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!settingsMessage) {
        return;
    }

    settingsMessage.textContent = "";

    settingsMessage.className =
        "settings-message";
}


// ========================================
// HANDLE UNAUTHORIZED
// ========================================

function handleUnauthorized() {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    window.location.href = "./login.html";
}


// ========================================
// LOAD ADMIN INFORMATION
// ========================================

function loadAdminInformation() {

    try {

        const adminData =
            localStorage.getItem("admin");

        if (!adminData) {
            return;
        }

        const admin =
            JSON.parse(adminData);

        const name =
            admin.name ||
            admin.username ||
            "Admin";

        const email =
            admin.email ||
            "";

        if (adminName) {
            adminName.textContent = name;
        }

        if (adminAvatar) {
            adminAvatar.textContent =
                name.charAt(0).toUpperCase();
        }

        if (adminNameInput) {
            adminNameInput.value = name;
        }

        if (adminEmailInput) {
            adminEmailInput.value = email;
        }

    } catch (error) {

        console.error(
            "Load admin information error:",
            error
        );

    }
}


// ========================================
// LOAD SETTINGS FROM SERVER
// ========================================

async function loadSettings() {

    try {

        hideMessage();

        const response = await fetch(
            `${API_BASE_URL}/admin/settings`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const data =
            await response.json();

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized();
            return;

        }

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load settings."
            );

        }

        const settings =
            data.settings ||
            data.admin ||
            {};

        const name =
            settings.name ||
            settings.username ||
            "Admin";

        const email =
            settings.email ||
            "";

        if (adminNameInput) {
            adminNameInput.value = name;
        }

        if (adminEmailInput) {
            adminEmailInput.value = email;
        }

        if (adminName) {
            adminName.textContent = name;
        }

        if (adminAvatar) {
            adminAvatar.textContent =
                name.charAt(0).toUpperCase();
        }

        // Keep localStorage updated
        localStorage.setItem(
            "admin",
            JSON.stringify(settings)
        );

    } catch (error) {

        console.error(
            "Load admin settings error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to load settings.",
            "error"
        );

    }

}


// ========================================
// SAVE PROFILE
// ========================================

async function saveProfile() {

    const name =
        adminNameInput
            ? adminNameInput.value.trim()
            : "";

    const email =
        adminEmailInput
            ? adminEmailInput.value.trim()
            : "";

    if (!name) {

        showMessage(
            "Admin name is required.",
            "error"
        );

        return;
    }

    if (!email) {

        showMessage(
            "Admin email is required.",
            "error"
        );

        return;
    }

    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

        showMessage(
            "Please enter a valid email address.",
            "error"
        );

        return;
    }

    try {

        if (saveProfileButton) {
            saveProfileButton.disabled = true;
            saveProfileButton.textContent =
                "Saving...";
        }

        showMessage(
            "Saving profile...",
            "loading"
        );

        const response = await fetch(
            `${API_BASE_URL}/admin/settings/profile`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name,
                    email
                })
            }
        );

        const data =
            await response.json();

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized();
            return;

        }

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to update profile."
            );

        }

        const updatedAdmin =
            data.admin ||
            data.settings ||
            {
                name,
                email
            };

        localStorage.setItem(
            "admin",
            JSON.stringify(updatedAdmin)
        );

        if (adminName) {
            adminName.textContent = name;
        }

        if (adminAvatar) {
            adminAvatar.textContent =
                name.charAt(0).toUpperCase();
        }

        showMessage(
            data.message ||
            "Profile updated successfully.",
            "success"
        );

        setTimeout(
            hideMessage,
            2500
        );

    } catch (error) {

        console.error(
            "Save profile error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to update profile.",
            "error"
        );

    } finally {

        if (saveProfileButton) {
            saveProfileButton.disabled = false;
            saveProfileButton.textContent =
                "Save Changes";
        }

    }

}


// ========================================
// CHANGE PASSWORD
// ========================================

async function changePassword() {

    const currentPassword =
        currentPasswordInput
            ? currentPasswordInput.value
            : "";

    const newPassword =
        newPasswordInput
            ? newPasswordInput.value
            : "";

    const confirmPassword =
        confirmPasswordInput
            ? confirmPasswordInput.value
            : "";

    if (!currentPassword) {

        showMessage(
            "Current password is required.",
            "error"
        );

        return;
    }

    if (!newPassword) {

        showMessage(
            "New password is required.",
            "error"
        );

        return;
    }

    if (newPassword.length < 6) {

        showMessage(
            "New password must be at least 6 characters.",
            "error"
        );

        return;
    }

    if (newPassword !== confirmPassword) {

        showMessage(
            "New passwords do not match.",
            "error"
        );

        return;
    }

    try {

        if (changePasswordButton) {
            changePasswordButton.disabled = true;
            changePasswordButton.textContent =
                "Changing...";
        }

        showMessage(
            "Changing password...",
            "loading"
        );

        const response = await fetch(
            `${API_BASE_URL}/admin/settings/password`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            }
        );

        const data =
            await response.json();

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized();
            return;

        }

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to change password."
            );

        }

        if (currentPasswordInput) {
            currentPasswordInput.value = "";
        }

        if (newPasswordInput) {
            newPasswordInput.value = "";
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.value = "";
        }

        showMessage(
            data.message ||
            "Password changed successfully.",
            "success"
        );

        setTimeout(
            hideMessage,
            3000
        );

    } catch (error) {

        console.error(
            "Change password error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to change password.",
            "error"
        );

    } finally {

        if (changePasswordButton) {
            changePasswordButton.disabled = false;
            changePasswordButton.textContent =
                "Change Password";
        }

    }

}


// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "admin"
    );

    window.location.href =
        "./login.html";
}


// ========================================
// SIDEBAR TOGGLE
// ========================================

if (sidebarToggle) {

    sidebarToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "sidebar-open"
            );

        }
    );

}


// ========================================
// CLOSE SIDEBAR AFTER NAVIGATION
// ========================================

const sidebarLinks =
    document.querySelectorAll(
        ".admin-navigation a"
    );

sidebarLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                document.body.classList.remove(
                    "sidebar-open"
                );

            }
        );

    }
);


// ========================================
// SAVE PROFILE EVENT
// ========================================

if (saveProfileButton) {

    saveProfileButton.addEventListener(
        "click",
        saveProfile
    );

}


// ========================================
// CHANGE PASSWORD EVENT
// ========================================

if (changePasswordButton) {

    changePasswordButton.addEventListener(
        "click",
        changePassword
    );

}


// ========================================
// LOGOUT EVENT
// ========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


// ========================================
// ENTER KEY SUPPORT
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Enter"
        ) {
            return;
        }

        const activeElement =
            document.activeElement;

        if (
            activeElement ===
            currentPasswordInput ||
            activeElement ===
            newPasswordInput ||
            activeElement ===
            confirmPasswordInput
        ) {

            changePassword();

        }

    }
);


// ========================================
// INITIALIZE
// ========================================

loadAdminInformation();

loadSettings();

