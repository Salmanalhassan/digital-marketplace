
// ========================================
// ADMIN PRODUCTS
// ========================================


// ========================================
// API BASE URL
// ========================================

const API_BASE_URL =
    "https://digital-marketplace-rikz.onrender.com/api";


// ========================================
// ADMIN TOKEN
// ========================================

const adminToken =
    localStorage.getItem("adminToken");


// ========================================
// DOM ELEMENTS
// ========================================

const productsTableBody =
    document.getElementById("productsTableBody");

const productSearch =
    document.getElementById("productSearch");

const statusFilter =
    document.getElementById("statusFilter");

const totalProducts =
    document.getElementById("totalProducts");

const productMessage =
    document.getElementById("productMessage");

const emptyState =
    document.getElementById("emptyState");

const productModal =
    document.getElementById("productModal");

const productDetails =
    document.getElementById("productDetails");

const closeProductModal =
    document.getElementById("closeProductModal");

const logoutButton =
    document.getElementById("logoutButton");

const sidebarToggle =
    document.getElementById("sidebarToggle");

const adminName =
    document.getElementById("adminName");

const adminAvatar =
    document.getElementById("adminAvatar");


// ========================================
// PRODUCTS DATA
// ========================================

let allProducts = [];


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
// AUTH HEADERS
// ========================================

function getAuthHeaders() {

    return {

        "Authorization":
            `Bearer ${adminToken}`,

        "Content-Type":
            "application/json"

    };

}


// ========================================
// LOAD ADMIN INFORMATION
// ========================================

function loadAdminInformation() {

    try {

        const adminData =
            localStorage.getItem("admin");

        if (!adminData) {
            return;
        }

        const admin =
            JSON.parse(adminData);

        const name =
            admin.name ||
            admin.username ||
            "Admin";

        if (adminName) {

            adminName.textContent =
                name;

        }

        if (adminAvatar) {

            adminAvatar.textContent =
                name
                    .charAt(0)
                    .toUpperCase();

        }

    } catch (error) {

        console.error(
            "Load admin information error:",
            error
        );

    }

}


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    showMessage(
        "Loading products...",
        "loading"
    );

    if (productsTableBody) {

        productsTableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="table-loading"
                >
                    Loading products...
                </td>
            </tr>
        `;

    }

    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/admin/products`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );


        const data =
            await response.json();


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
                "Failed to load products."
            );

        }


        // ========================================
        // SAVE PRODUCTS
        // ========================================

        allProducts =
            Array.isArray(data.products)
                ? data.products
                : [];


        // ========================================
        // UPDATE TOTAL
        // ========================================

        updateTotalProducts(
            allProducts.length
        );


        // ========================================
        // RENDER PRODUCTS
        // ========================================

        renderProducts(
            allProducts
        );


        hideMessage();


    } catch (error) {

        console.error(
            "Load admin products error:",
            error
        );


        if (productsTableBody) {

            productsTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        class="table-loading"
                    >
                        Unable to load products.
                    </td>
                </tr>
            `;

        }


        showMessage(
            error.message ||
            "Unable to load products.",
            "error"
        );

    }

}


// ========================================
// UPDATE TOTAL PRODUCTS
// ========================================

function updateTotalProducts(count) {

    if (!totalProducts) {
        return;
    }

    totalProducts.textContent =
        Number(count) || 0;

}


// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts(products) {

    if (!productsTableBody) {
        return;
    }


    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        productsTableBody.innerHTML =
            "";

        if (emptyState) {

            emptyState.style.display =
                "block";

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    productsTableBody.innerHTML =
        products
            .map(
                product =>
                    createProductRow(product)
            )
            .join("");

}


// ========================================
// CREATE PRODUCT ROW
// ========================================

function createProductRow(product) {

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
            "Unknown Shop"
        );


    const vendorName =
        escapeHtml(
            product.vendor_name ||
            product.vendorName ||
            "Unknown Vendor"
        );


    const price =
        formatCurrency(
            product.price
        );


    const stock =
        Number(product.stock) || 0;


    const status =
        String(
            product.status ||
            "inactive"
        ).toLowerCase();


    const image =
        product.image ||
        "";


    const createdAt =
        formatDate(
            product.created_at
        );


    // ========================================
    // STOCK CLASS
    // ========================================

    let stockClass =
        "stock-good";


    if (stock === 0) {

        stockClass =
            "stock-out";

    } else if (stock <= 5) {

        stockClass =
            "stock-low";

    }


    // ========================================
    // STATUS CLASS
    // ========================================

    const statusClass =
        status === "active"
            ? "active"
            : "inactive";


    // ========================================
    // ACTION BUTTON
    // ========================================

    const actionButton =
        status === "active"

            ? `
                <button
                    type="button"
                    class="action-button deactivate-button"
                    onclick="changeProductStatus(${id}, 'inactive')"
                >
                    Deactivate
                </button>
            `

            : `
                <button
                    type="button"
                    class="action-button activate-button"
                    onclick="changeProductStatus(${id}, 'active')"
                >
                    Activate
                </button>
            `;


    // ========================================
    // PRODUCT IMAGE
    // ========================================

    const imageHtml =
        image

            ? `
                <img
                    src="${getImageUrl(image)}"
                    alt="${escapeAttribute(
                        product.name ||
                        "Product"
                    )}"
                    onerror="this.style.display='none'"
                >
            `

            : `
                <span>📦</span>
            `;


    // ========================================
    // RETURN ROW
    // ========================================

    return `
        <tr>

            <!-- PRODUCT -->

            <td>

                <div class="product-cell">

                    <div class="product-image">

                        ${imageHtml}

                    </div>


                    <div class="product-info">

                        <strong>
                            ${name}
                        </strong>

                        <span>
                            ID: ${id}
                        </span>

                    </div>

                </div>

            </td>


            <!-- SHOP -->

            <td>

                <div class="shop-cell">

                    <strong>
                        ${shopName}
                    </strong>

                    <span>
                        Shop #${
                            Number(product.shop_id) || "-"
                        }
                    </span>

                </div>

            </td>


            <!-- VENDOR -->

            <td>

                <div class="vendor-cell">

                    <strong>
                        ${vendorName}
                    </strong>

                    <span>
                        Vendor #${
                            Number(product.vendor_id) || "-"
                        }
                    </span>

                </div>

            </td>


            <!-- PRICE -->

            <td>

                <span class="price-cell">

                    ${price}

                </span>

            </td>


            <!-- STOCK -->

            <td>

                <span
                    class="stock-cell ${stockClass}"
                >
                    ${stock}
                </span>

            </td>


            <!-- STATUS -->

            <td>

                <span
                    class="status-badge ${statusClass}"
                >
                    ${escapeHtml(status)}
                </span>

            </td>


            <!-- CREATED -->

            <td>

                ${createdAt}

            </td>


            <!-- ACTION -->

            <td>

                <div class="action-buttons">

                    <button
                        type="button"
                        class="action-button view-button"
                        onclick="viewProduct(${id})"
                    >
                        View
                    </button>

                    ${actionButton}

                </div>

            </td>

        </tr>
    `;

}


// ========================================
// GET IMAGE URL
// ========================================

function getImageUrl(image) {

    if (!image) {
        return "";
    }


    // Already complete URL

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }


    // Backend already returns /uploads/...

    if (image.startsWith("/")) {

        return `https://digital-marketplace-rikz.onrender.com${image}`;

    }


    // If only filename/path was returned

    return `https://digital-marketplace-rikz.onrender.com/uploads/${image}`;

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


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const filteredProducts =
        allProducts.filter(
            product => {

                const name =
                    String(
                        product.name ||
                        ""
                    ).toLowerCase();


                const shopName =
                    String(
                        product.shop_name ||
                        product.shopName ||
                        ""
                    ).toLowerCase();


                const vendorName =
                    String(
                        product.vendor_name ||
                        product.vendorName ||
                        ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category ||
                        ""
                    ).toLowerCase();


                const productStatus =
                    String(
                        product.status ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    !searchTerm ||
                    name.includes(searchTerm) ||
                    shopName.includes(searchTerm) ||
                    vendorName.includes(searchTerm) ||
                    category.includes(searchTerm);


                const matchesStatus =
                    selectedStatus === "all" ||
                    productStatus === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    renderProducts(
        filteredProducts
    );

}


// ========================================
// VIEW PRODUCT
// ========================================

async function viewProduct(productId) {

    if (!productId) {
        return;
    }


    try {

        showMessage(
            "Loading product details...",
            "loading"
        );


        const response =
            await fetch(
                `${API_BASE_URL}/admin/products/${productId}`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );


        const data =
            await response.json();


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized();

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


        renderProductDetails(
            data.product
        );


        openProductModal();


        hideMessage();


    } catch (error) {

        console.error(
            "View product error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to load product details.",
            "error"
        );

    }

}


// ========================================
// RENDER PRODUCT DETAILS
// ========================================

function renderProductDetails(product) {

    if (!productDetails) {
        return;
    }


    const name =
        escapeHtml(
            product.name ||
            "N/A"
        );


    const description =
        escapeHtml(
            product.description ||
            "No description provided."
        );


    const category =
        escapeHtml(
            product.category ||
            "N/A"
        );


    const shopName =
        escapeHtml(
            product.shop_name ||
            product.shopName ||
            "N/A"
        );


    const vendorName =
        escapeHtml(
            product.vendor_name ||
            product.vendorName ||
            "N/A"
        );


    const status =
        escapeHtml(
            product.status ||
            "N/A"
        );


    const price =
        formatCurrency(
            product.price
        );


    const stock =
        Number(product.stock) || 0;


    const created =
        formatDate(
            product.created_at
        );


    const image =
        product.image
            ? `
                <div class="detail-image-wrapper">
                    <img
                        src="${getImageUrl(product.image)}"
                        alt="${escapeAttribute(
                            product.name ||
                            "Product"
                        )}"
                        class="detail-product-image"
                        onerror="this.style.display='none'"
                    >
                </div>
            `
            : "";


    productDetails.innerHTML = `

        ${image}

        <div class="detail-section">

            <div class="detail-item">

                <span>
                    Product Name
                </span>

                <strong>
                    ${name}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Product ID
                </span>

                <strong>
                    ${
                        Number(product.id) ||
                        "N/A"
                    }
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Shop
                </span>

                <strong>
                    ${shopName}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Vendor
                </span>

                <strong>
                    ${vendorName}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Category
                </span>

                <strong>
                    ${category}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Price
                </span>

                <strong>
                    ${price}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Stock
                </span>

                <strong>
                    ${stock}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Status
                </span>

                <strong>
                    ${status}
                </strong>

            </div>


            <div class="detail-item full">

                <span>
                    Description
                </span>

                <strong>
                    ${description}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Created
                </span>

                <strong>
                    ${created}
                </strong>

            </div>

        </div>

    `;

}


// ========================================
// OPEN MODAL
// ========================================

function openProductModal() {

    if (!productModal) {
        return;
    }


    productModal.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";

}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    if (!productModal) {
        return;
    }


    productModal.style.display =
        "none";


    document.body.style.overflow =
        "";

}


// ========================================
// CHANGE PRODUCT STATUS
// ========================================

async function changeProductStatus(
    productId,
    newStatus
) {

    if (!productId) {
        return;
    }


    if (
        newStatus !== "active" &&
        newStatus !== "inactive"
    ) {

        return;

    }


    const actionText =
        newStatus === "active"
            ? "activate"
            : "deactivate";


    const confirmed =
        window.confirm(
            `Are you sure you want to ${actionText} this product?`
        );


    if (!confirmed) {
        return;
    }


    try {

        showMessage(
            `${actionText}ing product...`,
            "loading"
        );


        const response =
            await fetch(
                `${API_BASE_URL}/admin/products/${productId}/status`,
                {
                    method: "PATCH",

                    headers:
                        getAuthHeaders(),

                    body:
                        JSON.stringify({
                            status:
                                newStatus
                        })
                }
            );


        const data =
            await response.json();


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleUnauthorized();

            return;

        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to update product status."
            );

        }


        // ========================================
        // UPDATE LOCAL PRODUCT
        // ========================================

        const product =
            allProducts.find(
                item =>
                    Number(item.id) ===
                    Number(productId)
            );


        if (product) {

            product.status =
                newStatus;

        }


        // ========================================
        // RE-RENDER
        // ========================================

        filterProducts();


        showMessage(
            data.message ||
            "Product status updated successfully.",
            "success"
        );


        setTimeout(
            hideMessage,
            2500
        );


    } catch (error) {

        console.error(
            "Change product status error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to update product status.",
            "error"
        );

    }

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
// FORMAT DATE
// ========================================

function formatDate(value) {

    if (!value) {
        return "N/A";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "N/A";

    }


    return date.toLocaleDateString(
        "en-NG",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
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
// STATUS FILTER EVENT
// ========================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterProducts
    );

}


// ========================================
// CLOSE MODAL
// ========================================

if (closeProductModal) {

    closeProductModal.addEventListener(
        "click",
        closeModal
    );

}


// ========================================
// CLOSE MODAL BY CLICKING OUTSIDE
// ========================================

if (productModal) {

    productModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                productModal
            ) {

                closeModal();

            }

        }
    );

}


// ========================================
// CLOSE MODAL WITH ESC
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "adminToken"
            );

            localStorage.removeItem(
                "admin"
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
        ".admin-navigation a"
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
// INITIALIZE
// ========================================

loadAdminInformation();

loadProducts();

