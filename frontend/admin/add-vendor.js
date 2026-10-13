// ========================================
// ADMIN ADD VENDOR
// 15.0.32
// ========================================



// ========================================
// API BASE URL
// ========================================

const API_BASE_URL =
    "http://172.20.10.5:5000/api";



// ========================================
// ADMIN TOKEN
// ========================================

const adminToken =
    localStorage.getItem(
        "adminToken"
    );



// ========================================
// DOM ELEMENTS
// ========================================

const addVendorForm =
    document.getElementById(
        "addVendorForm"
    );


const addVendorMessage =
    document.getElementById(
        "addVendorMessage"
    );


const createVendorButton =
    document.getElementById(
        "createVendorButton"
    );


const vendorName =
    document.getElementById(
        "vendorName"
    );


const vendorUsername =
    document.getElementById(
        "vendorUsername"
    );


const vendorPhone =
    document.getElementById(
        "vendorPhone"
    );


const vendorPassword =
    document.getElementById(
        "vendorPassword"
    );


const vendorConfirmPassword =
    document.getElementById(
        "vendorConfirmPassword"
    );


const vendorStatus =
    document.getElementById(
        "vendorStatus"
    );



// ========================================
// CHECK ADMIN LOGIN
// ========================================

if (!adminToken) {

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

    if (!addVendorMessage) {
        return;
    }


    addVendorMessage.textContent =
        message;


    addVendorMessage.className =
        `add-vendor-message show ${type}`;

}



// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!addVendorMessage) {
        return;
    }


    addVendorMessage.textContent =
        "";


    addVendorMessage.className =
        "add-vendor-message";

}



// ========================================
// HANDLE UNAUTHORIZED
// ========================================

function handleUnauthorized() {

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
// VALIDATE FORM
// ========================================

function validateForm() {

    const name =
        vendorName.value.trim();


    const username =
        vendorUsername.value
            .trim()
            .toLowerCase();


    const phone =
        vendorPhone.value.trim();


    const password =
        vendorPassword.value;


    const confirmPassword =
        vendorConfirmPassword.value;



    // ========================================
    // NAME
    // ========================================

    if (!name) {

        showMessage(
            "Please enter the vendor's full name.",
            "error"
        );

        vendorName.focus();

        return false;

    }



    // ========================================
    // USERNAME
    // ========================================

    if (!username) {

        showMessage(
            "Please enter a username.",
            "error"
        );

        vendorUsername.focus();

        return false;

    }


    if (username.length < 3) {

        showMessage(
            "Username must be at least 3 characters.",
            "error"
        );

        vendorUsername.focus();

        return false;

    }



    // ========================================
    // PHONE
    // ========================================

    if (!phone) {

        showMessage(
            "Please enter the vendor's phone number.",
            "error"
        );

        vendorPhone.focus();

        return false;

    }



    // ========================================
    // PASSWORD
    // ========================================

    if (!password) {

        showMessage(
            "Please enter a password.",
            "error"
        );

        vendorPassword.focus();

        return false;

    }


    if (password.length < 6) {

        showMessage(
            "Password must be at least 6 characters.",
            "error"
        );

        vendorPassword.focus();

        return false;

    }



    // ========================================
    // CONFIRM PASSWORD
    // ========================================

    if (!confirmPassword) {

        showMessage(
            "Please confirm the password.",
            "error"
        );

        vendorConfirmPassword.focus();

        return false;

    }


    if (
        password !==
        confirmPassword
    ) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        vendorConfirmPassword.focus();

        return false;

    }



    return true;

}



// ========================================
// CREATE VENDOR
// ========================================

async function createVendor() {

    hideMessage();


    if (!validateForm()) {
        return;
    }



    // ========================================
    // BUTTON LOADING
    // ========================================

    createVendorButton.disabled =
        true;


    createVendorButton.textContent =
        "Creating Vendor...";



    try {

        const payload = {

            name:
                vendorName.value.trim(),

            username:
                vendorUsername.value
                    .trim()
                    .toLowerCase(),

            phone:
                vendorPhone.value.trim(),

            password:
                vendorPassword.value,

            status:
                vendorStatus.value

        };



        // ========================================
        // API REQUEST
        // ========================================

        const response =
            await fetch(
                `${API_BASE_URL}/admin/vendors`,
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${adminToken}`,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );



        // ========================================
        // READ RESPONSE
        // ========================================

        let data;


        try {

            data =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                "Invalid server response."
            );

        }



        // ========================================
        // UNAUTHORIZED
        // ========================================

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized();

            return;

        }



        // ========================================
        // API ERROR
        // ========================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to create vendor."
            );

        }



        // ========================================
        // SUCCESS
        // ========================================

        showMessage(
            data.message ||
            "Vendor created successfully.",
            "success"
        );



        // ========================================
        // RESET FORM
        // ========================================

        addVendorForm.reset();



        // ========================================
        // REDIRECT
        // ========================================

        setTimeout(
            function () {

                window.location.href =
                    "./vendors.html";

            },
            1000
        );


    } catch (error) {

        console.error(
            "Create vendor error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to create vendor.",
            "error"
        );


    } finally {

        createVendorButton.disabled =
            false;


        createVendorButton.textContent =
            "Create Vendor";

    }

}



// ========================================
// FORM SUBMIT
// ========================================

if (addVendorForm) {

    addVendorForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            createVendor();

        }
    );

}