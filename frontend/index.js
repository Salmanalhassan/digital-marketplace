// ========================================
// DIGITAL MARKETPLACE
// PUBLIC INDEX.JS
// ========================================


// ========================================
// API BASE URL
// ========================================
const API_BASE_URL =
    "http://172.20.10.5:5000/api";

// ========================================
// DOM ELEMENTS
// ========================================

const marketplaceSearch =
    document.getElementById("marketplaceSearch");

const topShopsGrid =
    document.getElementById("topShopsGrid");

const recentProductsGrid =
    document.getElementById("recentProductsGrid");

const shopsGrid =
    document.getElementById("shopsGrid");

const searchResultsSection =
    document.getElementById("searchResultsSection");

const searchResultsGrid =
    document.getElementById("searchResultsGrid");

const searchResultsText =
    document.getElementById("searchResultsText");

const marketplaceMessage =
    document.getElementById("marketplaceMessage");

const emptyState =
    document.getElementById("emptyState");

const cartCount =
    document.getElementById("cartCount");


// ========================================
// DATA
// ========================================

let allShops = [];

let allProducts = [];


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(message, type = "error") {

    if (!marketplaceMessage) {
        return;
    }

    marketplaceMessage.textContent = message;

    marketplaceMessage.className =
        `marketplace-message show ${type}`;
}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!marketplaceMessage) {
        return;
    }

    marketplaceMessage.textContent = "";

    marketplaceMessage.className =
        "marketplace-message";
}


// ========================================
// LOAD SHOPS
// ========================================

async function loadShops() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/public/shops`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load shops."
            );
        }

        allShops =
            Array.isArray(data.shops)
                ? data.shops
                : [];

        renderTopShops(allShops);

        renderAllShops(allShops);

    } catch (error) {

        console.error(
            "Load shops error:",
            error
        );

        if (topShopsGrid) {
            topShopsGrid.innerHTML =
                emptyGridMessage(
                    "Unable to load shops."
                );
        }

        if (shopsGrid) {
            shopsGrid.innerHTML =
                emptyGridMessage(
                    "Unable to load shops."
                );
        }
    }
}


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/public/products`
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load products."
            );
        }

        allProducts =
            Array.isArray(data.products)
                ? data.products
                : [];

        renderRecentlyAdded(
            allProducts
        );

    } catch (error) {

        console.error(
            "Load products error:",
            error
        );

        allProducts = [];

        if (recentProductsGrid) {

            recentProductsGrid.innerHTML =
                emptyGridMessage(
                    "Unable to load products."
                );
        }
    }
}


// ========================================
// TOP SHOPS
// ========================================

function renderTopShops(shops) {

    if (!topShopsGrid) {
        return;
    }

    if (!Array.isArray(shops) || shops.length === 0) {

        topShopsGrid.innerHTML =
            emptyGridMessage(
                "No shops available yet."
            );

        return;
    }


    /*
     * Sort shops by product count.
     *
     * Shops with more products
     * appear first.
     */

    const topShops =
        [...shops]
            .sort(
                (a, b) => {

                    const aCount =
                        Number(
                            a.product_count ??
                            a.productCount ??
                            0
                        );

                    const bCount =
                        Number(
                            b.product_count ??
                            b.productCount ??
                            0
                        );

                    return bCount - aCount;
                }
            )
            .slice(0, 6);


    topShopsGrid.innerHTML =
        topShops
            .map(
                shop =>
                    createShopCard(shop)
            )
            .join("");
}


// ========================================
// ALL SHOPS
// ========================================

function renderAllShops(shops) {

    if (!shopsGrid) {
        return;
    }

    if (!Array.isArray(shops) || shops.length === 0) {

        shopsGrid.innerHTML =
            emptyGridMessage(
                "No shops available yet."
            );

        return;
    }

    shopsGrid.innerHTML =
        shops
            .map(
                shop =>
                    createShopCard(shop)
            )
            .join("");
}


// ========================================
// CREATE SHOP CARD
// ========================================

function createShopCard(shop) {

    const id =
        Number(shop.id) || 0;

    const name =
        escapeHtml(
            shop.name ||
            "Unnamed Shop"
        );

    const description =
        escapeHtml(
            shop.description ||
            "Quality products from a local vendor."
        );

    const category =
        escapeHtml(
            shop.category ||
            "General"
        );

    const logo =
        shop.logo ||
        shop.shop_logo ||
        "";

    const productCount =
        Number(
            shop.product_count ??
            shop.productCount ??
            0
        );

    const firstLetter =
        String(
            shop.name ||
            "S"
        )
            .charAt(0)
            .toUpperCase();


    const logoHtml =
        logo
            ? `
                <img
                    src="${escapeAttribute(
                        buildImageUrl(logo)
                    )}"
                    alt="${escapeAttribute(
                        shop.name || "Shop"
                    )}"
                    onerror="
                        this.style.display='none';
                        this.parentElement.classList.add('fallback');
                        this.parentElement.innerHTML='${firstLetter}';
                    "
                >
            `
            : `
                <span class="shop-logo-letter">
                    ${firstLetter}
                </span>
            `;


    return `
        <article
            class="shop-card"
            data-shop-id="${id}"
        >

            <div class="shop-card-top">

                <div class="shop-logo">
                    ${logoHtml}
                </div>

                <div class="shop-heading">

                    <h3>
                        ${name}
                    </h3>

                    <span class="shop-category">
                        ${category}
                    </span>

                </div>

            </div>


            <div class="shop-card-body">

                <p class="shop-description">
                    ${description}
                </p>


                <div class="shop-meta">

                    <span class="shop-products-count">
                        ${productCount}
                        ${
                            productCount === 1
                                ? "product"
                                : "products"
                        }
                    </span>


                    <a
                        href="./shop.html?id=${id}"
                        class="view-shop-button"
                    >
                        View Shop →
                    </a>

                </div>

            </div>

        </article>
    `;
}


// ========================================
// RECENTLY ADDED PRODUCTS
// ========================================

function renderRecentlyAdded(products) {

    if (!recentProductsGrid) {
        return;
    }

    if (!Array.isArray(products) || products.length === 0) {

        recentProductsGrid.innerHTML =
            emptyGridMessage(
                "No products available yet."
            );

        return;
    }


    /*
     * Sort by created_at.
     *
     * Newest products appear first.
     */

    const recentProducts =
        [...products]
            .sort(
                (a, b) => {

                    const dateA =
                        new Date(
                            a.created_at ||
                            a.createdAt ||
                            0
                        ).getTime();

                    const dateB =
                        new Date(
                            b.created_at ||
                            b.createdAt ||
                            0
                        ).getTime();

                    return dateB - dateA;
                }
            )
            .slice(0, 8);


    recentProductsGrid.innerHTML =
        recentProducts
            .map(
                product =>
                    createProductCard(product)
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

    const shopName =
        escapeHtml(
            product.shop_name ||
            product.shopName ||
            "Local Shop"
        );

    const image =
        product.image ||
        "";

    const price =
        formatCurrency(
            product.price
        );


    const imageHtml =
        image
            ? `
                <img
                    src="${escapeAttribute(
                        buildImageUrl(image)
                    )}"
                    alt="${escapeAttribute(
                        product.name ||
                        "Product"
                    )}"
                    onerror="
                        this.style.display='none';
                        this.parentElement.classList.add('image-error');
                    "
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

            </a>


            <div class="product-card-body">

                <h3>
                    ${name}
                </h3>


                <p class="product-shop">
                    ${shopName}
                </p>


                <div class="product-card-bottom">

                    <span class="product-price">
                        ${price}
                    </span>


                    <a
                        href="./product.html?id=${id}"
                        class="product-view-button"
                    >
                        View Product
                    </a>

                </div>

            </div>

        </article>
    `;
}


// ========================================
// SEARCH
// ========================================

function performSearch() {

    const searchTerm =
        marketplaceSearch
            ? marketplaceSearch.value
                .trim()
                .toLowerCase()
            : "";


    if (!searchTerm) {

        hideSearchResults();

        return;
    }


    const matchingShops =
        allShops.filter(
            shop => {

                const name =
                    String(
                        shop.name || ""
                    ).toLowerCase();

                const description =
                    String(
                        shop.description || ""
                    ).toLowerCase();

                const category =
                    String(
                        shop.category || ""
                    ).toLowerCase();

                return (
                    name.includes(searchTerm) ||
                    description.includes(searchTerm) ||
                    category.includes(searchTerm)
                );
            }
        );


    const matchingProducts =
        allProducts.filter(
            product => {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();

                const description =
                    String(
                        product.description || ""
                    ).toLowerCase();

                const category =
                    String(
                        product.category || ""
                    ).toLowerCase();

                const shopName =
                    String(
                        product.shop_name ||
                        product.shopName ||
                        ""
                    ).toLowerCase();

                return (
                    name.includes(searchTerm) ||
                    description.includes(searchTerm) ||
                    category.includes(searchTerm) ||
                    shopName.includes(searchTerm)
                );
            }
        );


    renderSearchResults(
        matchingShops,
        matchingProducts,
        searchTerm
    );
}


// ========================================
// SEARCH RESULTS
// ========================================

function renderSearchResults(
    shops,
    products,
    searchTerm
) {

    if (
        !searchResultsSection ||
        !searchResultsGrid
    ) {
        return;
    }


    if (topShopsGrid) {
        topShopsGrid.style.display = "none";
    }

    if (shopsGrid) {
        shopsGrid.style.display = "none";
    }

    if (recentProductsGrid) {
        recentProductsGrid.style.display = "none";
    }


    searchResultsSection.style.display =
        "block";


    const totalResults =
        shops.length +
        products.length;


    if (searchResultsText) {

        searchResultsText.textContent =
            `${totalResults} result${
                totalResults === 1
                    ? ""
                    : "s"
            } found for "${searchTerm}"`;
    }


    if (totalResults === 0) {

        searchResultsGrid.innerHTML = "";

        if (emptyState) {
            emptyState.style.display = "block";
        }

        return;
    }


    if (emptyState) {
        emptyState.style.display = "none";
    }


    const shopCards =
        shops
            .map(
                shop =>
                    createShopCard(shop)
            )
            .join("");


    const productCards =
        products
            .map(
                product =>
                    createProductCard(product)
            )
            .join("");


    searchResultsGrid.innerHTML =
        shopCards +
        productCards;
}


// ========================================
// HIDE SEARCH RESULTS
// ========================================

function hideSearchResults() {

    if (searchResultsSection) {
        searchResultsSection.style.display =
            "none";
    }

    if (topShopsGrid) {
        topShopsGrid.style.display = "grid";
    }

    if (shopsGrid) {
        shopsGrid.style.display = "grid";
    }

    if (recentProductsGrid) {
        recentProductsGrid.style.display = "grid";
    }

    if (emptyState) {
        emptyState.style.display = "none";
    }
}


// ========================================
// BUILD IMAGE URL
// ========================================

function buildImageUrl(image) {

    if (!image) {
        return "";
    }

    const value =
        String(image).trim();


    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }


    if (value.startsWith("/")) {

        return (
            "http://172.20.10.5:5000" +
            value
        );
    }


    if (value.startsWith("uploads/")) {

        return (
            "http://172.20.10.5:5000/" +
            value
        );
    }


    return (
        `${API_BASE_URL}/${value}`
    );
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
            minimumFractionDigits: 0
        }
    ).format(value);
}


// ========================================
// UPDATE CART COUNT
// ========================================

function updateCartCount() {

    if (!cartCount) {
        return;
    }


    let cart = [];


    try {

        const storedCart =
            localStorage.getItem("cart");


        if (storedCart) {

            const parsed =
                JSON.parse(storedCart);


            if (Array.isArray(parsed)) {

                /*
                 * Current cart structure:
                 *
                 * [
                 *   {
                 *      productId: 3,
                 *      name: "...",
                 *      quantity: 2
                 *   }
                 * ]
                 */

                cart = parsed;
            }
        }

    } catch (error) {

        console.error(
            "Read cart error:",
            error
        );
    }


    const count =
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
        count;
}


// ========================================
// EMPTY GRID MESSAGE
// ========================================

function emptyGridMessage(message) {

    return `
        <div class="marketplace-empty">
            ${escapeHtml(message)}
        </div>
    `;
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


// ========================================
// SEARCH EVENT
// ========================================

if (marketplaceSearch) {

    marketplaceSearch.addEventListener(
        "input",
        performSearch
    );
}


// ========================================
// CART STORAGE EVENT
// ========================================

window.addEventListener(
    "storage",
    function (event) {

        if (event.key === "cart") {

            updateCartCount();
        }
    }
);


// ========================================
// INITIALIZE
// ========================================

async function initializeMarketplace() {

    updateCartCount();

    await Promise.all([
        loadShops(),
        loadProducts()
    ]);
}


// ========================================
// START
// ========================================

initializeMarketplace();