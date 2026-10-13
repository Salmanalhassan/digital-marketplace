
// ========================================
// ADMIN VENDOR DETAILS
// ========================================


// ========================================
// API BASE URL
// ========================================

const API_BASE_URL = "http://172.20.10.5:5000/api";


// ========================================
// ADMIN TOKEN
// ========================================

const adminToken = localStorage.getItem("adminToken");


// ========================================
// GET VENDOR ID FROM URL
// ========================================

const urlParams = new URLSearchParams(
    window.location.search
);

const vendorId = urlParams.get("id");


// ========================================
// DOM ELEMENTS
// ========================================

const loadingElement = document.getElementById(
    "vendorDetailsLoading"
);

const contentElement = document.getElementById(
    "vendorDetailsContent"
);

const messageElement = document.getElementById(
    "vendorDetailsMessage"
);

const vendorAvatar = document.getElementById(
    "vendorAvatar"
);

const vendorName = document.getElementById(
    "vendorName"
);

const vendorUsername = document.getElementById(
    "vendorUsername"
);

const vendorStatus = document.getElementById(
    "vendorStatus"
);

const vendorIdElement = document.getElementById(
    "vendorId"
);

const vendorPhone = document.getElementById(
    "vendorPhone"
);

const vendorUsernameDetail = document.getElementById(
    "vendorUsernameDetail"
);

const vendorCreatedAt = document.getElementById(
    "vendorCreatedAt"
);

const totalVendorShops = document.getElementById(
    "totalVendorShops"
);

const totalVendorProducts = document.getElementById(
    "totalVendorProducts"
);

const totalVendorOrders = document.getElementById(
    "totalVendorOrders"
);

const vendorShopsContainer = document.getElementById(
    "vendorShopsContainer"
);

const vendorProductsTableBody = document.getElementById(
    "vendorProductsTableBody"
);

const vendorOrdersTableBody = document.getElementById(
    "vendorOrdersTableBody"
);


// ========================================
// CHECK ADMIN LOGIN
// ========================================

if (!adminToken) {

    window.location.href = "./login.html";

}


// ========================================
// CHECK VENDOR ID
// ========================================

if (!vendorId || isNaN(vendorId)) {

    showMessage(
        "Invalid vendor ID.",
        "error"
    );

    if (loadingElement) {
        loadingElement.style.display = "none";
    }

} else {

    loadVendorDetails();

}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(message, type = "error") {

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;

    messageElement.className =
        `vendor-details-message show ${type}`;

}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!messageElement) {
        return;
    }

    messageElement.textContent = "";

    messageElement.className =
        "vendor-details-message";

}


// ========================================
// HANDLE UNAUTHORIZED
// ========================================

function handleUnauthorized() {

    localStorage.removeItem("adminToken");

    localStorage.removeItem("admin");

    window.location.href = "./login.html";

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
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
// FORMAT CURRENCY
// ========================================

function formatCurrency(amount) {

    const value = Number(amount || 0);

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 2
        }
    ).format(value);

}


// ========================================
// STATUS LABEL
// ========================================

function getStatusLabel(status) {

    const value = String(
        status || "inactive"
    ).toLowerCase();

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


// ========================================
// LOAD VENDOR DETAILS
// ========================================

async function loadVendorDetails() {

    hideMessage();

    try {

        const response = await fetch(
            `${API_BASE_URL}/admin/vendor-details/${vendorId}/details`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${adminToken}`,
                    "Content-Type": "application/json"
                }
            }
        );


        // ========================================
        // READ RESPONSE
        // ========================================

        const data = await response.json();


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
                "Failed to load vendor details."
            );

        }


        // ========================================
        // GET DATA
        // ========================================

        const vendor = data.vendor || {};

        const shops = Array.isArray(data.shops)
            ? data.shops
            : [];

        const products = Array.isArray(data.products)
            ? data.products
            : [];

        const orders = Array.isArray(data.orders)
            ? data.orders
            : [];


        // ========================================
        // RENDER VENDOR
        // ========================================

        renderVendor(vendor);


        // ========================================
        // RENDER SHOPS
        // ========================================

        renderShops(shops);


        // ========================================
        // RENDER PRODUCTS
        // ========================================

        renderProducts(products);


        // ========================================
        // RENDER ORDERS
        // ========================================

        renderOrders(orders);


        // ========================================
        // HIDE LOADING
        // ========================================

        if (loadingElement) {

            loadingElement.style.display = "none";

        }


        // ========================================
        // SHOW CONTENT
        // ========================================

        if (contentElement) {

            contentElement.style.display = "flex";

        }


    } catch (error) {

        console.error(
            "Load vendor details error:",
            error
        );


        if (loadingElement) {

            loadingElement.style.display = "none";

        }


        showMessage(
            error.message ||
            "Unable to load vendor details.",
            "error"
        );

    }

}


// ========================================
// RENDER VENDOR
// ========================================

function renderVendor(vendor) {

    if (!vendor) {
        return;
    }


    // ========================================
    // VENDOR NAME
    // ========================================

    const name =
        vendor.name || "Vendor";


    // ========================================
    // USERNAME
    // ========================================

    const username =
        vendor.username || "N/A";


    // ========================================
    // STATUS
    // ========================================

    const status =
        String(
            vendor.status || "inactive"
        ).toLowerCase();


    // ========================================
    // AVATAR
    // ========================================

    if (vendorAvatar) {

        vendorAvatar.textContent =
            name.charAt(0).toUpperCase();

    }


    // ========================================
    // NAME
    // ========================================

    if (vendorName) {

        vendorName.textContent =
            name;

    }


    // ========================================
    // USERNAME
    // ========================================

    if (vendorUsername) {

        vendorUsername.textContent =
            `@${username}`;

    }


    // ========================================
    // STATUS
    // ========================================

    if (vendorStatus) {

        vendorStatus.textContent =
            getStatusLabel(status);

        vendorStatus.className =
            `vendor-status ${status}`;

    }


    // ========================================
    // ID
    // ========================================

    if (vendorIdElement) {

        vendorIdElement.textContent =
            vendor.id ?? "N/A";

    }


    // ========================================
    // PHONE
    // ========================================

    if (vendorPhone) {

        vendorPhone.textContent =
            vendor.phone || "N/A";

    }


    // ========================================
    // USERNAME DETAIL
    // ========================================

    if (vendorUsernameDetail) {

        vendorUsernameDetail.textContent =
            username;

    }


    // ========================================
    // CREATED AT
    // ========================================

    if (vendorCreatedAt) {

        vendorCreatedAt.textContent =
            formatDate(
                vendor.created_at
            );

    }

}


// ========================================
// RENDER SHOPS
// ========================================

function renderShops(shops) {

    // ========================================
    // TOTAL SHOPS
    // ========================================

    if (totalVendorShops) {

        totalVendorShops.textContent =
            shops.length;

    }


    // ========================================
    // CHECK CONTAINER
    // ========================================

    if (!vendorShopsContainer) {
        return;
    }


    // ========================================
    // CLEAR
    // ========================================

    vendorShopsContainer.innerHTML = "";


    // ========================================
    // NO SHOPS
    // ========================================

    if (
        !shops ||
        shops.length === 0
    ) {

        vendorShopsContainer.innerHTML = `

            <div class="vendor-table-empty">

                No shops found for this vendor.

            </div>

        `;

        return;

    }


    // ========================================
    // LOOP SHOPS
    // ========================================

    shops.forEach(function (shop) {

        const shopItem =
            document.createElement("div");


        shopItem.className =
            "vendor-shop-item";


        // ========================================
        // SHOP INITIAL
        // ========================================

        const shopInitial =
            (
                shop.name ||
                "S"
            )
                .charAt(0)
                .toUpperCase();


        // ========================================
        // DEFAULT LOGO
        // ========================================

        let logoHtml = `

            <span>
                ${escapeHtml(shopInitial)}
            </span>

        `;


        // ========================================
        // SHOP LOGO
        // ========================================

        if (shop.logo) {

            const logoUrl =
                shop.logo.startsWith("http")
                    ? shop.logo
                    : `http://172.20.10.5:5000/${String(
                        shop.logo
                    ).replace(/^\/+/, "")}`;


            logoHtml = `

                <img
                    src="${escapeHtml(logoUrl)}"
                    alt="${escapeHtml(
                        shop.name || "Shop"
                    )}"
                    onerror="
                        this.style.display='none';
                    "
                >

            `;

        }


        // ========================================
        // SHOP HTML
        // ========================================

        shopItem.innerHTML = `

            <div class="vendor-shop-logo">

                ${logoHtml}

            </div>


            <div class="vendor-shop-info">

                <h4>

                    ${escapeHtml(
                        shop.name ||
                        "Unnamed Shop"
                    )}

                </h4>


                <p>

                    ${escapeHtml(
                        shop.description ||
                        "No description"
                    )}

                </p>


                <div class="vendor-shop-meta">

                    <span>

                        ${escapeHtml(
                            shop.category ||
                            "Uncategorized"
                        )}

                    </span>


                    <span>

                        ${escapeHtml(
                            getStatusLabel(
                                shop.status ||
                                "inactive"
                            )
                        )}

                    </span>

                </div>

            </div>

        `;


        // ========================================
        // ADD SHOP TO PAGE
        // ========================================

        vendorShopsContainer.appendChild(
            shopItem
        );

    });

}


// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts(products) {

    // ========================================
    // TOTAL PRODUCTS
    // ========================================

    if (totalVendorProducts) {

        totalVendorProducts.textContent =
            products.length;

    }


    // ========================================
    // CHECK TABLE
    // ========================================

    if (!vendorProductsTableBody) {
        return;
    }


    // ========================================
    // CLEAR TABLE
    // ========================================

    vendorProductsTableBody.innerHTML =
        "";


    // ========================================
    // NO PRODUCTS
    // ========================================

    if (
        !products ||
        products.length === 0
    ) {

        vendorProductsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="vendor-table-empty"
                >

                    No products found.

                </td>

            </tr>

        `;

        return;

    }


    // ========================================
    // LOOP PRODUCTS
    // ========================================

    products.forEach(function (product) {

        const row =
            document.createElement("tr");


        const status =
            String(
                product.status ||
                "inactive"
            ).toLowerCase();


        row.innerHTML = `

            <td>

                ${escapeHtml(
                    product.id
                )}

            </td>


            <td>

                ${escapeHtml(
                    product.name ||
                    "N/A"
                )}

            </td>


            <td>

                ${escapeHtml(
                    product.category ||
                    "N/A"
                )}

            </td>


            <td>

                ${formatCurrency(
                    product.price
                )}

            </td>


            <td>

                ${escapeHtml(
                    product.stock ?? 0
                )}

            </td>


            <td>

                <span
                    class="vendor-item-status ${escapeHtml(
                        status
                    )}"
                >

                    ${escapeHtml(
                        getStatusLabel(
                            status
                        )
                    )}

                </span>

            </td>

        `;


        vendorProductsTableBody.appendChild(
            row
        );

    });

}


// ========================================
// RENDER ORDERS
// ========================================

function renderOrders(orders) {

    // ========================================
    // TOTAL ORDERS
    // ========================================

    if (totalVendorOrders) {

        totalVendorOrders.textContent =
            orders.length;

    }


    // ========================================
    // CHECK TABLE
    // ========================================

    if (!vendorOrdersTableBody) {
        return;
    }


    // ========================================
    // CLEAR TABLE
    // ========================================

    vendorOrdersTableBody.innerHTML =
        "";


    // ========================================
    // NO ORDERS
    // ========================================

    if (
        !orders ||
        orders.length === 0
    ) {

        vendorOrdersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="vendor-table-empty"
                >

                    No orders found.

                </td>

            </tr>

        `;

        return;

    }


    // ========================================
    // LOOP ORDERS
    // ========================================

    orders.forEach(function (order) {

        const row =
            document.createElement("tr");


        const status =
            String(
                order.status ||
                "pending"
            ).toLowerCase();


        row.innerHTML = `

            <td>

                #${escapeHtml(
                    order.id
                )}

            </td>


            <td>

                ${escapeHtml(
                    order.customer_name ||
                    "N/A"
                )}

            </td>


            <td>

                ${escapeHtml(
                    order.customer_phone ||
                    "N/A"
                )}

            </td>


            <td>

                ${formatCurrency(
                    order.total_amount
                )}

            </td>


            <td>

                <span
                    class="vendor-item-status ${escapeHtml(
                        status
                    )}"
                >

                    ${escapeHtml(
                        getStatusLabel(
                            status
                        )
                    )}

                </span>

            </td>


            <td>

                ${escapeHtml(
                    formatDate(
                        order.created_at
                    )
                )}

            </td>

        `;


        vendorOrdersTableBody.appendChild(
            row
        );

    });

}

