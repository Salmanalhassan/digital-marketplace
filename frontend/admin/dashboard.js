// ========================================
// ADMIN DASHBOARD
// ========================================


// ========================================
// API
// ========================================

const API_BASE_URL =
    "https://digital-marketplace-rikz.onrender.com/api";


// ========================================
// AUTHENTICATION
// ========================================

const adminToken =
    localStorage.getItem("adminToken");

const adminData =
    localStorage.getItem("admin");


// ========================================
// DOM ELEMENTS
// ========================================

const totalVendors =
    document.getElementById(
        "totalVendors"
    );

const totalShops =
    document.getElementById(
        "totalShops"
    );

const totalProducts =
    document.getElementById(
        "totalProducts"
    );

const totalOrders =
    document.getElementById(
        "totalOrders"
    );


const pendingOrders =
    document.getElementById(
        "pendingOrders"
    );

const processingOrders =
    document.getElementById(
        "processingOrders"
    );

const completedOrders =
    document.getElementById(
        "completedOrders"
    );

const cancelledOrders =
    document.getElementById(
        "cancelledOrders"
    );


const recentOrdersTableBody =
    document.getElementById(
        "recentOrdersTableBody"
    );


const adminDashboardMessage =
    document.getElementById(
        "adminDashboardMessage"
    );


const adminProfileName =
    document.getElementById(
        "adminProfileName"
    );

const adminProfileEmail =
    document.getElementById(
        "adminProfileEmail"
    );

const adminProfileAvatar =
    document.getElementById(
        "adminProfileAvatar"
    );

const welcomeAdminName =
    document.getElementById(
        "welcomeAdminName"
    );


const adminLogoutButton =
    document.getElementById(
        "adminLogoutButton"
    );


const adminSidebarToggle =
    document.getElementById(
        "adminSidebarToggle"
    );


// ========================================
// CHECK LOGIN
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

    if (!adminDashboardMessage) {
        return;
    }


    adminDashboardMessage.textContent =
        message;


    adminDashboardMessage.className =
        `admin-dashboard-message show ${type}`;

}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!adminDashboardMessage) {
        return;
    }


    adminDashboardMessage.textContent =
        "";


    adminDashboardMessage.className =
        "admin-dashboard-message";

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

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
// STATUS CLASS
// ========================================

function getStatusClass(
    status
) {

    return String(
        status || "pending"
    )
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );

}


// ========================================
// STATUS LABEL
// ========================================

function getStatusLabel(
    status
) {

    const value =
        String(
            status || "pending"
        ).toLowerCase();


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


// ========================================
// LOAD ADMIN INFORMATION
// ========================================

function loadAdminInformation() {

    if (!adminData) {
        return;
    }


    try {

        const admin =
            JSON.parse(
                adminData
            );


        const name =
            admin.name ||
            "Admin";


        const email =
            admin.email ||
            "admin@digitalmarketplace.com";


        if (adminProfileName) {

            adminProfileName.textContent =
                name;

        }


        if (adminProfileEmail) {

            adminProfileEmail.textContent =
                email;

        }


        if (welcomeAdminName) {

            welcomeAdminName.textContent =
                name;

        }


        if (adminProfileAvatar) {

            adminProfileAvatar.textContent =
                name
                    .charAt(0)
                    .toUpperCase();

        }


    } catch (error) {

        console.error(
            "Admin data error:",
            error
        );

    }

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
// SET NUMBER SAFELY
// ========================================

function setNumber(
    element,
    value
) {

    if (!element) {
        return;
    }


    element.textContent =
        Number(value) || 0;

}


// ========================================
// EXTRACT DASHBOARD DATA
// ========================================

function extractDashboardData(
    data
) {

    /*
        The backend may return dashboard
        information in different containers.

        We support:

        data
        data.dashboard
        data.stats
        data.data
    */


    const container =
        data.dashboard ||
        data.stats ||
        data.data ||
        data;


    return container || {};

}


// ========================================
// GET VALUE
// ========================================

function getValue(
    object,
    keys,
    fallback = 0
) {

    for (
        const key of keys
    ) {

        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null
        ) {

            return object[key];

        }

    }


    return fallback;

}


// ========================================
// NORMALIZE STATUS COUNTS
// ========================================

function getStatusCounts(
    dashboardData,
    orders
) {

    const statusData =
        dashboardData.statusCounts ||
        dashboardData.status_counts ||
        dashboardData.orderStatusCounts ||
        dashboardData.order_status_counts ||
        dashboardData.ordersByStatus ||
        dashboardData.orders_by_status ||
        {};


    let pending =
        getValue(
            statusData,
            [
                "pending",
                "Pending"
            ],
            null
        );


    let processing =
        getValue(
            statusData,
            [
                "processing",
                "Processing"
            ],
            null
        );


    let completed =
        getValue(
            statusData,
            [
                "completed",
                "Completed"
            ],
            null
        );


    let cancelled =
        getValue(
            statusData,
            [
                "cancelled",
                "canceled",
                "Cancelled",
                "Canceled"
            ],
            null
        );


    /*
        If backend didn't provide status
        counts directly, calculate them
        from the returned orders.
    */


    if (
        pending === null ||
        processing === null ||
        completed === null ||
        cancelled === null
    ) {

        const calculated = {
            pending: 0,
            processing: 0,
            completed: 0,
            cancelled: 0
        };


        orders.forEach(
            function (order) {

                const status =
                    String(
                        order.status ||
                        "pending"
                    )
                        .toLowerCase()
                        .trim();


                if (
                    status === "pending"
                ) {

                    calculated.pending++;

                } else if (
                    status === "processing"
                ) {

                    calculated.processing++;

                } else if (
                    status === "completed"
                ) {

                    calculated.completed++;

                } else if (
                    status === "cancelled" ||
                    status === "canceled"
                ) {

                    calculated.cancelled++;

                }

            }
        );


        if (pending === null) {
            pending =
                calculated.pending;
        }


        if (processing === null) {
            processing =
                calculated.processing;
        }


        if (completed === null) {
            completed =
                calculated.completed;
        }


        if (cancelled === null) {
            cancelled =
                calculated.cancelled;
        }

    }


    return {
        pending:
            Number(pending) || 0,

        processing:
            Number(processing) || 0,

        completed:
            Number(completed) || 0,

        cancelled:
            Number(cancelled) || 0
    };

}


// ========================================
// RENDER STATISTICS
// ========================================

function renderStatistics(
    data
) {

    const dashboardData =
        extractDashboardData(
            data
        );


    const vendors =
        getValue(
            dashboardData,
            [
                "totalVendors",
                "total_vendors",
                "vendors",
                "vendorCount",
                "vendor_count"
            ]
        );


    const shops =
        getValue(
            dashboardData,
            [
                "totalShops",
                "total_shops",
                "shops",
                "shopCount",
                "shop_count"
            ]
        );


    const products =
        getValue(
            dashboardData,
            [
                "totalProducts",
                "total_products",
                "products",
                "productCount",
                "product_count"
            ]
        );


    const orders =
        getValue(
            dashboardData,
            [
                "totalOrders",
                "total_orders",
                "orders",
                "orderCount",
                "order_count"
            ]
        );


    setNumber(
        totalVendors,
        vendors
    );


    setNumber(
        totalShops,
        shops
    );


    setNumber(
        totalProducts,
        products
    );


    setNumber(
        totalOrders,
        orders
    );

}


// ========================================
// GET RECENT ORDERS
// ========================================

function getRecentOrders(
    data
) {

    const dashboardData =
        extractDashboardData(
            data
        );


    let orders =
        dashboardData.recentOrders ||
        dashboardData.recent_orders ||
        dashboardData.latestOrders ||
        dashboardData.latest_orders ||
        dashboardData.orders ||
        data.recentOrders ||
        data.recent_orders ||
        data.orders ||
        [];


    if (
        !Array.isArray(orders)
    ) {

        orders = [];

    }


    return orders;

}


// ========================================
// RENDER RECENT ORDERS
// ========================================

function renderRecentOrders(
    orders
) {

    if (!recentOrdersTableBody) {
        return;
    }


    recentOrdersTableBody.innerHTML =
        "";


    if (
        !Array.isArray(orders) ||
        orders.length === 0
    ) {

        recentOrdersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="admin-table-loading"
                >

                    No recent orders found.

                </td>

            </tr>

        `;


        return;

    }


    /*
        Show latest orders first.
        Limit dashboard table to 5.
    */

    const recentOrders =
        orders
            .slice()
            .sort(
                function (
                    a,
                    b
                ) {

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
            .slice(
                0,
                5
            );


    recentOrders.forEach(
        function (order) {

            const row =
                document.createElement(
                    "tr"
                );


            const status =
                order.status ||
                "pending";


            const statusClass =
                getStatusClass(
                    status
                );


            const statusLabel =
                getStatusLabel(
                    status
                );


            row.innerHTML = `

                <!-- ORDER -->

                <td>

                    <strong>

                        #${escapeHtml(
                            order.id
                        )}

                    </strong>

                </td>


                <!-- CUSTOMER -->

                <td>

                    <div
                        class="admin-customer-cell"
                    >

                        <strong>

                            ${escapeHtml(
                                order.customer_name ||
                                order.customerName ||
                                "Unknown Customer"
                            )}

                        </strong>

                        <small>

                            ${escapeHtml(
                                order.customer_phone ||
                                order.customerPhone ||
                                ""
                            )}

                        </small>

                    </div>

                </td>


                <!-- TOTAL -->

                <td>

                    <strong>

                        ${formatCurrency(
                            order.total_amount ??
                            order.totalAmount ??
                            order.total ??
                            0
                        )}

                    </strong>

                </td>


                <!-- STATUS -->

                <td>

                    <span
                        class="order-status ${statusClass}"
                    >

                        ${statusLabel}

                    </span>

                </td>


                <!-- DATE -->

                <td>

                    ${formatDate(
                        order.created_at ||
                        order.createdAt
                    )}

                </td>

            `;


            recentOrdersTableBody
                .appendChild(
                    row
                );

        }
    );

}


// ========================================
// RENDER ORDER OVERVIEW
// ========================================

function renderOrderOverview(
    data,
    orders
) {

    const dashboardData =
        extractDashboardData(
            data
        );


    const counts =
        getStatusCounts(
            dashboardData,
            orders
        );


    setNumber(
        pendingOrders,
        counts.pending
    );


    setNumber(
        processingOrders,
        counts.processing
    );


    setNumber(
        completedOrders,
        counts.completed
    );


    setNumber(
        cancelledOrders,
        counts.cancelled
    );

}


// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard() {

    hideMessage();


    if (
        recentOrdersTableBody
    ) {

        recentOrdersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="admin-table-loading"
                >

                    Loading...

                </td>

            </tr>

        `;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/admin/dashboard/stats`,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${adminToken}`,

                        "Content-Type":
                            "application/json"

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "Admin dashboard response:",
            data
        );


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
                "Failed to load dashboard."
            );

        }


        // ========================================
        // STATISTICS
        // ========================================

        renderStatistics(
            data
        );


        // ========================================
        // RECENT ORDERS
        // ========================================

        const orders =
            getRecentOrders(
                data
            );


        renderRecentOrders(
            orders
        );


        // ========================================
        // ORDER STATUS
        // ========================================

        renderOrderOverview(
            data,
            orders
        );


    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );


        if (
            recentOrdersTableBody
        ) {

            recentOrdersTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="admin-table-loading"
                    >

                        Unable to load recent orders.

                    </td>

                </tr>

            `;

        }


        showMessage(
            error.message ||
            "Unable to load dashboard.",
            "error"
        );

    }

}


// ========================================
// LOGOUT
// ========================================

if (
    adminLogoutButton
) {

    adminLogoutButton.addEventListener(
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

if (
    adminSidebarToggle
) {

    adminSidebarToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "sidebar-open"
            );

        }
    );

}


// ========================================
// INITIALIZE
// ========================================

loadAdminInformation();

loadDashboard();

