// ========================================
// VENDOR ADD PRODUCT
// ========================================

const API_BASE_URL =
    "https://digital-marketplace-rikz.onrender.com/api";


// ========================================
// AUTHENTICATION
// ========================================

const vendorToken =
    localStorage.getItem("vendorToken");

const vendorData =
    localStorage.getItem("vendor");


// ========================================
// DOM ELEMENTS
// ========================================

const addProductForm =
    document.getElementById(
        "addProductForm"
    );

const productName =
    document.getElementById(
        "productName"
    );

const productDescription =
    document.getElementById(
        "productDescription"
    );

const productCategory =
    document.getElementById(
        "productCategory"
    );

const productPrice =
    document.getElementById(
        "productPrice"
    );

const productStock =
    document.getElementById(
        "productStock"
    );

const productStatus =
    document.getElementById(
        "productStatus"
    );

const productImage =
    document.getElementById(
        "productImage"
    );

const imagePreview =
    document.getElementById(
        "imagePreview"
    );

const imagePreviewImage =
    document.getElementById(
        "imagePreviewImage"
    );

const productMessage =
    document.getElementById(
        "productMessage"
    );

const saveProductButton =
    document.getElementById(
        "saveProductButton"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const sidebarToggle =
    document.getElementById(
        "sidebarToggle"
    );

const vendorName =
    document.getElementById(
        "vendorName"
    );

const vendorShopName =
    document.getElementById(
        "vendorShopName"
    );

const vendorAvatar =
    document.getElementById(
        "vendorAvatar"
    );


// ========================================
// LOGIN CHECK
// ========================================

if (!vendorToken) {

    window.location.href =
        "./login.html";

}


// ========================================
// LOAD VENDOR INFORMATION
// ========================================

function loadVendorInfo() {

    if (!vendorData) {
        return;
    }


    try {

        const vendor =
            JSON.parse(vendorData);


        if (vendor.name) {

            vendorName.textContent =
                vendor.name;

            vendorAvatar.textContent =
                vendor.name
                    .charAt(0)
                    .toUpperCase();

        }


    } catch (error) {

        console.error(
            "Vendor data error:",
            error
        );

    }

}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(
    message,
    type = "error"
) {

    productMessage.textContent =
        message;

    productMessage.className =
        `product-message show ${type}`;

}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    productMessage.textContent =
        "";

    productMessage.className =
        "product-message";

}


// ========================================
// CLEAR ERRORS
// ========================================

function clearErrors() {

    const errorElements =
        document.querySelectorAll(
            ".form-error"
        );


    errorElements.forEach(
        element => {

            element.textContent =
                "";

        }
    );


    const errorGroups =
        document.querySelectorAll(
            ".form-group.input-error"
        );


    errorGroups.forEach(
        group => {

            group.classList.remove(
                "input-error"
            );

        }
    );

}


// ========================================
// SHOW FIELD ERROR
// ========================================

function showFieldError(
    inputElement,
    errorElementId,
    message
) {

    const errorElement =
        document.getElementById(
            errorElementId
        );


    if (errorElement) {

        errorElement.textContent =
            message;

    }


    const formGroup =
        inputElement.closest(
            ".form-group"
        );


    if (formGroup) {

        formGroup.classList.add(
            "input-error"
        );

    }

}


// ========================================
// IMAGE PREVIEW
// ========================================

productImage.addEventListener(
    "change",
    function() {

        const file =
            productImage.files[0];


        imagePreview.style.display =
            "none";

        imagePreviewImage.src =
            "";


        if (!file) {
            return;
        }


        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showFieldError(
                productImage,
                "imageError",
                "Please select a JPG, PNG or WebP image."
            );

            productImage.value =
                "";

            return;

        }


        const maxSize =
            5 * 1024 * 1024;


        if (
            file.size > maxSize
        ) {

            showFieldError(
                productImage,
                "imageError",
                "Image size must not exceed 5MB."
            );

            productImage.value =
                "";

            return;

        }


        clearImageError();


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                imagePreviewImage.src =
                    event.target.result;

                imagePreview.style.display =
                    "block";

            };


        reader.readAsDataURL(
            file
        );

    }
);


// ========================================
// CLEAR IMAGE ERROR
// ========================================

function clearImageError() {

    const imageError =
        document.getElementById(
            "imageError"
        );


    if (imageError) {

        imageError.textContent =
            "";

    }


    const imageGroup =
        productImage.closest(
            ".form-group"
        );


    if (imageGroup) {

        imageGroup.classList.remove(
            "input-error"
        );

    }

}


// ========================================
// VALIDATE FORM
// ========================================

function validateForm() {

    clearErrors();

    hideMessage();


    let valid = true;


    const name =
        productName.value.trim();

    const description =
        productDescription.value.trim();

    const category =
        productCategory.value.trim();

    const price =
        Number(productPrice.value);

    const stock =
        Number(productStock.value);

    const image =
        productImage.files[0];


    // ====================================
    // NAME
    // ====================================

    if (name.length < 2) {

        showFieldError(
            productName,
            "nameError",
            "Please enter a product name."
        );

        valid = false;

    }


    if (name.length > 150) {

        showFieldError(
            productName,
            "nameError",
            "Product name must not exceed 150 characters."
        );

        valid = false;

    }


    // ====================================
    // DESCRIPTION
    // ====================================

    if (description.length > 5000) {

        showFieldError(
            productDescription,
            "descriptionError",
            "Description is too long."
        );

        valid = false;

    }


    // ====================================
    // CATEGORY
    // ====================================

    if (category.length > 100) {

        showFieldError(
            productCategory,
            "categoryError",
            "Category must not exceed 100 characters."
        );

        valid = false;

    }


    // ====================================
    // PRICE
    // ====================================

    if (
        productPrice.value === "" ||
        !Number.isFinite(price) ||
        price <= 0
    ) {

        showFieldError(
            productPrice,
            "priceError",
            "Please enter a valid product price."
        );

        valid = false;

    }


    // ====================================
    // STOCK
    // ====================================

    if (
        productStock.value === "" ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {

        showFieldError(
            productStock,
            "stockError",
            "Please enter a valid stock quantity."
        );

        valid = false;

    }


    // ====================================
    // IMAGE
    // ====================================

    if (image) {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (
            !allowedTypes.includes(
                image.type
            )
        ) {

            showFieldError(
                productImage,
                "imageError",
                "Only JPG, PNG and WebP images are allowed."
            );

            valid = false;

        }


        const maxSize =
            5 * 1024 * 1024;


        if (
            image.size > maxSize
        ) {

            showFieldError(
                productImage,
                "imageError",
                "Image size must not exceed 5MB."
            );

            valid = false;

        }

    }


    return valid;

}


// ========================================
// FORM SUBMIT
// ========================================

addProductForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const valid =
            validateForm();


        if (!valid) {

            showMessage(
                "Please correct the errors in the form.",
                "error"
            );

            return;

        }

// ========================================
// CREATE FORM DATA
// ========================================

const formData = new FormData();

formData.append(
    "name",
    productName.value.trim()
);

formData.append(
    "description",
    productDescription.value.trim()
);

formData.append(
    "category",
    productCategory.value.trim()
);

formData.append(
    "price",
    productPrice.value
);

formData.append(
    "stock",
    productStock.value
);

formData.append(
    "status",
    productStatus.value
);


// ========================================
// ADD IMAGE
// ========================================

const image =
    productImage.files[0];

if (image) {

    formData.append(
        "image",
        image
    );

}


// ========================================
// BUTTON LOADING
// ========================================

saveProductButton.disabled =
    true;

saveProductButton.textContent =
    "Saving...";


hideMessage();


// ========================================
// SEND TO BACKEND
// ========================================

try {

    const response =
        await fetch(
            `${API_BASE_URL}/vendor/products`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${vendorToken}`
                },

                body: formData
            }
        );


    const data =
        await response.json();


    // ====================================
    // ERROR RESPONSE
    // ====================================

    if (!response.ok || !data.success) {

        showMessage(
            data.message ||
            "Failed to create product.",
            "error"
        );

        saveProductButton.disabled =
            false;

        saveProductButton.textContent =
            "Save Product";

        return;

    }


    // ====================================
    // SUCCESS
    // ====================================

    showMessage(
        "Product created successfully.",
        "success"
    );


    // Clear form

    addProductForm.reset();


    // Clear image preview

    imagePreview.style.display =
        "none";

    imagePreviewImage.src =
        "";


    // ====================================
    // REDIRECT
    // ====================================

    setTimeout(
        function() {

            window.location.href =
                "./products.html";

        },
        1200
    );


} catch (error) {

    console.error(
        "Create product error:",
        error
    );


    showMessage(
        "Unable to connect to the server. Please try again.",
        "error"
    );


    saveProductButton.disabled =
        false;

    saveProductButton.textContent =
        "Save Product";

}
       

    }
);


// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener(
    "click",
    function() {

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


// ========================================
// SIDEBAR TOGGLE
// ========================================

if (sidebarToggle) {

    sidebarToggle.addEventListener(
        "click",
        function() {

            document.body.classList.toggle(
                "sidebar-open"
            );

        }
    );

}


// ========================================
// INITIALIZE
// ========================================

loadVendorInfo();