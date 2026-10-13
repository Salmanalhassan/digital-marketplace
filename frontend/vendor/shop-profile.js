
// ========================================
// VENDOR SHOP PROFILE
// COMPLETE VERSION
// ========================================


// ========================================
// API BASE URL
// ========================================

const API_BASE_URL =
    "https://digital-marketplace-rikz.onrender.com/api";


// ========================================
// VENDOR TOKEN
// ========================================

const vendorToken =
    localStorage.getItem("vendorToken");


// ========================================
// DOM ELEMENTS
// ========================================

const shopProfileForm =
    document.getElementById(
        "shopProfileForm"
    );

const shopNameInput =
    document.getElementById(
        "shopName"
    );

const shopCategoryInput =
    document.getElementById(
        "shopCategory"
    );

const whatsappNumberInput =
    document.getElementById(
        "whatsappNumber"
    );

const shopDescriptionInput =
    document.getElementById(
        "shopDescription"
    );

const shopLogoInput =
    document.getElementById(
        "shopLogo"
    );

const saveShopButton =
    document.getElementById(
        "saveShopButton"
    );

const cancelEditButton =
    document.getElementById(
        "cancelEditButton"
    );

const shopMessage =
    document.getElementById(
        "shopMessage"
    );

const shopStatus =
    document.getElementById(
        "shopStatus"
    );

const noShopMessage =
    document.getElementById(
        "noShopMessage"
    );

const shopDetails =
    document.getElementById(
        "shopDetails"
    );

const displayShopName =
    document.getElementById(
        "displayShopName"
    );

const displayShopCategory =
    document.getElementById(
        "displayShopCategory"
    );

const displayShopWhatsapp =
    document.getElementById(
        "displayShopWhatsapp"
    );

const displayShopDescription =
    document.getElementById(
        "displayShopDescription"
    );

const displayShopCreated =
    document.getElementById(
        "displayShopCreated"
    );

const editShopButton =
    document.getElementById(
        "editShopButton"
    );

const addProductButton =
    document.getElementById(
        "addProductButton"
    );

const shopLogoPreviewContainer =
    document.getElementById(
        "shopLogoPreviewContainer"
    );

const shopLogoPreview =
    document.getElementById(
        "shopLogoPreview"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const sidebarToggle =
    document.getElementById(
        "sidebarToggle"
    );


// ========================================
// SHOP STATE
// ========================================

let currentShop = null;

let shopExists = false;

let editMode = false;


// ========================================
// CHECK VENDOR LOGIN
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

    if (!shopMessage) {
        return;
    }


    shopMessage.textContent =
        message;


    shopMessage.className =
        `shop-message show ${type}`;

}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!shopMessage) {
        return;
    }


    shopMessage.textContent =
        "";


    shopMessage.className =
        "shop-message";

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
// FORMAT DATE
// ========================================

function formatDate(
    dateValue
) {

    if (!dateValue) {
        return "N/A";
    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "N/A";

    }


    return date.toLocaleString(
        "en-NG",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


// ========================================
// SET SHOP STATUS
// ========================================

function setShopStatus(
    status
) {

    if (!shopStatus) {
        return;
    }


    const value =
        String(
            status || "inactive"
        ).toLowerCase();


    shopStatus.textContent =
        value === "active"
            ? "Active"
            : "Inactive";


    shopStatus.className =
        `shop-status ${value}`;

}


// ========================================
// CLEAR FORM
// ========================================

function clearShopForm() {

    if (shopNameInput) {
        shopNameInput.value = "";
    }


    if (shopCategoryInput) {
        shopCategoryInput.value = "";
    }


    if (whatsappNumberInput) {
        whatsappNumberInput.value = "";
    }


    if (shopDescriptionInput) {
        shopDescriptionInput.value = "";
    }


    if (shopLogoInput) {
        shopLogoInput.value = "";
    }


    hideLogoPreview();

}


// ========================================
// FILL FORM
// ========================================

function fillShopForm(
    shop
) {

    if (!shop) {
        return;
    }


    if (shopNameInput) {

        shopNameInput.value =
            shop.name || "";

    }


    if (shopCategoryInput) {

        shopCategoryInput.value =
            shop.category || "";

    }


    if (whatsappNumberInput) {

        whatsappNumberInput.value =
            shop.whatsapp_number || "";

    }


    if (shopDescriptionInput) {

        shopDescriptionInput.value =
            shop.description || "";

    }


    if (shopLogoInput) {

        shopLogoInput.value =
            shop.logo || "";

    }


    updateLogoPreview(
        shop.logo
    );

}


// ========================================
// UPDATE LOGO PREVIEW
// ========================================

function updateLogoPreview(
    logo
) {

    if (
        !shopLogoPreviewContainer ||
        !shopLogoPreview
    ) {

        return;

    }


    const logoValue =
        String(
            logo || ""
        ).trim();


    if (!logoValue) {

        hideLogoPreview();

        return;

    }


    shopLogoPreview.src =
        getLogoUrl(
            logoValue
        );


    shopLogoPreviewContainer.style.display =
        "block";

}


// ========================================
// HIDE LOGO PREVIEW
// ========================================

function hideLogoPreview() {

    if (!shopLogoPreviewContainer) {
        return;
    }


    shopLogoPreviewContainer.style.display =
        "none";


    if (shopLogoPreview) {

        shopLogoPreview.removeAttribute(
            "src"
        );

    }

}


// ========================================
// GET LOGO URL
// ========================================

function getLogoUrl(
    logo
) {

    if (!logo) {
        return "";
    }


    const value =
        String(
            logo
        ).trim();


    if (
        value.startsWith(
            "http://"
        ) ||
        value.startsWith(
            "https://"
        ) ||
        value.startsWith(
            "data:"
        )
    ) {

        return value;

    }


    if (
        value.startsWith("/")
    ) {

        return `https://digital-marketplace-rikz.onrender.com${value}`;

    }


    return `https://digital-marketplace-rikz.onrender.com/${value}`;

}


// ========================================
// SHOW CREATE MODE
// ========================================

function showCreateMode() {

    editMode = false;

    shopExists = false;

    currentShop = null;


    clearShopForm();


    if (shopStatus) {

        shopStatus.textContent =
            "Not Created";

        shopStatus.className =
            "shop-status";

    }


    if (noShopMessage) {

        noShopMessage.style.display =
            "flex";

    }


    if (shopDetails) {

        shopDetails.style.display =
            "none";

    }


    if (saveShopButton) {

        saveShopButton.textContent =
            "Create Shop";

        saveShopButton.disabled =
            false;

    }


    if (cancelEditButton) {

        cancelEditButton.style.display =
            "none";

    }


    enableForm();

}


// ========================================
// SHOW VIEW MODE
// ========================================

function showViewMode() {

    editMode = false;


    if (noShopMessage) {

        noShopMessage.style.display =
            "none";

    }


    if (shopDetails) {

        shopDetails.style.display =
            "block";

    }


    if (saveShopButton) {

        saveShopButton.textContent =
            "Save Changes";

    }


    if (cancelEditButton) {

        cancelEditButton.style.display =
            "none";

    }


    disableForm();

}


// ========================================
// SHOW EDIT MODE
// ========================================

function showEditMode() {

    if (!currentShop) {
        return;
    }


    editMode = true;


    fillShopForm(
        currentShop
    );


    if (noShopMessage) {

        noShopMessage.style.display =
            "none";

    }


    if (shopDetails) {

        shopDetails.style.display =
            "block";

    }


    if (saveShopButton) {

        saveShopButton.textContent =
            "Save Changes";

        saveShopButton.disabled =
            false;

    }


    if (cancelEditButton) {

        cancelEditButton.style.display =
            "inline-flex";

    }


    enableForm();

}


// ========================================
// ENABLE FORM
// ========================================

function enableForm() {

    const inputs =
        shopProfileForm
            ? shopProfileForm.querySelectorAll(
                "input, textarea"
            )
            : [];


    inputs.forEach(
        function (input) {

            input.disabled =
                false;

        }
    );

}


// ========================================
// DISABLE FORM
// ========================================

function disableForm() {

    const inputs =
        shopProfileForm
            ? shopProfileForm.querySelectorAll(
                "input, textarea"
            )
            : [];


    inputs.forEach(
        function (input) {

            input.disabled =
                true;

        }
    );

}


// ========================================
// RENDER SHOP DETAILS
// ========================================

function renderShopDetails(
    shop
) {

    if (!shop) {
        return;
    }


    if (displayShopName) {

        displayShopName.textContent =
            shop.name || "N/A";

    }


    if (displayShopCategory) {

        displayShopCategory.textContent =
            shop.category || "N/A";

    }


    if (displayShopWhatsapp) {

        displayShopWhatsapp.textContent =
            shop.whatsapp_number || "N/A";

    }


    if (displayShopDescription) {

        displayShopDescription.textContent =
            shop.description || "N/A";

    }


    if (displayShopCreated) {

        displayShopCreated.textContent =
            formatDate(
                shop.created_at
            );

    }


    setShopStatus(
        shop.status
    );

}


// ========================================
// RENDER EXISTING SHOP
// ========================================

function renderExistingShop(
    shop
) {

    currentShop =
        shop;

    shopExists =
        true;

    editMode =
        false;


    fillShopForm(
        shop
    );


    renderShopDetails(
        shop
    );


    showViewMode();

}


// ========================================
// LOAD SHOP
// ========================================

async function loadShop() {

    hideMessage();


    try {

        showMessage(
            "Loading shop information...",
            "loading"
        );


        const response =
            await fetch(
                `${API_BASE_URL}/vendor/shop`,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${vendorToken}`

                    }

                }
            );


        let data = null;


        try {

            data =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                "Invalid response from server."
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
        // SHOP NOT FOUND
        // ========================================

        if (
            response.status === 404
        ) {

            showCreateMode();

            hideMessage();

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
                "Failed to load shop information."
            );

        }


        // ========================================
        // RENDER SHOP
        // ========================================

        renderExistingShop(
            data.shop
        );


        hideMessage();


    } catch (error) {

        console.error(
            "Load vendor shop error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to load shop information.",
            "error"
        );

    }

}


// ========================================
// GET FORM DATA
// ========================================

function getShopFormData() {

    return {

        name:
            shopNameInput
                ? shopNameInput.value.trim()
                : "",

        category:
            shopCategoryInput
                ? shopCategoryInput.value.trim()
                : "",

        whatsapp_number:
            whatsappNumberInput
                ? whatsappNumberInput.value.trim()
                : "",

        description:
            shopDescriptionInput
                ? shopDescriptionInput.value.trim()
                : "",

        logo:
            shopLogoInput
                ? shopLogoInput.value.trim()
                : ""

    };

}


// ========================================
// VALIDATE FORM
// ========================================

function validateShopData(
    shopData
) {

    if (!shopData.name) {

        showMessage(
            "Shop name is required.",
            "error"
        );


        if (shopNameInput) {

            shopNameInput.focus();

        }


        return false;

    }


    if (!shopData.whatsapp_number) {

        showMessage(
            "WhatsApp number is required.",
            "error"
        );


        if (whatsappNumberInput) {

            whatsappNumberInput.focus();

        }


        return false;

    }


    if (
        shopData.name.length > 150
    ) {

        showMessage(
            "Shop name cannot exceed 150 characters.",
            "error"
        );


        return false;

    }


    if (
        shopData.category.length > 100
    ) {

        showMessage(
            "Category cannot exceed 100 characters.",
            "error"
        );


        return false;

    }


    if (
        shopData.description.length > 500
    ) {

        showMessage(
            "Description cannot exceed 500 characters.",
            "error"
        );


        return false;

    }


    if (
        shopData.whatsapp_number.length > 20
    ) {

        showMessage(
            "WhatsApp number cannot exceed 20 characters.",
            "error"
        );


        return false;

    }


    return true;

}


// ========================================
// SET SAVING STATE
// ========================================

function setSavingState(
    saving
) {

    if (!saveShopButton) {
        return;
    }


    saveShopButton.disabled =
        saving;


    if (saving) {

        saveShopButton.textContent =
            shopExists
                ? "Saving..."
                : "Creating...";

    } else {

        saveShopButton.textContent =
            shopExists
                ? "Save Changes"
                : "Create Shop";

    }

}


// ========================================
// CREATE SHOP
// ========================================

async function createShop(
    shopData
) {

    setSavingState(
        true
    );


    hideMessage();


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/shop`,
                {
                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${vendorToken}`,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            shopData
                        )

                }
            );


        let data = null;


        try {

            data =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                "Invalid response from server."
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
        // ERROR
        // ========================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to create shop."
            );

        }


        // ========================================
        // SUCCESS
        // ========================================

        currentShop =
            data.shop;

        shopExists =
            true;

        editMode =
            false;


        renderExistingShop(
            data.shop
        );


        showMessage(
            data.message ||
            "Shop created successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Create vendor shop error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to create shop.",
            "error"
        );


    } finally {

        setSavingState(
            false
        );

    }

}


// ========================================
// UPDATE SHOP
// ========================================

async function updateShop(
    shopData
) {

    setSavingState(
        true
    );


    hideMessage();


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/shop`,
                {
                    method: "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${vendorToken}`,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            shopData
                        )

                }
            );


        let data = null;


        try {

            data =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                "Invalid response from server."
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
        // ERROR
        // ========================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to update shop."
            );

        }


        // ========================================
        // SUCCESS
        // ========================================

        currentShop =
            {
                ...(currentShop || {}),
                ...(data.shop || shopData)
            };


        shopExists =
            true;

        editMode =
            false;


        renderExistingShop(
            currentShop
        );


        showMessage(
            data.message ||
            "Shop profile updated successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Update vendor shop error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to update shop.",
            "error"
        );


    } finally {

        setSavingState(
            false
        );

    }

}


// ========================================
// FORM SUBMIT
// ========================================

if (shopProfileForm) {

    shopProfileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const shopData =
                getShopFormData();


            if (
                !validateShopData(
                    shopData
                )
            ) {

                return;

            }


            if (shopExists) {

                updateShop(
                    shopData
                );

            } else {

                createShop(
                    shopData
                );

            }

        }
    );

}


// ========================================
// EDIT SHOP BUTTON
// ========================================

if (editShopButton) {

    editShopButton.addEventListener(
        "click",
        function () {

            if (!currentShop) {
                return;
            }


            showEditMode();

        }
    );

}


// ========================================
// CANCEL EDIT
// ========================================

if (cancelEditButton) {

    cancelEditButton.addEventListener(
        "click",
        function () {

            if (!currentShop) {

                showCreateMode();

                return;

            }


            fillShopForm(
                currentShop
            );


            editMode =
                false;


            showViewMode();

            hideMessage();

        }
    );

}


// ========================================
// LOGO INPUT PREVIEW
// ========================================

if (shopLogoInput) {

    shopLogoInput.addEventListener(
        "input",
        function () {

            updateLogoPreview(
                shopLogoInput.value.trim()
            );

        }
    );

}


// ========================================
// LOGO PREVIEW ERROR
// ========================================

if (shopLogoPreview) {

    shopLogoPreview.addEventListener(
        "error",
        function () {

            if (
                shopLogoPreviewContainer
            ) {

                shopLogoPreviewContainer.style.display =
                    "none";

            }

        }
    );

}


// ========================================
// ADD PRODUCT BUTTON
// ========================================

if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        function (event) {

            if (!shopExists) {

                event.preventDefault();


                showMessage(
                    "Please create your shop before adding products.",
                    "error"
                );

                return;

            }

        }
    );

}


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "vendorToken"
            );

            localStorage.removeItem(
                "vendor"
            );


            window.location.href =
                "./login.html";

        }
    );

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
        ".sidebar-nav a"
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
// INITIAL LOAD
// ========================================

loadShop();

