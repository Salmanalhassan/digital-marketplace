// ========================================
// EDIT PRODUCT
// ========================================

const API_BASE_URL =
    "http://172.20.10.5:5000/api";


// ========================================
// AUTHENTICATION
// ========================================

const vendorToken =
    localStorage.getItem("vendorToken");


// ========================================
// PRODUCT ID
// ========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const productId =
    params.get("id");


// ========================================
// DOM ELEMENTS
// ========================================

const editProductForm =
    document.getElementById(
        "editProductForm"
    );

const productMessage =
    document.getElementById(
        "productMessage"
    );

const productName =
    document.getElementById(
        "productName"
    );

const productDescription =
    document.getElementById(
        "productDescription"
    );

const productPrice =
    document.getElementById(
        "productPrice"
    );

const productCategory =
    document.getElementById(
        "productCategory"
    );

const productStock =
    document.getElementById(
        "productStock"
    );

const productStatus =
    document.getElementById(
        "productStatus"
    );

const currentProductImage =
    document.getElementById(
        "currentProductImage"
    );

const noCurrentImage =
    document.getElementById(
        "noCurrentImage"
    );

const productImage =
    document.getElementById(
        "productImage"
    );

const saveProductButton =
    document.getElementById(
        "saveProductButton"
    );

const cancelButton =
    document.getElementById(
        "cancelButton"
    );


// ========================================
// CHECK LOGIN
// ========================================

if (!vendorToken) {

    window.location.href =
        "./login.html";

}


// ========================================
// VALIDATE PRODUCT ID
// ========================================

if (!productId) {

    showMessage(
        "Invalid product ID.",
        "error"
    );

    editProductForm.style.display =
        "none";

} else {

    loadProduct();

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
        type;

}


// ========================================
// GET PRODUCT IMAGE URL
// ========================================

function getProductImageUrl(image) {

    if (!image) {
        return "";
    }


    const imageValue =
        String(image).trim();


    if (
        imageValue.startsWith("http://") ||
        imageValue.startsWith("https://")
    ) {

        return imageValue;

    }


    if (
        imageValue.startsWith("/uploads/")
    ) {

        return `http://172.20.10.5:5000${imageValue}`;

    }


    return `http://172.20.10.5:5000/uploads/products/${imageValue}`;

}


// ========================================
// LOAD PRODUCT
// ========================================

async function loadProduct() {

    showMessage(
        "Loading product...",
        "loading"
    );


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/products/${productId}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${vendorToken}`
                    }
                }
            );


        const data =
            await response.json();


        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "vendorToken"
            );

            localStorage.removeItem(
                "vendor"
            );

            window.location.href =
                "./login.html";

            return;

        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load product."
            );

        }


        fillProductForm(
            data.product
        );


        hideMessage();


    } catch (error) {

        console.error(
            "Load product error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to load product.",
            "error"
        );

    }

}


// ========================================
// FILL PRODUCT FORM
// ========================================

function fillProductForm(product) {

    productName.value =
        product.name || "";


    productDescription.value =
        product.description || "";


    productPrice.value =
        product.price ?? "";


    productCategory.value =
        product.category || "";


    productStock.value =
        product.stock ?? 0;


    productStatus.value =
        product.status || "active";


    if (product.image) {

        currentProductImage.src =
            getProductImageUrl(
                product.image
            );

        currentProductImage.style.display =
            "block";

        noCurrentImage.style.display =
            "none";

    } else {

        currentProductImage.style.display =
            "none";

        noCurrentImage.style.display =
            "block";

    }

}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    productMessage.textContent =
        "";

    productMessage.className =
        "";

}


// ========================================
// CANCEL
// ========================================

cancelButton.addEventListener(
    "click",
    function() {

        window.location.href =
            "./products.html";

    }
);


// ========================================
// SUBMIT EDIT FORM
// ========================================
// ========================================
// SUBMIT EDIT FORM
// ========================================

editProductForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        // ========================================
        // CHECK PRODUCT ID
        // ========================================

        if (!productId) {

            showMessage(
                "Invalid product ID.",
                "error"
            );

            return;

        }


        // ========================================
        // DISABLE BUTTON
        // ========================================

        saveProductButton.disabled = true;

        saveProductButton.textContent =
            "Saving...";


        hideMessage();


        try {

            // ========================================
            // CREATE FORM DATA
            // ========================================

            const formData =
                new FormData(
                    editProductForm
                );


            // ========================================
            // SEND UPDATE REQUEST
            // ========================================

            const response =
                await fetch(
                    `${API_BASE_URL}/vendor/products/${productId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Authorization":
                                `Bearer ${vendorToken}`
                        },

                        body: formData
                    }
                );


            // ========================================
            // READ RESPONSE
            // ========================================

            const data =
                await response.json();


            // ========================================
            // TOKEN EXPIRED
            // ========================================

            if (
                response.status === 401
            ) {

                localStorage.removeItem(
                    "vendorToken"
                );

                localStorage.removeItem(
                    "vendor"
                );

                window.location.href =
                    "./login.html";

                return;

            }


            // ========================================
            // UPDATE FAILED
            // ========================================

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to update product."
                );

            }


            // ========================================
            // SUCCESS
            // ========================================

            showMessage(
                data.message ||
                "Product updated successfully.",
                "success"
            );


            // ========================================
            // REDIRECT TO PRODUCTS
            // ========================================

            setTimeout(
                function() {

                    window.location.href =
                        "./products.html";

                },
                1000
            );


        } catch (error) {

            console.error(
                "Update product error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to update product.",
                "error"
            );


        } finally {

            saveProductButton.disabled =
                false;

            saveProductButton.textContent =
                "Save Changes";

        }

    }
);