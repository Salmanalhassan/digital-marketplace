// ========================================
// VENDOR PRODUCTS
// ========================================

const API_BASE_URL = "https://digital-marketplace-rikz.onrender.com/api";


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

const productsTableBody =
    document.getElementById(
        "productsTableBody"
    );

const productsEmptyState =
    document.getElementById(
        "productsEmptyState"
    );

const productCount =
    document.getElementById(
        "productCount"
    );

const productMessage =
    document.getElementById(
        "productMessage"
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

const addProductButton =
    document.getElementById(
        "addProductButton"
    );

const emptyAddProductButton =
    document.getElementById(
        "emptyAddProductButton"
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
// CHECK LOGIN
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
// MESSAGE
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

    productMessage.textContent = "";

    productMessage.className =
        "product-message";

}


// ========================================
// FORMAT CURRENCY
// ========================================

function formatCurrency(
    amount
) {

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }
    ).format(
        Number(amount) || 0
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(
    value
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value ?? "";

    return div.innerHTML;

}

// ========================================
// PRODUCT IMAGE URL
// ========================================

function getProductImageUrl(image) {

    if (!image) {
        return "";
    }

    const imageValue =
        String(image).trim();

    // Already a complete URL
    if (
        imageValue.startsWith("http://") ||
        imageValue.startsWith("https://")
    ) {
        return imageValue;
    }

    // Backend returned /uploads/...
    if (
        imageValue.startsWith("/uploads/")
    ) {
        return `https://digital-marketplace-rikz.onrender.com${imageValue}`;
    }

    // Backend returned only filename
    return `https://digital-marketplace-rikz.onrender.com/uploads/products/${imageValue}`;
}
// ========================================
// GET STOCK CLASS
// ========================================

function getStockClass(
    stock
) {

    const quantity =
        Number(stock) || 0;


    if (quantity === 0) {

        return "out";

    }


    if (quantity <= 5) {

        return "low";

    }


    return "";

}


// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts(
    products
) {

    productsTableBody.innerHTML = "";

    productsEmptyState.style.display =
        "none";


    productCount.textContent =
        `${products.length} ${
            products.length === 1
                ? "Product"
                : "Products"
        }`;


    if (
        !products ||
        products.length === 0
    ) {

        productsTableBody.innerHTML = "";

        productsEmptyState.style.display =
            "block";

        return;

    }


    products.forEach(
        product => {

            const row =
                document.createElement(
                    "tr"
                );

const imageHtml =
    product.image

        ? `
            <img
                src="${escapeHtml(
                    getProductImageUrl(
                        product.image
                    )
                )}"
                alt="${escapeHtml(product.name)}"
                class="product-image"
                onerror="this.style.display='none';"
            >
        `

        : `
            <div class="product-image-placeholder">
                📦
            </div>
        `;

// ========================================
// PRODUCT IMAGE URL
// ========================================

            const stock =
                Number(product.stock) || 0;


            const stockClass =
                getStockClass(stock);


            const status =
                product.status === "active"
                    ? "Active"
                    : "Inactive";


            const statusClass =
                product.status === "active"
                    ? "active"
                    : "inactive";


            row.innerHTML = `

                <td>

                    <div class="product-cell">

                        ${imageHtml}

                        <div class="product-cell-info">

                            <div class="product-cell-name">
                                ${escapeHtml(product.name)}
                            </div>

                            <div class="product-cell-description">
                                ${
                                    escapeHtml(
                                        product.description ||
                                        "No description"
                                    )
                                }
                            </div>

                        </div>

                    </div>

                </td>


                <td>
                    ${
                        escapeHtml(
                            product.category ||
                            "Uncategorized"
                        )
                    }
                </td>


                <td>

                    <span class="product-price">
                        ${formatCurrency(product.price)}
                    </span>

                </td>


                <td>

                    <span
                        class="product-stock ${stockClass}"
                    >
                        ${stock}
                    </span>

                </td>


                <td>

                    <span
                        class="product-status ${statusClass}"
                    >
                        ${status}
                    </span>

                </td>


                <td>

                    <div class="product-actions">

                        <button
                            type="button"
                            class="product-action-button edit"
                            data-product-id="${product.id}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="product-action-button delete"
                            data-product-id="${product.id}"
                        >
                            Delete
                        </button>

                    </div>

                </td>

            `;


            productsTableBody.appendChild(
                row
            );

        }
    );

}


// ========================================
// GET VENDOR PRODUCTS
// ========================================

async function loadProducts() {

    hideMessage();


    productsTableBody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="products-loading"
            >
                Loading products...
            </td>

        </tr>

    `;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/products`,
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
                "Failed to load products."
            );

        }


        renderProducts(
            data.products || []
        );


    } catch (error) {

        console.error(
            "Load products error:",
            error
        );


        productsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="products-loading"
                >
                    Unable to load products.
                </td>

            </tr>

        `;


        showMessage(
            error.message ||
            "Unable to load products.",
            "error"
        );

    }

}


// ========================================
// ADD PRODUCT BUTTON
// ========================================

function openAddProduct() {

    window.location.href =
        "./add-product.html";

}


addProductButton.addEventListener(
    "click",
    openAddProduct
);


emptyAddProductButton.addEventListener(
    "click",
    openAddProduct
);

// ========================================
// OPEN EDIT PRODUCT
// ========================================

async function openEditProduct(productId) {

    hideMessage();


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


        console.log(
            "Product loaded for editing:",
            data.product
        );

window.location.href =
    `./edit-product.html?id=${productId}`;
    } catch (error) {

        console.error(
            "Edit product error:",
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
// DELETE PRODUCT
// ========================================

async function deleteProduct(productId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {
        return;
    }


    hideMessage();


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/products/${productId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${vendorToken}`
                    }
                }
            );


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
        // DELETE FAILED
        // ========================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to delete product."
            );

        }


        // ========================================
        // SUCCESS
        // ========================================

        showMessage(
            data.message ||
            "Product deleted successfully.",
            "success"
        );


        // Reload products

        await loadProducts();


    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to delete product.",
            "error"
        );

    }

}

// ========================================
// EDIT / DELETE PLACEHOLDER
// ========================================

productsTableBody.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".product-action-button"
            );


        if (!button) {
            return;
        }


        const productId =
            button.dataset.productId;

if (
    button.classList.contains(
        "edit"
    )
) {

    openEditProduct(productId);

    return;

}

if (
    button.classList.contains(
        "delete"
    )
) {

    deleteProduct(productId);

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

loadProducts();