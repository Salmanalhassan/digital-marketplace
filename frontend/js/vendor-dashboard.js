// =========================
// VENDOR DASHBOARD
// =========================


const API_BASE_URL =
    "http://172.20.10.5:5000/api";


// =========================
// AUTHENTICATION
// =========================

const vendorToken =
    localStorage.getItem("vendorToken");


if (!vendorToken) {

    window.location.href =
        "./login.html";

}


// =========================
// DOM ELEMENTS
// =========================

const vendorNameElement =
    document.getElementById("vendorName");

const vendorShopNameElement =
    document.getElementById("vendorShopName");

const vendorAvatarElement =
    document.getElementById("vendorAvatar");

const overviewShopNameElement =
    document.getElementById("overviewShopName");

const overviewShopCategoryElement =
    document.getElementById("overviewShopCategory");

const overviewShopDescriptionElement =
    document.getElementById(
        "overviewShopDescription"
    );

const totalOrdersElement =
    document.getElementById("totalOrders");

const pendingOrdersElement =
    document.getElementById("pendingOrders");

const completedOrdersElement =
    document.getElementById("completedOrders");

    const totalProductsElement =
    document.getElementById("totalProducts");

const recentOrdersElement =
    document.getElementById("recentOrders");

const logoutButton =
    document.getElementById("logoutButton");

const sidebarToggle =
    document.getElementById("sidebarToggle");

const sidebar =
    document.querySelector(
        ".vendor-sidebar"
    );


// =========================
// LOAD VENDOR DATA
// =========================

function loadVendorData() {

    const vendorData =
        localStorage.getItem(
            "vendor"
        );


    if (!vendorData) {
        return;
    }


    try {

        const vendor =
            JSON.parse(vendorData);


        if (vendor.name) {

            vendorNameElement.textContent =
                vendor.name;


            vendorAvatarElement.textContent =
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
//////////////////////////////////////
// =========================
// LOAD VENDOR PRODUCTS
// =========================

async function loadVendorProducts() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/products`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${vendorToken}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleAuthenticationError();

            return;

        }


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load vendor products"
            );

        }


        const products =
            data.products || [];


        totalProductsElement.textContent =
            products.length;


    } catch (error) {

        console.error(
            "Load vendor products error:",
            error
        );


        totalProductsElement.textContent =
            "0";

    }

}
// =========================
// LOAD ORDERS
// =========================

async function loadVendorOrders() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/orders`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${vendorToken}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            handleAuthenticationError();

            return;

        }


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load vendor orders"
            );

        }


        // =========================
        // SHOP INFORMATION
        // =========================

        if (data.shop) {

            vendorShopNameElement.textContent =
                data.shop.name;

            overviewShopNameElement.textContent =
                data.shop.name;

        }


        // =========================
        // ORDERS
        // =========================

        const orders =
            data.orders || [];


        updateOrderStatistics(
            orders
        );


        renderRecentOrders(
            orders
        );


    } catch (error) {

        console.error(
            "Load vendor orders error:",
            error
        );


        recentOrdersElement.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠
                </div>

                <h3>
                    Unable to load orders
                </h3>

                <p>
                    Please refresh the page and try again.
                </p>

            </div>

        `;

    }

}


// =========================
// UPDATE ORDER STATISTICS
// =========================

function updateOrderStatistics(
    orders
) {

    const totalOrders =
        orders.length;


    const pendingOrders =
        orders.filter(
            order =>
                order.status ===
                "pending"
        ).length;


    const completedOrders =
        orders.filter(
            order =>
                order.status ===
                "completed"
        ).length;


    totalOrdersElement.textContent =
        totalOrders;


    pendingOrdersElement.textContent =
        pendingOrders;


    completedOrdersElement.textContent =
        completedOrders;

}


// =========================
// RENDER RECENT ORDERS
// =========================

function renderRecentOrders(
    orders
) {

    if (
        !orders ||
        orders.length === 0
    ) {

        recentOrdersElement.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🛒
                </div>

                <h3>
                    No orders yet
                </h3>

                <p>
                    Customer orders will appear here.
                </p>

            </div>

        `;

        return;

    }


    const recentOrders =
        orders.slice(0, 5);


    recentOrdersElement.innerHTML =
        recentOrders
            .map(order => {

                return `

                    <div class="recent-order-item">

                        <div>

                            <strong>
                                Order #${order.id}
                            </strong>

                            <span>
                                ${order.customer_name}
                            </span>

                        </div>

                        <div>

                            <strong>
                                ${formatCurrency(
                                    order.total_amount
                                )}
                            </strong>

                            <span class="order-status ${getStatusClass(
                                order.status
                            )}">
                                ${capitalize(
                                    order.status
                                )}
                            </span>

                        </div>

                    </div>

                `;

            })
            .join("");

}


// =========================
// STATUS CLASS
// =========================

function getStatusClass(
    status
) {

    switch (status) {

        case "pending":
            return "status-pending";

        case "processing":
            return "status-processing";

        case "completed":
            return "status-completed";

        case "cancelled":
            return "status-cancelled";

        default:
            return "";

    }

}


// =========================
// CAPITALIZE
// =========================

function capitalize(
    value
) {

    if (!value) {
        return "";
    }


    return value
        .charAt(0)
        .toUpperCase() +
        value.slice(1);

}


// =========================
// FORMAT CURRENCY
// =========================

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


// =========================
// AUTH ERROR
// =========================

function handleAuthenticationError() {

    localStorage.removeItem(
        "vendorToken"
    );

    localStorage.removeItem(
        "vendor"
    );


    window.location.href =
        "./login.html";

}


// =========================
// LOGOUT
// =========================

logoutButton.addEventListener(
    "click",
    function() {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {
            return;
        }


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


// =========================
// MOBILE SIDEBAR
// =========================

sidebarToggle.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "open"
        );

    }
);


// =========================
// INITIALIZE
// =========================
loadVendorData();

loadVendorOrders();

loadVendorProducts();