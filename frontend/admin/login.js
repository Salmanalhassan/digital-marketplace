// ========================================
// ADMIN LOGIN
// ========================================

const API_BASE_URL =
    "https://digital-marketplace-rikz.onrender.com/api";


// ========================================
// DOM ELEMENTS
// ========================================

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );

const adminEmail =
    document.getElementById(
        "adminEmail"
    );

const adminPassword =
    document.getElementById(
        "adminPassword"
    );

const adminLoginButton =
    document.getElementById(
        "adminLoginButton"
    );

const adminLoginMessage =
    document.getElementById(
        "adminLoginMessage"
    );


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(
    message,
    type = "error"
) {

    if (!adminLoginMessage) {
        return;
    }


    adminLoginMessage.textContent =
        message;


    adminLoginMessage.className =
        `admin-login-message show ${type}`;

}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!adminLoginMessage) {
        return;
    }


    adminLoginMessage.textContent =
        "";

    adminLoginMessage.className =
        "admin-login-message";

}


// ========================================
// CHECK EXISTING ADMIN LOGIN
// ========================================

const existingAdminToken =
    localStorage.getItem(
        "adminToken"
    );


if (existingAdminToken) {

    window.location.href =
        "./dashboard.html";

}


// ========================================
// LOGIN FORM
// ========================================

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            hideMessage();


            // ========================================
            // GET VALUES
            // ========================================

            const email =
                adminEmail.value
                    .trim()
                    .toLowerCase();


            const password =
                adminPassword.value;


            // ========================================
            // VALIDATION
            // ========================================

            if (!email) {

                showMessage(
                    "Please enter your email.",
                    "error"
                );

                adminEmail.focus();

                return;

            }


            if (!password) {

                showMessage(
                    "Please enter your password.",
                    "error"
                );

                adminPassword.focus();

                return;

            }


            // ========================================
            // DISABLE BUTTON
            // ========================================

            adminLoginButton.disabled =
                true;


            adminLoginButton.textContent =
                "Logging in...";


            showMessage(
                "Authenticating...",
                "loading"
            );


            try {

                // ========================================
                // SEND LOGIN REQUEST
                // ========================================

                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/admin/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                // ========================================
                // READ RESPONSE
                // ========================================

                const data =
                    await response.json();


                // ========================================
                // LOGIN FAILED
                // ========================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Invalid email or password."
                    );

                }


                // ========================================
                // CHECK TOKEN
                // ========================================

                if (!data.token) {

                    throw new Error(
                        "Login successful but no admin token was returned."
                    );

                }


                // ========================================
                // SAVE ADMIN TOKEN
                // ========================================

                localStorage.setItem(
                    "adminToken",
                    data.token
                );


                // ========================================
                // SAVE ADMIN DATA
                // ========================================

                if (data.admin) {

                    localStorage.setItem(
                        "admin",
                        JSON.stringify(
                            data.admin
                        )
                    );

                }


                // ========================================
                // SUCCESS
                // ========================================

                showMessage(
                    data.message ||
                    "Admin login successful.",
                    "success"
                );


                // ========================================
                // REDIRECT
                // ========================================

                setTimeout(
                    function () {

                        window.location.href =
                            "./dashboard.html";

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to login.",
                    "error"
                );


            } finally {

                adminLoginButton.disabled =
                    false;


                adminLoginButton.textContent =
                    "Login";

            }

        }
    );

}

