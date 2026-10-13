
// ========================================
// ADMIN ORDERS
// ========================================


// ========================================
// API BASE URL
// ========================================

const API_BASE_URL =
    "http://172.20.10.5:5000/api";


// ========================================
// ADMIN TOKEN
// ========================================

const adminToken =
    localStorage.getItem("adminToken");


// ========================================
// DOM ELEMENTS
// ========================================

const ordersTableBody =
    document.getElementById("ordersTableBody");

const orderSearch =
    document.getElementById("orderSearch");

const statusFilter =
    document.getElementById("statusFilter");

const totalOrders =
    document.getElementById("totalOrders");

const pendingOrders =
    document.getElementById("pendingOrders");

const processingOrders =
    document.getElementById("processingOrders");

const completedOrders =
    document.getElementById("completedOrders");

const cancelledOrders =
    document.getElementById("cancelledOrders");

const orderMessage =
    document.getElementById("orderMessage");

const emptyState =
    document.getElementById("emptyState");

const orderModal =
    document.getElementById("orderModal");

const orderDetails =
    document.getElementById("orderDetails");

const closeOrderModal =
    document.getElementById("closeOrderModal");

const logoutButton =
    document.getElementById("logoutButton");

const sidebarToggle =
    document.getElementById("sidebarToggle");

const adminName =
    document.getElementById("adminName");

const adminAvatar =
    document.getElementById("adminAvatar");


// ========================================
// ORDERS DATA
// ========================================

let allOrders = [];


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

    if (!orderMessage) {
        return;
    }

    orderMessage.textContent =
        message;

    orderMessage.className =
        `order-message show ${type}`;

}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!orderMessage) {
        return;
    }

    orderMessage.textContent =
        "";

    orderMessage.className =
        "order-message";

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
// LOAD ORDERS
// ========================================

async function loadOrders() {

    showMessage(
        "Loading orders...",
        "loading"
    );

    if (ordersTableBody) {

        ordersTableBody.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="table-loading"
                >
                    Loading orders...
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
                `${API_BASE_URL}/admin/orders`,
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
                "Failed to load orders."
            );

        }


        // ========================================
        // SAVE ORDERS
        // ========================================

        allOrders =
            Array.isArray(data.orders)
                ? data.orders
                : [];


        // ========================================
        // UPDATE STATISTICS
        // ========================================

        updateOrderStatistics(
            data,
            allOrders
        );


        // ========================================
        // RENDER ORDERS
        // ========================================

        renderOrders(
            allOrders
        );


        hideMessage();


    } catch (error) {

        console.error(
            "Load admin orders error:",
            error
        );


        if (ordersTableBody) {

            ordersTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="9"
                        class="table-loading"
                    >
                        Unable to load orders.
                    </td>
                </tr>
            `;

        }


        showMessage(
            error.message ||
            "Unable to load orders.",
            "error"
        );

    }

}


// ========================================
// UPDATE ORDER STATISTICS
// ========================================

function updateOrderStatistics(
    data,
    orders
) {

    let pending = 0;
    let processing = 0;
    let completed = 0;
    let cancelled = 0;


    // ========================================
    // USE API OVERVIEW IF AVAILABLE
    // ========================================

    if (data.overview) {

        pending =
            Number(
                data.overview.pendingOrders
            ) || 0;

        processing =
            Number(
                data.overview.processingOrders
            ) || 0;

        completed =
            Number(
                data.overview.completedOrders
            ) || 0;

        cancelled =
            Number(
                data.overview.cancelledOrders
            ) || 0;

    }


    // ========================================
    // FALLBACK: COUNT ORDERS LOCALLY
    // ========================================

    else {

        orders.forEach(
            order => {

                const status =
                    String(
                        order.status || ""
                    ).toLowerCase();


                if (
                    status === "pending"
                ) {

                    pending++;

                }


                if (
                    status === "processing"
                ) {

                    processing++;

                }


                if (
                    status === "completed"
                ) {

                    completed++;

                }


                if (
                    status === "cancelled" ||
                    status === "canceled"
                ) {

                    cancelled++;

                }

            }
        );

    }


    // ========================================
    // TOTAL
    // ========================================

    let total =
        orders.length;


    if (
        data.stats &&
        data.stats.totalOrders !== undefined
    ) {

        total =
            Number(
                data.stats.totalOrders
            ) || 0;

    }


    // ========================================
    // UPDATE DOM
    // ========================================

    if (totalOrders) {

        totalOrders.textContent =
            total;

    }

    if (pendingOrders) {

        pendingOrders.textContent =
            pending;

    }

    if (processingOrders) {

        processingOrders.textContent =
            processing;

    }

    if (completedOrders) {

        completedOrders.textContent =
            completed;

    }

    if (cancelledOrders) {

        cancelledOrders.textContent =
            cancelled;

    }

}


// ========================================
// RENDER ORDERS
// ========================================

function renderOrders(
    orders
) {

    if (!ordersTableBody) {
        return;
    }


    if (
        !Array.isArray(orders) ||
        orders.length === 0
    ) {

        ordersTableBody.innerHTML =
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


    ordersTableBody.innerHTML =
        orders
            .map(
                order =>
                    createOrderRow(
                        order
                    )
            )
            .join("");

}


// ========================================
// CREATE ORDER ROW
// ========================================

function createOrderRow(
    order
) {

    const id =
        Number(order.id) || 0;


    const customerName =
        escapeHtml(
            order.customer_name ||
            order.customerName ||
            "Unknown Customer"
        );


    const customerPhone =
        escapeHtml(
            order.customer_phone ||
            order.customerPhone ||
            "-"
        );


    const shopName =
        escapeHtml(
            order.shop_name ||
            order.shopName ||
            "Unknown Shop"
        );


    const vendorName =
        escapeHtml(
            order.vendor_name ||
            order.vendorName ||
            "Unknown Vendor"
        );


    const total =
        formatCurrency(
            order.total_amount ||
            order.totalAmount
        );


    const status =
        String(
            order.status ||
            "pending"
        ).toLowerCase();


    const whatsappStatus =
        String(
            order.whatsapp_status ||
            order.whatsappStatus ||
            "not_sent"
        ).toLowerCase();


    const createdAt =
        formatDate(
            order.created_at ||
            order.createdAt
        );


    const statusClass =
        getStatusClass(status);


    const statusLabel =
        getStatusLabel(status);


    const actionButtons =
        createOrderActions(
            id,
            status
        );


    return `
        <tr>

            <!-- ORDER -->

            <td>

                <div class="order-cell">

                    <strong>
                        #${id}
                    </strong>

                    <span>
                        Order ID
                    </span>

                </div>

            </td>


            <!-- CUSTOMER -->

            <td>

                <div class="customer-cell">

                    <strong>
                        ${customerName}
                    </strong>

                    <span>
                        ${customerPhone}
                    </span>

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
                            Number(
                                order.shop_id
                            ) || "-"
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
                            Number(
                                order.vendor_id
                            ) || "-"
                        }
                    </span>

                </div>

            </td>


            <!-- TOTAL -->

            <td>

                <span class="order-total">
                    ${total}
                </span>

            </td>


            <!-- STATUS -->

            <td>

                <span
                    class="order-status ${statusClass}"
                >
                    ${statusLabel}
                </span>

            </td>


            <!-- WHATSAPP -->

            <td>

                <span
                    class="whatsapp-status ${getWhatsappClass(
                        whatsappStatus
                    )}"
                >
                    ${escapeHtml(
                        formatWhatsappStatus(
                            whatsappStatus
                        )
                    )}
                </span>

            </td>


            <!-- DATE -->

            <td>

                ${createdAt}

            </td>


            <!-- ACTION -->

            <td>

                <div class="order-actions">

                    <button
                        type="button"
                        class="action-button view-button"
                        onclick="viewOrder(${id})"
                    >
                        View
                    </button>

                    ${actionButtons}

                </div>

            </td>

        </tr>
    `;

}


// ========================================
// CREATE ORDER ACTIONS
// ========================================

function createOrderActions(
    orderId,
    status
) {

    if (status === "completed") {

        return "";

    }


    if (
        status === "cancelled" ||
        status === "canceled"
    ) {

        return "";

    }


    return `

        <button
            type="button"
            class="action-button process-button"
            onclick="changeOrderStatus(
                ${orderId},
                'processing'
            )"
        >
            Process
        </button>


        <button
            type="button"
            class="action-button cancel-button"
            onclick="changeOrderStatus(
                ${orderId},
                'cancelled'
            )"
        >
            Cancel
        </button>

    `;

}


// ========================================
// SEARCH / FILTER
// ========================================

function filterOrders() {

    const searchTerm =
        orderSearch
            ? orderSearch.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const filteredOrders =
        allOrders.filter(
            order => {

                const customerName =
                    String(
                        order.customer_name ||
                        order.customerName ||
                        ""
                    ).toLowerCase();


                const customerPhone =
                    String(
                        order.customer_phone ||
                        order.customerPhone ||
                        ""
                    ).toLowerCase();


                const shopName =
                    String(
                        order.shop_name ||
                        order.shopName ||
                        ""
                    ).toLowerCase();


                const vendorName =
                    String(
                        order.vendor_name ||
                        order.vendorName ||
                        ""
                    ).toLowerCase();


                const orderId =
                    String(
                        order.id || ""
                    ).toLowerCase();


                const status =
                    String(
                        order.status || ""
                    ).toLowerCase();


                const matchesSearch =
                    !searchTerm ||
                    customerName.includes(
                        searchTerm
                    ) ||
                    customerPhone.includes(
                        searchTerm
                    ) ||
                    shopName.includes(
                        searchTerm
                    ) ||
                    vendorName.includes(
                        searchTerm
                    ) ||
                    orderId.includes(
                        searchTerm
                    );


                const matchesStatus =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    renderOrders(
        filteredOrders
    );

}


// ========================================
// VIEW ORDER
// ========================================

async function viewOrder(
    orderId
) {

    if (!orderId) {
        return;
    }


    try {

        showMessage(
            "Loading order details...",
            "loading"
        );


        const response =
            await fetch(
                `${API_BASE_URL}/admin/orders/${orderId}`,
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
                "Failed to load order."
            );

        }


        renderOrderDetails(
            data.order
        );


        openOrderModal();


        hideMessage();


    } catch (error) {

        console.error(
            "View order error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to load order details.",
            "error"
        );

    }

}


// ========================================
// RENDER ORDER DETAILS
// ========================================

function renderOrderDetails(
    order
) {

    if (!orderDetails) {
        return;
    }


    if (!order) {

        orderDetails.innerHTML =
            "<p>Order information unavailable.</p>";

        return;

    }


    const id =
        Number(order.id) || "N/A";


    const customerName =
        escapeHtml(
            order.customer_name ||
            order.customerName ||
            "N/A"
        );


    const customerPhone =
        escapeHtml(
            order.customer_phone ||
            order.customerPhone ||
            "N/A"
        );


    const customerAddress =
        escapeHtml(
            order.customer_address ||
            order.customerAddress ||
            "N/A"
        );


    const shopName =
        escapeHtml(
            order.shop_name ||
            order.shopName ||
            "N/A"
        );


    const vendorName =
        escapeHtml(
            order.vendor_name ||
            order.vendorName ||
            "N/A"
        );


    const status =
        escapeHtml(
            order.status ||
            "N/A"
        );


    const whatsappStatus =
        escapeHtml(
            formatWhatsappStatus(
                order.whatsapp_status ||
                order.whatsappStatus ||
                "not_sent"
            )
        );


    const total =
        formatCurrency(
            order.total_amount ||
            order.totalAmount
        );


    const created =
        formatDate(
            order.created_at ||
            order.createdAt
        );


    let itemsHtml = "";


    const items =
        Array.isArray(order.items)
            ? order.items
            : Array.isArray(order.order_items)
                ? order.order_items
                : [];


    if (items.length > 0) {

        itemsHtml = `

            <div class="order-items-section">

                <h3>
                    Order Items
                </h3>

                <div class="order-items">

                    ${items.map(
                        item => {

                            const itemName =
                                escapeHtml(
                                    item.product_name ||
                                    item.name ||
                                    "Product"
                                );


                            const quantity =
                                Number(
                                    item.quantity
                                ) || 0;


                            const price =
                                formatCurrency(
                                    item.price
                                );


                            return `

                                <div class="order-item">

                                    <div>

                                        <strong>
                                            ${itemName}
                                        </strong>

                                        <span>
                                            Qty: ${quantity}
                                        </span>

                                    </div>

                                    <strong>
                                        ${price}
                                    </strong>

                                </div>

                            `;

                        }
                    ).join("")}

                </div>

            </div>

        `;

    }


    orderDetails.innerHTML = `

        <div class="detail-section">


            <div class="detail-item">

                <span>
                    Order ID
                </span>

                <strong>
                    #${id}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Customer
                </span>

                <strong>
                    ${customerName}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    Phone
                </span>

                <strong>
                    ${customerPhone}
                </strong>

            </div>


            <div class="detail-item full">

                <span>
                    Address
                </span>

                <strong>
                    ${customerAddress}
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
                    Total
                </span>

                <strong>
                    ${total}
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


            <div class="detail-item">

                <span>
                    WhatsApp
                </span>

                <strong>
                    ${whatsappStatus}
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


            ${itemsHtml}


        </div>

    `;

}


// ========================================
// OPEN MODAL
// ========================================

function openOrderModal() {

    if (!orderModal) {
        return;
    }


    orderModal.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";

}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    if (!orderModal) {
        return;
    }


    orderModal.style.display =
        "none";


    document.body.style.overflow =
        "";

}


// ========================================
// CHANGE ORDER STATUS
// ========================================

async function changeOrderStatus(
    orderId,
    newStatus
) {

    if (!orderId) {
        return;
    }


    const allowedStatuses = [
        "pending",
        "processing",
        "completed",
        "cancelled"
    ];


    if (
        !allowedStatuses.includes(
            newStatus
        )
    ) {

        return;

    }


    const actionText =
        newStatus === "processing"
            ? "process"
            : newStatus === "completed"
                ? "complete"
                : newStatus === "cancelled"
                    ? "cancel"
                    : "update";


    const confirmed =
        window.confirm(
            `Are you sure you want to ${actionText} order #${orderId}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        showMessage(
            `${actionText}ing order...`,
            "loading"
        );


        const response =
            await fetch(
                `${API_BASE_URL}/admin/orders/${orderId}/status`,
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
                "Failed to update order status."
            );

        }


        // ========================================
        // UPDATE LOCAL ORDER
        // ========================================

        const order =
            allOrders.find(
                item =>
                    Number(item.id) ===
                    Number(orderId)
            );


        if (order) {

            order.status =
                newStatus;

        }


        // ========================================
        // UPDATE STATISTICS
        // ========================================

        updateOrderStatistics(
            {},
            allOrders
        );


        // ========================================
        // RE-RENDER
        // ========================================

        filterOrders();


        showMessage(
            data.message ||
            "Order status updated successfully.",
            "success"
        );


        setTimeout(
            hideMessage,
            2500
        );


    } catch (error) {

        console.error(
            "Change order status error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to update order status.",
            "error"
        );

    }

}


// ========================================
// STATUS CLASS
// ========================================

function getStatusClass(
    status
) {

    switch (
        String(status).toLowerCase()
    ) {

        case "pending":
            return "pending";

        case "processing":
            return "processing";

        case "completed":
            return "completed";

        case "cancelled":
        case "canceled":
            return "cancelled";

        default:
            return "pending";

    }

}


// ========================================
// STATUS LABEL
// ========================================

function getStatusLabel(
    status
) {

    switch (
        String(status).toLowerCase()
    ) {

        case "pending":
            return "Pending";

        case "processing":
            return "Processing";

        case "completed":
            return "Completed";

        case "cancelled":
        case "canceled":
            return "Cancelled";

        default:
            return escapeHtml(
                status || "Unknown"
            );

    }

}


// ========================================
// WHATSAPP CLASS
// ========================================

function getWhatsappClass(
    status
) {

    return String(
        status
    ).toLowerCase() === "sent"
        ? "sent"
        : "not-sent";

}


// ========================================
// WHATSAPP LABEL
// ========================================

function formatWhatsappStatus(
    status
) {

    switch (
        String(status).toLowerCase()
    ) {

        case "sent":
            return "Sent";

        case "not_sent":
            return "Not sent";

        default:
            return status || "Not sent";

    }

}


// ========================================
// FORMAT CURRENCY
// ========================================

function formatCurrency(
    amount
) {

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

function formatDate(
    value
) {

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

function escapeHtml(
    value
) {

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
// SEARCH EVENT
// ========================================

if (orderSearch) {

    orderSearch.addEventListener(
        "input",
        filterOrders
    );

}


// ========================================
// STATUS FILTER EVENT
// ========================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterOrders
    );

}


// ========================================
// CLOSE MODAL BUTTON
// ========================================

if (closeOrderModal) {

    closeOrderModal.addEventListener(
        "click",
        closeModal
    );

}


// ========================================
// CLOSE MODAL OUTSIDE
// ========================================

if (orderModal) {

    orderModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                orderModal
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

loadOrders();

