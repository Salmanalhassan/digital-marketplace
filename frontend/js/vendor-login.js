// =========================
// VENDOR LOGIN
// =========================

const API_BASE_URL =
    "https://digital-marketplace-rikz.onrender.com/api";


// =========================
// DOM ELEMENTS
// =========================

const loginForm =
    document.getElementById(
        "vendorLoginForm"
    );

const usernameInput =
    document.getElementById(
        "username"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const usernameError =
    document.getElementById(
        "usernameError"
    );

const passwordError =
    document.getElementById(
        "passwordError"
    );

const loginError =
    document.getElementById(
        "loginError"
    );

const loginButton =
    document.getElementById(
        "loginButton"
    );

const loginButtonText =
    document.getElementById(
        "loginButtonText"
    );

const togglePassword =
    document.getElementById(
        "togglePassword"
    );


// =========================
// CLEAR ERRORS
// =========================

function clearErrors() {

    usernameError.textContent = "";

    passwordError.textContent = "";

    loginError.textContent = "";

    loginError.classList.remove(
        "show"
    );

}


// =========================
// SHOW LOGIN ERROR
// =========================

function showLoginError(
    message
) {

    loginError.textContent =
        message;

    loginError.classList.add(
        "show"
    );

}


// =========================
// VALIDATE FORM
// =========================

function validateForm() {

    let valid = true;


    clearErrors();


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    if (!username) {

        usernameError.textContent =
            "Please enter your username.";

        valid = false;

    }


    if (!password) {

        passwordError.textContent =
            "Please enter your password.";

        valid = false;

    }


    return valid;

}


// =========================
// LOGIN BUTTON LOADING
// =========================

function setLoading(
    loading
) {

    if (loading) {

        loginButton.disabled =
            true;

        loginButton.classList.add(
            "loading"
        );

        loginButtonText.textContent =
            "Signing in...";

    } else {

        loginButton.disabled =
            false;

        loginButton.classList.remove(
            "loading"
        );

        loginButtonText.textContent =
            "Sign In";

    }

}


// =========================
// LOGIN REQUEST
// =========================

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        setLoading(true);


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/auth/vendor/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                showLoginError(
                    data.message ||
                    "Invalid username or password."
                );

                setLoading(false);

                return;

            }


            // =========================
            // SAVE VENDOR TOKEN
            // =========================

            localStorage.setItem(
                "vendorToken",
                data.token
            );


            // =========================
            // SAVE VENDOR DATA
            // =========================

            localStorage.setItem(
                "vendor",
                JSON.stringify(
                    data.vendor
                )
            );


            // =========================
            // SUCCESS
            // =========================

            window.location.href =
                "./dashboard.html";


        } catch (error) {

            console.error(
                "Vendor login error:",
                error
            );


            showLoginError(
                "Unable to connect to the server. Please try again."
            );


            setLoading(false);

        }

    }
);


// =========================
// SHOW / HIDE PASSWORD
// =========================

togglePassword.addEventListener(
    "click",
    function() {

        const isPassword =
            passwordInput.type ===
            "password";


        if (isPassword) {

            passwordInput.type =
                "text";

            togglePassword.textContent =
                "Hide";

            togglePassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type =
                "password";

            togglePassword.textContent =
                "Show";

            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    }
);