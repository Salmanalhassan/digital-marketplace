
// ========================================
// PUBLIC SHOP PAGE
// ========================================


// ========================================
// API BASE URL
// ========================================

const API_BASE_URL =
    "http://172.20.10.5:5000/api";


// ========================================
// DOM ELEMENTS
// ========================================

const shopHeader =
    document.getElementById("shopHeader");

const productsGrid =
    document.getElementById("productsGrid");

const emptyProducts =
    document.getElementById("emptyProducts");

const shopMessage =
    document.getElementById("shopMessage");

const productSearch =
    document.getElementById("productSearch");

const productCountText =
    document.getElementById("productCountText");

const cartCount =
    document.getElementById("cartCount");


// ========================================
// SHOP DATA
// ========================================

let shopData = null;

let allProducts = [];


// ========================================
// GET SHOP ID FROM URL
// ========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const shopId =
    urlParams.get("id");


// ========================================
// CHECK SHOP ID
// ========================================

if (!shopId) {

    showMessage(
        "Shop not found.",
        "error"
    );

    if (shopHeader) {

        shopHeader.innerHTML = `
            <div class="shop-header-content">

                <div class="shop-info">

                    <span class="shop-category">
                        Marketplace
                    </span>

                    <h1 class="shop-name">
                        Shop Not Found
                    </h1>

                    <p class="shop-description">
                        No shop was selected. Please return to the marketplace and choose a shop.
                    </p>

                    <div class="shop-meta">

                        <a
                            href="./index.html"
                            class="back-link"
                        >
                            ← Back to Marketplace
                        </a>

                    </div>

                </div>

            </div>
        `;

    }

} else {

    loadShop();

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
// LOAD SHOP
// ========================================

async function loadShop() {

    showMessage(
        "Loading shop...",
        "loading"
    );

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/public/shops/${encodeURIComponent(shopId)}`
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
                "Unable to load shop."
            );

        }


        // ========================================
        // SAVE SHOP
        // ========================================

        shopData =
            data.shop || null;


        if (!shopData) {

            throw new Error(
                "Shop information was not returned."
            );

        }


        // ========================================
        // SAVE PRODUCTS
        // ========================================

        allProducts =
            Array.isArray(
                shopData.products
            )
                ? shopData.products
                : [];


        // ========================================
        // RENDER SHOP
        // ========================================

        renderShop(
            shopData
        );


        // ========================================
        // RENDER PRODUCTS
        // ========================================

        renderProducts(
            allProducts
        );


        // ========================================
        // UPDATE CART
        // ========================================

        updateCartCount();


        hideMessage();


    } catch (error) {

        console.error(
            "Load public shop error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to load shop.",
            "error"
        );


        renderShopError();

    }

}


// ========================================
// RENDER SHOP
// ========================================

function renderShop(shop) {

    if (!shopHeader) {
        return;
    }


    const shopName =
        escapeHtml(
            shop.name ||
            "Unnamed Shop"
        );


    const description =
        escapeHtml(
            shop.description ||
            "No description provided."
        );


    const category =
        escapeHtml(
            shop.category ||
            "General"
        );


    const logo =
        shop.logo ||
        "";


    const productCount =
        Array.isArray(shop.products)
            ? shop.products.length
            : 0;


    const logoHtml =
        logo
            ? `
                <img
                    src="${getImageUrl(logo)}"
                    alt="${escapeAttribute(
                        shop.name ||
                        "Shop"
                    )}"
                    onerror="this.style.display='none'; this.parentElement.innerHTML='🏪';"
                >
            `
            : `
                🏪
            `;


    shopHeader.innerHTML = `

        <div class="shop-header-content">

            <div class="shop-logo">

                ${logoHtml}

            </div>


            <div class="shop-info">

                <span class="shop-category">
                    ${category}
                </span>


                <h1 class="shop-name">
                    ${shopName}
                </h1>


                <p class="shop-description">
                    ${description}
                </p>


                <div class="shop-meta">

                    <span class="shop-meta-item">
                        🛍️
                        ${productCount}
                        ${
                            productCount === 1
                                ? "Product"
                                : "Products"
                        }
                    </span>


                    <span class="shop-meta-item">
                        🏪
                        Shop #${Number(shop.id) || "-"}
                    </span>

                </div>

            </div>

        </div>

    `;


    if (productCountText) {

        productCountText.textContent =
            `${productCount} ${
                productCount === 1
                    ? "product"
                    : "products"
            } available from this shop.`;

    }


    document.title =
        `${shop.name || "Shop"} | Digital Marketplace`;

}


// ========================================
// RENDER SHOP ERROR
// ========================================

function renderShopError() {

    if (!shopHeader) {
        return;
    }


    shopHeader.innerHTML = `

        <div class="shop-header-content">

            <div class="shop-info">

                <span class="shop-category">
                    Marketplace
                </span>


                <h1 class="shop-name">
                    Unable to load shop
                </h1>


                <p class="shop-description">
                    We could not retrieve this shop right now.
                    Please try again.
                </p>


                <div class="shop-meta">

                    <a
                        href="./index.html"
                        class="back-link"
                    >
                        ← Back to Marketplace
                    </a>

                </div>

            </div>

        </div>

    `;

}


// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts(products) {

    if (!productsGrid) {
        return;
    }


    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        productsGrid.innerHTML =
            "";


        if (emptyProducts) {

            emptyProducts.style.display =
                "block";

        }


        return;

    }


    if (emptyProducts) {

        emptyProducts.style.display =
            "none";

    }


    productsGrid.innerHTML =
        products
            .map(
                product =>
                    createProductCard(
                        product
                    )
            )
            .join("");

}


// ========================================
// CREATE PRODUCT CARD
// ========================================

function createProductCard(product) {

    const id =
        Number(product.id) || 0;


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


    const price =
        formatCurrency(
            product.price
        );


    const stock =
        Number(product.stock) || 0;


    const image =
        product.image ||
        "";


    const imageHtml =
        image
            ? `
                <img
                    src="${getImageUrl(image)}"
                    alt="${escapeAttribute(
                        product.name ||
                        "Product"
                    )}"
                    onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=&quot;product-image-placeholder&quot;>📦</div>';"
                >
            `
            : `
                <div class="product-image-placeholder">
                    📦
                </div>
            `;


    return `

        <article
            class="product-card"
            data-product-id="${id}"
        >

            <a
                href="./product.html?id=${id}"
                class="product-image"
            >

                ${imageHtml}


                <span class="stock-badge">
                    ${stock}
                    ${
                        stock === 1
                            ? " left"
                            : " in stock"
                    }
                </span>

            </a>


            <div class="product-content">

                <div class="product-category">
                    ${category}
                </div>


                <a
                    href="./product.html?id=${id}"
                >

                    <h3 class="product-name">
                        ${name}
                    </h3>

                </a>


                <p class="product-description">
                    ${description}
                </p>


                <div class="product-bottom">

                    <strong class="product-price">
                        ${price}
                    </strong>


                    <button
                        type="button"
                        class="add-cart-button"
                        onclick="addToCart(${id})"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </article>

    `;

}


// ========================================
// SEARCH PRODUCTS
// ========================================

function filterProducts() {

    const searchTerm =
        productSearch
            ? productSearch.value
                .trim()
                .toLowerCase()
            : "";


    if (!searchTerm) {

        renderProducts(
            allProducts
        );

        return;

    }


    const filteredProducts =
        allProducts.filter(
            product => {

                const name =
                    String(
                        product.name ||
                        ""
                    ).toLowerCase();


                const description =
                    String(
                        product.description ||
                        ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category ||
                        ""
                    ).toLowerCase();


                return (
                    name.includes(
                        searchTerm
                    ) ||
                    description.includes(
                        searchTerm
                    ) ||
                    category.includes(
                        searchTerm
                    )
                );

            }
        );


    renderProducts(
        filteredProducts
    );

}


// ========================================
// ADD TO CART
// ========================================

function addToCart(productId) {

    const product =
        allProducts.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (!product) {

        showMessage(
            "Product not found.",
            "error"
        );

        return;

    }


    const stock =
        Number(product.stock) || 0;


    if (stock <= 0) {

        showMessage(
            "This product is out of stock.",
            "error"
        );

        return;

    }


    let cart =
        getCart();


    // ========================================
    // CHECK EXISTING PRODUCT
    // ========================================

    const existingItem =
        cart.find(
            item =>
                Number(item.product_id) ===
                Number(product.id)
        );


    if (existingItem) {

        const currentQuantity =
            Number(
                existingItem.quantity
            ) || 0;


        if (
            currentQuantity >=
            stock
        ) {

            showMessage(
                `Only ${stock} ${
                    stock === 1
                        ? "item is"
                        : "items are"
                } available.`,
                "error"
            );

            return;

        }


        existingItem.quantity =
            currentQuantity + 1;

    } else {

        cart.push({

            product_id:
                Number(product.id),

            shop_id:
                Number(shopId),

            name:
                product.name,

            price:
                Number(product.price) || 0,

            image:
                product.image || "",

            quantity:
                1,

            stock:
                stock,

            shop_name:
                shopData?.name || ""

        });

    }


    saveCart(
        cart
    );


    updateCartCount();


    showMessage(
        `${product.name} added to cart.`,
        "success"
    );


    setTimeout(
        hideMessage,
        1800
    );

}


// ========================================
// GET CART
// ========================================

function getCart() {

    try {

        const savedCart =
            localStorage.getItem(
                "cart"
            );


        if (!savedCart) {
            return [];
        }


        const parsed =
            JSON.parse(
                savedCart
            );


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Read cart error:",
            error
        );

        return [];

    }

}


// ========================================
// SAVE CART
// ========================================

function saveCart(cart) {

    try {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Save cart error:",
            error
        );

        showMessage(
            "Unable to save product to cart.",
            "error"
        );

    }

}


// ========================================
// UPDATE CART COUNT
// ========================================

function updateCartCount() {

    if (!cartCount) {
        return;
    }


    const cart =
        getCart();


    const totalQuantity =
        cart.reduce(
            (total, item) => {

                return (
                    total +
                    (
                        Number(
                            item.quantity
                        ) || 0
                    )
                );

            },
            0
        );


    cartCount.textContent =
        totalQuantity;

}


// ========================================
// IMAGE URL
// ========================================

function getImageUrl(image) {

    if (!image) {
        return "";
    }


    const imagePath =
        String(image);


    if (
        imagePath.startsWith(
            "http://"
        ) ||
        imagePath.startsWith(
            "https://"
        )
    ) {

        return imagePath;

    }


    if (
        imagePath.startsWith(
            "/"
        )
    ) {

        return `http://172.20.10.5:5000${imagePath}`;

    }


    return `http://172.20.10.5:5000/${imagePath}`;

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

    return escapeHtml(
        value
    );

}


// ========================================
// SEARCH EVENT
// ========================================

if (productSearch) {

    productSearch.addEventListener(
        "input",
        filterProducts
    );

}


// ========================================
// INITIAL CART COUNT
// ========================================

updateCartCount();

