// ========================================
// VENDOR SETTINGS
// ========================================

const API_BASE_URL =
    "http://172.20.10.5:5000/api";


// ========================================
// AUTHENTICATION
// ========================================

const vendorToken =
    localStorage.getItem("vendorToken");


// ========================================
// DOM ELEMENTS
// ========================================

const changePasswordForm =
    document.getElementById(
        "changePasswordForm"
    );

const currentPassword =
    document.getElementById(
        "currentPassword"
    );

const newPassword =
    document.getElementById(
        "newPassword"
    );

const confirmPassword =
    document.getElementById(
        "confirmPassword"
    );

const changePasswordButton =
    document.getElementById(
        "changePasswordButton"
    );

const settingsMessage =
    document.getElementById(
        "settingsMessage"
    );


// ========================================
// CHECK LOGIN
// ========================================

if (!vendorToken) {

    window.location.href =
        "./login.html";

}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(
    message,
    type = "error"
) {

    if (!settingsMessage) {
        return;
    }


    settingsMessage.textContent =
        message;


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


    settingsMessage.textContent =
        "";


    settingsMessage.className =
        "settings-message";

}


// ========================================
// HANDLE UNAUTHORIZED
// ========================================

function handleUnauthorized() {

    localStorage.removeItem(
        "vendorToken"
    );


    localStorage.removeItem(
        "vendor"
    );


    window.location.href =
        "./login.html";

}


// ========================================
// CHANGE PASSWORD
// ========================================

async function changePassword() {

    const current =
        currentPassword.value.trim();


    const newPasswordValue =
        newPassword.value.trim();


    const confirmPasswordValue =
        confirmPassword.value.trim();


    // ========================================
    // VALIDATION
    // ========================================

    if (
        !current ||
        !newPasswordValue ||
        !confirmPasswordValue
    ) {

        showMessage(
            "Please fill in all password fields.",
            "error"
        );

        return;

    }


    // ========================================
    // PASSWORD LENGTH
    // ========================================

    if (
        newPasswordValue.length < 6
    ) {

        showMessage(
            "New password must be at least 6 characters.",
            "error"
        );

        return;

    }


    // ========================================
    // PASSWORD MATCH
    // ========================================

    if (
        newPasswordValue !==
        confirmPasswordValue
    ) {

        showMessage(
            "New password and confirm password do not match.",
            "error"
        );

        confirmPassword.focus();

        return;

    }


    // ========================================
    // DISABLE BUTTON
    // ========================================

    changePasswordButton.disabled =
        true;


    changePasswordButton.textContent =
        "Changing...";


    hideMessage();


    try {

        // ========================================
        // SEND REQUEST
        // ========================================

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/settings/password`,
                {
                    method: "PATCH",

                    headers: {

                        "Authorization":
                            `Bearer ${vendorToken}`,

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        currentPassword:
                            current,

                        newPassword:
                            newPasswordValue,

                        confirmPassword:
                            confirmPasswordValue

                    })

                }
            );


        // ========================================
        // READ RESPONSE
        // ========================================

        const data =
            await response.json();


        // ========================================
        // UNAUTHORIZED
        // ========================================

        if (
            response.status === 401
        ) {

            handleUnauthorized();

            return;

        }


        // ========================================
        // REQUEST FAILED
        // ========================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to change password."
            );

        }


        // ========================================
        // SUCCESS
        // ========================================

        showMessage(
            data.message ||
            "Password changed successfully.",
            "success"
        );


        // ========================================
        // CLEAR FORM
        // ========================================

        changePasswordForm.reset();


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

        changePasswordButton.disabled =
            false;


        changePasswordButton.textContent =
            "Change Password";

    }

}


// ========================================
// FORM SUBMIT
// ========================================

if (changePasswordForm) {

    changePasswordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            changePassword();

        }
    );

}

