// ========================================
// VENDOR ORDERS
// ========================================

const API_BASE_URL =
    "http://172.20.10.5:5000/api";


// ========================================
// AUTHENTICATION
// ========================================

const vendorToken =
    localStorage.getItem("vendorToken");


// ========================================
// DOM ELEMENTS
// ========================================

const ordersTableBody =
    document.getElementById(
        "ordersTableBody"
    );

const ordersEmptyState =
    document.getElementById(
        "ordersEmptyState"
    );

const orderCount =
    document.getElementById(
        "orderCount"
    );

const orderMessage =
    document.getElementById(
        "orderMessage"
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

    orderMessage.textContent = "";

    orderMessage.className =
        "order-message";

}


// ========================================
// FORMAT CURRENCY
// ========================================

function formatCurrency(amount) {

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

function formatDate(dateValue) {

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
// GET STATUS CLASS
// ========================================

function getStatusClass(status) {

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
// GET STATUS LABEL
// ========================================

function getStatusLabel(status) {

    if (!status) {
        return "Pending";
    }


    const value =
        String(status)
            .toLowerCase();


    return (
        value.charAt(0)
            .toUpperCase() +
        value.slice(1)
    );

}


// ========================================
// GET WHATSAPP STATUS
// ========================================

function getWhatsAppStatus(
    whatsappStatus
) {

    if (
        whatsappStatus === "sent"
    ) {

        return {
            text: "Sent",
            className: "sent"
        };

    }


    return {
        text: "Not Sent",
        className: "not-sent"
    };

}


// ========================================
// HANDLE UNAUTHORIZED
// ========================================

function handleUnauthorized() {

    localStorage.removeItem(
        "vendorToken"
    );

    localStorage.removeItem(
        "vendor"
    );


    window.location.href =
        "./login.html";

}


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

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
// LOAD ORDERS
// ========================================

async function loadOrders() {

    hideMessage();


    if (!ordersTableBody) {
        return;
    }


    if (ordersEmptyState) {

        ordersEmptyState.style.display =
            "none";

    }


    ordersTableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="orders-loading"
            >

                Loading orders...

            </td>

        </tr>

    `;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/orders`,
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


        // ========================================
        // TOKEN EXPIRED
        // ========================================

        if (
            response.status === 401
        ) {

            handleUnauthorized();

            return;

        }


        // ========================================
        // REQUEST ERROR
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
        // RENDER
        // ========================================

        renderOrders(
            data.orders || []
        );


    } catch (error) {

        console.error(
            "Load orders error:",
            error
        );


        ordersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="orders-loading"
                >

                    Unable to load orders.

                </td>

            </tr>

        `;


        showMessage(
            error.message ||
            "Unable to load orders.",
            "error"
        );

    }

}


// ========================================
// RENDER ORDERS
// ========================================

function renderOrders(
    orders
) {

    ordersTableBody.innerHTML = "";


    // ========================================
    // ORDER COUNT
    // ========================================

    if (orderCount) {

        orderCount.textContent =
            `${orders.length} ${
                orders.length === 1
                    ? "Order"
                    : "Orders"
            }`;

    }


    // ========================================
    // EMPTY STATE
    // ========================================

    if (
        !orders ||
        orders.length === 0
    ) {

        if (ordersEmptyState) {

            ordersEmptyState.style.display =
                "block";

        }


        return;

    }


    // ========================================
    // RENDER EACH ORDER
    // ========================================

    orders.forEach(
        function (order) {

            const row =
                document.createElement(
                    "tr"
                );


            // ========================================
            // ORDER ITEMS
            // ========================================

            const items =
                Array.isArray(
                    order.items
                )
                    ? order.items
                    : [];


            const itemCount =
                items.reduce(
                    function (
                        total,
                        item
                    ) {

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


            // ========================================
            // STATUS
            // ========================================

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


            // ========================================
            // WHATSAPP
            // ========================================

            const whatsapp =
                getWhatsAppStatus(
                    order.whatsapp_status
                );


            // ========================================
            // PRODUCT NAMES
            // ========================================

            let productNames =
                "No items";


            if (items.length > 0) {

                productNames =
                    items
                        .map(
                            function (item) {

                                return escapeHtml(
                                    item.product_name ||
                                    "Product"
                                );

                            }
                        )
                        .join(", ");

            }


            // ========================================
            // TABLE ROW
            // ========================================

            row.innerHTML = `

                <!-- ORDER -->

                <td>

                    <div class="order-id">

                        #${escapeHtml(
                            order.id
                        )}

                    </div>

                </td>


                <!-- CUSTOMER -->

                <td>

                    <div class="customer-info">

                        <strong>
                            ${escapeHtml(
                                order.customer_name ||
                                "Unknown Customer"
                            )}
                        </strong>

                        <small>
                            ${escapeHtml(
                                order.customer_phone ||
                                "No phone"
                            )}
                        </small>

                    </div>

                </td>


                <!-- TOTAL -->

                <td>

                    <div class="order-total">

                        <strong>
                            ${formatCurrency(
                                order.total_amount
                            )}
                        </strong>

                        <small>
                            ${itemCount}
                            ${
                                itemCount === 1
                                    ? " item"
                                    : " items"
                            }
                        </small>

                    </div>

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
                        class="whatsapp-status ${whatsapp.className}"
                    >

                        ${whatsapp.text}

                    </span>

                </td>


                <!-- DATE -->

                <td>

                    <span class="order-date">

                        ${formatDate(
                            order.created_at
                        )}

                    </span>

                </td>


                <!-- ACTION -->

                <td>

                    <div class="order-actions">

                        <button
                            type="button"
                            class="order-action-button view"
                            data-order-id="${order.id}"
                        >

                            View

                        </button>


                        <select
                            class="order-status-select"
                            data-order-id="${order.id}"
                            data-previous-value="${escapeHtml(
                                status
                            )}"
                        >

                            <option
                                value="pending"
                                ${
                                    status ===
                                    "pending"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Pending
                            </option>


                            <option
                                value="processing"
                                ${
                                    status ===
                                    "processing"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Processing
                            </option>


                            <option
                                value="completed"
                                ${
                                    status ===
                                    "completed"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Completed
                            </option>


                            <option
                                value="cancelled"
                                ${
                                    status ===
                                    "cancelled"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Cancelled
                            </option>

                        </select>

                    </div>

                </td>

            `;


            ordersTableBody.appendChild(
                row
            );

        }
    );

}


// ========================================
// VIEW ORDER
// ========================================

async function viewOrder(
    orderId
) {

    hideMessage();


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/orders/${orderId}`,
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


        // ========================================
        // UNAUTHORIZED
        // ========================================

        if (
            response.status === 401
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
                "Failed to load order."
            );

        }


        // ========================================
        // SHOW DETAILS
        // ========================================

        showOrderDetails(
            data.order
        );


    } catch (error) {

        console.error(
            "View order error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to load order.",
            "error"
        );

    }

}


// ========================================
// SHOW ORDER DETAILS
// ========================================

function showOrderDetails(
    order
) {

    // ========================================
    // REMOVE OLD MODAL
    // ========================================

    const oldModal =
        document.getElementById(
            "orderDetailsModal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    // ========================================
    // ITEMS
    // ========================================

    const items =
        Array.isArray(
            order.items
        )
            ? order.items
            : [];


    let itemsHtml =
        "";


    if (
        items.length === 0
    ) {

        itemsHtml = `

            <div class="order-no-items">

                No items found for this order.

            </div>

        `;

    } else {

        itemsHtml =
            items
                .map(
                    function (item) {

                        const quantity =
                            Number(
                                item.quantity
                            ) || 0;


                        const price =
                            Number(
                                item.price
                            ) || 0;


                        const subtotal =
                            quantity *
                            price;


                        return `

                            <div
                                class="order-detail-item"
                            >

                                <div>

                                    <strong>
                                        ${escapeHtml(
                                            item.product_name ||
                                            "Product"
                                        )}
                                    </strong>

                                    <small>
                                        Qty:
                                        ${quantity}
                                    </small>

                                    <small>
                                        Price:
                                        ${formatCurrency(
                                            price
                                        )}
                                    </small>

                                </div>


                                <span>

                                    ${formatCurrency(
                                        subtotal
                                    )}

                                </span>

                            </div>

                        `;

                    }
                )
                .join("");

    }


    // ========================================
    // STATUS
    // ========================================

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


    // ========================================
    // WHATSAPP
    // ========================================

    const whatsapp =
        getWhatsAppStatus(
            order.whatsapp_status
        );


    // ========================================
    // CREATE MODAL
    // ========================================

    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "orderDetailsModal";


    modal.className =
        "order-modal";


    modal.innerHTML = `

        <div
            class="order-modal-overlay"
        ></div>


        <div
            class="order-modal-content"
        >

            <!-- HEADER -->

            <div
                class="order-modal-header"
            >

                <div>

                    <h2>
                        Order #${escapeHtml(
                            order.id
                        )}
                    </h2>

                    <p>
                        ${formatDate(
                            order.created_at
                        )}
                    </p>

                </div>


                <button
                    type="button"
                    class="order-modal-close"
                    id="closeOrderModal"
                >

                    ×

                </button>

            </div>


            <!-- CUSTOMER -->

            <div
                class="order-detail-section"
            >

                <h3>
                    Customer Information
                </h3>


                <p>

                    <strong>
                        Name:
                    </strong>

                    ${escapeHtml(
                        order.customer_name ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Phone:
                    </strong>

                    ${escapeHtml(
                        order.customer_phone ||
                        "N/A"
                    )}

                </p>


                <p>

                    <strong>
                        Address:
                    </strong>

                    ${escapeHtml(
                        order.customer_address ||
                        "N/A"
                    )}

                </p>

            </div>


            <!-- PRODUCTS -->

            <div
                class="order-detail-section"
            >

                <h3>
                    Order Items
                </h3>


                <div
                    class="order-detail-items"
                >

                    ${itemsHtml}

                </div>

            </div>


            <!-- TOTAL -->

            <div
                class="order-detail-total"
            >

                <span>
                    Total
                </span>


                <strong>

                    ${formatCurrency(
                        order.total_amount
                    )}

                </strong>

            </div>


            <!-- STATUS -->

            <div
                class="order-detail-status"
            >

                <span>
                    Status
                </span>


                <strong
                    class="order-status ${statusClass}"
                >

                    ${statusLabel}

                </strong>

            </div>


            <!-- WHATSAPP -->

            <div
                class="order-detail-status"
            >

                <span>
                    WhatsApp
                </span>


                <strong
                    class="whatsapp-status ${whatsapp.className}"
                >

                    ${whatsapp.text}

                </strong>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // ========================================
    // CLOSE BUTTON
    // ========================================

    const closeButton =
        document.getElementById(
            "closeOrderModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );

    }


    // ========================================
    // OVERLAY
    // ========================================

    const overlay =
        modal.querySelector(
            ".order-modal-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );

    }


    // ========================================
    // ESC KEY
    // ========================================

    function handleEscape(
        event
    ) {

        if (
            event.key === "Escape"
        ) {

            modal.remove();

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        }

    }


    document.addEventListener(
        "keydown",
        handleEscape
    );

}


// ========================================
// UPDATE ORDER STATUS
// ========================================

async function updateOrderStatus(
    orderId,
    status,
    selectElement
) {

    if (
        !orderId ||
        !status
    ) {

        return;

    }


    const previousValue =
        selectElement.dataset
            .previousValue ||
        status;


    selectElement.disabled =
        true;


    hideMessage();


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/vendor/orders/${orderId}/status`,
                {
                    method: "PATCH",

                    headers: {

                        "Authorization":
                            `Bearer ${vendorToken}`,

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({
                        status
                    })

                }
            );


        const data =
            await response.json();


        // ========================================
        // UNAUTHORIZED
        // ========================================

        if (
            response.status === 401
        ) {

            handleUnauthorized();

            return;

        }


        // ========================================
        // UPDATE ERROR
        // ========================================

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
        // SAVE CURRENT VALUE
        // ========================================

        selectElement.dataset
            .previousValue =
            status;


        // ========================================
        // SUCCESS MESSAGE
        // ========================================

        showMessage(
            data.message ||
            "Order status updated successfully.",
            "success"
        );


        // ========================================
        // RELOAD ORDERS
        // ========================================

        await loadOrders();


    } catch (error) {

        console.error(
            "Update order status error:",
            error
        );


        // ========================================
        // RESTORE OLD VALUE
        // ========================================

        selectElement.value =
            previousValue;


        showMessage(
            error.message ||
            "Unable to update order status.",
            "error"
        );


    } finally {

        selectElement.disabled =
            false;

    }

}


// ========================================
// TABLE CLICK EVENTS
// ========================================

if (ordersTableBody) {

    ordersTableBody.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".order-action-button"
                );


            if (!button) {
                return;
            }


            const orderId =
                button.dataset.orderId;


            if (
                button.classList.contains(
                    "view"
                )
            ) {

                viewOrder(
                    orderId
                );

            }

        }
    );


    // ========================================
    // STATUS CHANGE
    // ========================================

    ordersTableBody.addEventListener(
        "change",
        function (event) {

            const select =
                event.target.closest(
                    ".order-status-select"
                );


            if (!select) {
                return;
            }


            const orderId =
                select.dataset.orderId;


            const status =
                select.value;


            updateOrderStatus(
                orderId,
                status,
                select
            );

        }
    );

}


// ========================================
// INITIAL LOAD
// ========================================

loadOrders();

