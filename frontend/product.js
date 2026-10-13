// ========================================
// PUBLIC PRODUCT DETAILS
// ========================================

// ========================================
// API BASE URL
// ========================================

const API_BASE_URL =
    "http://172.20.10.5:5000/api";


// ========================================
// DOM ELEMENTS
// ========================================

const productDetails =
    document.getElementById("productDetails");

const productLoading =
    document.getElementById("productLoading");

const productMessage =
    document.getElementById("productMessage");

const backButton =
    document.getElementById("backButton");


// ========================================
// GET PRODUCT ID FROM URL
// ========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const productId =
    urlParams.get("id");


// ========================================
// PRODUCT DATA
// ========================================

let currentProduct = null;


// ========================================
// CHECK PRODUCT ID
// ========================================

if (!productId) {

    showMessage(
        "Product was not specified.",
        "error"
    );

    showLoading(false);

} else {

    loadProduct();

}


// ========================================
// LOAD PRODUCT
// ========================================

async function loadProduct() {

    try {

        showLoading(true);
        hideMessage();


        const response =
            await fetch(
                `${API_BASE_URL}/products/${productId}`
            );


        const data =
            await response.json();


        // ========================================
        // API ERROR
        // ========================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to load product."
            );

        }


        // ========================================
        // SAVE PRODUCT
        // ========================================

        currentProduct =
            data.product;


        // ========================================
        // RENDER PRODUCT
        // ========================================

        renderProduct(
            currentProduct
        );


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


    } finally {

        showLoading(false);

    }

}


// ========================================
// RENDER PRODUCT
// ========================================

function renderProduct(product) {

    if (!productDetails) {
        return;
    }


    const name =
        escapeHtml(
            product.name ||
            "Unnamed Product"
        );


    const description =
        escapeHtml(
            product.description ||
            "No description available."
        );


    const category =
        escapeHtml(
            product.category ||
            "General"
        );


    const shopName =
        escapeHtml(
            product.shop_name ||
            product.shopName ||
            "Unknown Shop"
        );


    const price =
        formatCurrency(
            product.price
        );


    const stock =
        Number(product.stock) || 0;


    const image =
        product.image || "";


    const imageUrl =
        getImageUrl(image);


    const status =
        String(
            product.status ||
            "inactive"
        ).toLowerCase();


    // ========================================
    // PRODUCT IMAGE
    // ========================================

    const imageHtml =
        imageUrl

            ? `
                <img
                    src="${escapeAttribute(imageUrl)}"
                    alt="${escapeAttribute(
                        product.name || "Product"
                    )}"
                    class="product-main-image"
                    onerror="
                        this.style.display='none';

                        const fallback =
                            document.getElementById(
                                'productImageFallback'
                            );

                        if (fallback) {
                            fallback.style.display='flex';
                        }
                    "
                >

                <div
                    id="productImageFallback"
                    class="product-image-fallback"
                    style="display:none;"
                >
                    📦
                </div>
            `

            : `
                <div
                    id="productImageFallback"
                    class="product-image-fallback"
                >
                    📦
                </div>
            `;


    // ========================================
    // STOCK STATUS
    // ========================================

    let stockText =
        "In Stock";

    let stockClass =
        "in-stock";


    if (stock <= 0) {

        stockText =
            "Out of Stock";

        stockClass =
            "out-of-stock";

    } else if (stock <= 5) {

        stockText =
            `Only ${stock} left`;

        stockClass =
            "low-stock";

    }


    // ========================================
    // PRODUCT STATUS
    // ========================================

    const unavailable =
        status !== "active" ||
        stock <= 0;


    // ========================================
    // RENDER PRODUCT
    // ========================================

    productDetails.innerHTML = `

        <div class="product-detail-image">

            ${imageHtml}

        </div>


        <div class="product-detail-content">

            <span class="product-category">
                ${category}
            </span>


            <h1>
                ${name}
            </h1>


            <div class="product-shop">

                <span>
                    Shop
                </span>

                <strong>
                    ${shopName}
                </strong>

            </div>


            <div class="product-price">
                ${price}
            </div>


            <div class="product-stock ${stockClass}">
                ${stockText}
            </div>


            <div class="product-description">

                <h3>
                    Description
                </h3>

                <p>
                    ${description}
                </p>

            </div>


            ${
                unavailable

                    ? `
                        <div class="product-unavailable">
                            This product is currently unavailable.
                        </div>
                    `

                    : `
                        <div class="product-purchase">

                            <div class="quantity-control">

                                <button
                                    type="button"
                                    id="decreaseQuantity"
                                >
                                    −
                                </button>


                                <input
                                    type="number"
                                    id="quantityInput"
                                    value="1"
                                    min="1"
                                    max="${stock}"
                                >


                                <button
                                    type="button"
                                    id="increaseQuantity"
                                >
                                    +
                                </button>

                            </div>


                            <button
                                type="button"
                                id="addToCartButton"
                                class="add-to-cart-button"
                            >
                                Add to Cart
                            </button>

                        </div>
                    `
            }

        </div>

    `;


    // ========================================
    // CONNECT CONTROLS
    // ========================================

    setupProductControls();

}


// ========================================
// PRODUCT CONTROLS
// ========================================

function setupProductControls() {

    const quantity =
        document.getElementById(
            "quantityInput"
        );

    const decrease =
        document.getElementById(
            "decreaseQuantity"
        );

    const increase =
        document.getElementById(
            "increaseQuantity"
        );

    const addToCart =
        document.getElementById(
            "addToCartButton"
        );


    // ========================================
    // QUANTITY INPUT
    // ========================================

    if (quantity) {

        quantity.addEventListener(
            "input",
            function () {

                let value =
                    Number(
                        quantity.value
                    ) || 1;


                const max =
                    Number(
                        currentProduct.stock
                    ) || 1;


                if (value < 1) {
                    value = 1;
                }


                if (value > max) {
                    value = max;
                }


                quantity.value =
                    value;

            }
        );

    }


    // ========================================
    // DECREASE QUANTITY
    // ========================================

    if (decrease) {

        decrease.addEventListener(
            "click",
            function () {

                let value =
                    Number(
                        quantity.value
                    ) || 1;


                if (value > 1) {

                    quantity.value =
                        value - 1;

                }

            }
        );

    }


    // ========================================
    // INCREASE QUANTITY
    // ========================================

    if (increase) {

        increase.addEventListener(
            "click",
            function () {

                let value =
                    Number(
                        quantity.value
                    ) || 1;


                const max =
                    Number(
                        currentProduct.stock
                    ) || 1;


                if (value < max) {

                    quantity.value =
                        value + 1;

                }

            }
        );

    }


    // ========================================
    // ADD TO CART BUTTON
    // ========================================

    if (addToCart) {

        addToCart.addEventListener(
            "click",
            addProductToCart
        );

    }

}


// ========================================
// ADD PRODUCT TO CART
// ========================================

function addProductToCart() {

    if (!currentProduct) {
        return;
    }


    // ========================================
    // GET QUANTITY
    // ========================================

    const quantityInput =
        document.getElementById(
            "quantityInput"
        );


    const button =
        document.getElementById(
            "addToCartButton"
        );


    const quantity =
        Number(
            quantityInput?.value
        ) || 1;


    const stock =
        Number(
            currentProduct.stock
        ) || 0;


    // ========================================
    // VALIDATE QUANTITY
    // ========================================

    if (quantity < 1) {

        showMessage(
            "Please select a valid quantity.",
            "error"
        );

        return;

    }


    if (quantity > stock) {

        showMessage(
            "Requested quantity is not available.",
            "error"
        );

        return;

    }


    // ========================================
    // GET SHOP INFORMATION
    // ========================================

    const shopId =
        Number(
            currentProduct.shop_id ||
            currentProduct.shopId
        );


    const shopName =
        currentProduct.shop_name ||
        currentProduct.shopName ||
        "Unknown Shop";


    const whatsappNumber =
        currentProduct.whatsapp_number ||
        currentProduct.whatsappNumber ||
        "";


    // ========================================
    // VALIDATE SHOP
    // ========================================

    if (!shopId) {

        showMessage(
            "Shop information is missing for this product.",
            "error"
        );

        console.error(
            "Product shop information:",
            currentProduct
        );

        return;

    }


    // ========================================
    // PRODUCT OBJECT
    // ========================================

    const productForCart = {

        id:
            Number(
                currentProduct.id
            ),

        name:
            currentProduct.name,

        price:
            Number(
                currentProduct.price
            ),

        stock:
            Number(
                currentProduct.stock
            )

    };


    // ========================================
    // SHOP OBJECT
    // ========================================

    const shopForCart = {

        id:
            shopId,

        name:
            shopName,

        whatsapp_number:
            whatsappNumber

    };


    // ========================================
    // CHECK CART OBJECT
    // ========================================

    if (
        typeof Cart === "undefined" ||
        typeof Cart.addToCart !== "function"
    ) {

        console.error(
            "Cart.js is not loaded correctly."
        );

        showMessage(
            "Cart system is not available. Please refresh the page.",
            "error"
        );

        return;

    }


    // ========================================
    // ADD PRODUCT WITH SELECTED QUANTITY
    // ========================================

    let result = {
        success: true
    };


    try {

        /*
         * Cart.addToCart() adds one quantity.
         *
         * We call it repeatedly according
         * to the quantity selected by the buyer.
         *
         * Example:
         *
         * quantity = 1
         * → add once
         *
         * quantity = 2
         * → add twice
         *
         * quantity = 4
         * → add four times
         */

        for (
            let i = 0;
            i < quantity;
            i++
        ) {

            result =
                Cart.addToCart(
                    productForCart,
                    shopForCart
                );


            if (!result.success) {

                break;

            }

        }

    } catch (error) {

        console.error(
            "Add to cart error:",
            error
        );

        showMessage(
            "Unable to add product to cart.",
            "error"
        );

        return;

    }


    // ========================================
    // CART ERROR
    // ========================================

    if (!result.success) {

        showMessage(
            result.message ||
            "Unable to add product to cart.",
            "error"
        );

        return;

    }


    // ========================================
    // SUCCESS MESSAGE
    // ========================================

    showMessage(
        quantity === 1
            ? "Product added to cart successfully."
            : `${quantity} products added to cart successfully.`,
        "success"
    );


    // ========================================
    // UPDATE BUTTON
    // ========================================

    if (button) {

        const originalText =
            button.textContent;


        button.textContent =
            "✓ Added to Cart";


        button.disabled =
            true;


        setTimeout(
            function () {

                button.textContent =
                    originalText;

                button.disabled =
                    false;

            },
            1500
        );

    }

}


// ========================================
// GET IMAGE URL
// ========================================

function getImageUrl(image) {

    if (!image) {
        return "";
    }


    // ========================================
    // ALREADY COMPLETE URL
    // ========================================

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }


    // ========================================
    // BACKEND UPLOADS PATH
    // ========================================

    if (
        image.startsWith("/uploads")
    ) {

        return (
            "http://172.20.10.5:5000" +
            image
        );

    }


    // ========================================
    // UPLOADS WITHOUT /
    // ========================================

    if (
        image.startsWith("uploads/")
    ) {

        return (
            "http://172.20.10.5:5000/" +
            image
        );

    }


    // ========================================
    // RETURN ORIGINAL
    // ========================================

    return image;

}


// ========================================
// FORMAT CURRENCY
// ========================================

function formatCurrency(amount) {

    const value =
        Number(amount) || 0;


    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2
        }
    ).format(value);

}


// ========================================
// SHOW LOADING
// ========================================

function showLoading(show) {

    if (!productLoading) {
        return;
    }


    productLoading.style.display =
        show
            ? "block"
            : "none";

}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(
    message,
    type = "error"
) {

    if (!productMessage) {
        return;
    }


    productMessage.textContent =
        message;


    productMessage.className =
        `product-message show ${type}`;

}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!productMessage) {
        return;
    }


    productMessage.textContent =
        "";


    productMessage.className =
        "product-message";

}


// ========================================
// BACK BUTTON
// ========================================

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ========================================
// ESCAPE ATTRIBUTE
// ========================================

function escapeAttribute(value) {

    return escapeHtml(value);

}

