
// ========================================
// ADMIN SHOPS
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

const shopsTableBody =
    document.getElementById(
        "shopsTableBody"
    );


const totalShops =
    document.getElementById(
        "totalShops"
    );


const shopsMessage =
    document.getElementById(
        "shopsMessage"
    );


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

    if (!shopsMessage) {
        return;
    }


    shopsMessage.textContent =
        message;


    shopsMessage.className =
        `shops-message show ${type}`;

}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!shopsMessage) {
        return;
    }


    shopsMessage.textContent =
        "";


    shopsMessage.className =
        "shops-message";

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
// FORMAT WHATSAPP
// ========================================

function formatWhatsapp(
    number
) {

    if (!number) {
        return "N/A";
    }


    return String(number);

}


// ========================================
// FORMAT STATUS LABEL
// ========================================

function getStatusLabel(
    status
) {

    const value =
        String(
            status || "inactive"
        ).toLowerCase();


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


// ========================================
// LOAD SHOPS
// ========================================

async function loadShops() {

    hideMessage();


    if (!shopsTableBody) {
        return;
    }


    shopsTableBody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="shops-loading"
            >

                Loading shops...

            </td>

        </tr>

    `;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/admin/shops`,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${adminToken}`

                    }

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
                "Failed to load shops."
            );

        }


        // ========================================
        // RENDER SHOPS
        // ========================================

        renderShops(
            data.shops || []
        );


    } catch (error) {

        console.error(
            "Load shops error:",
            error
        );


        shopsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="shops-loading"
                >

                    Unable to load shops.

                </td>

            </tr>

        `;


        showMessage(
            error.message ||
            "Unable to load shops.",
            "error"
        );

    }

}


// ========================================
// RENDER SHOPS
// ========================================

function renderShops(
    shops
) {

    if (!shopsTableBody) {
        return;
    }


    shopsTableBody.innerHTML =
        "";


    // ========================================
    // TOTAL SHOPS
    // ========================================

    if (totalShops) {

        totalShops.textContent =
            shops.length;

    }


    // ========================================
    // EMPTY STATE
    // ========================================

    if (
        !shops ||
        shops.length === 0
    ) {

        shopsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="shops-empty"
                >

                    No shops found.

                </td>

            </tr>

        `;

        return;

    }


    // ========================================
    // RENDER EACH SHOP
    // ========================================

    shops.forEach(
        function (shop) {

            const row =
                document.createElement(
                    "tr"
                );


            const status =
                String(
                    shop.status ||
                    "inactive"
                ).toLowerCase();


            const vendorName =
                shop.vendor_name ||
                "Unknown Vendor";


            const vendorUsername =
                shop.vendor_username
                    ? `@${shop.vendor_username}`
                    : "N/A";


            row.innerHTML = `

                <!-- SHOP ID -->

                <td>

                    ${escapeHtml(
                        shop.id
                    )}

                </td>


                <!-- SHOP -->

                <td>

                    <div
                        class="shop-name-cell"
                    >

                        ${escapeHtml(
                            shop.name ||
                            "Unnamed Shop"
                        )}

                    </div>

                </td>


                <!-- VENDOR -->

                <td>

                    <div
                        class="shop-vendor-cell"
                    >

                        <span
                            class="shop-vendor-name"
                        >

                            ${escapeHtml(
                                vendorName
                            )}

                        </span>


                        <span
                            class="shop-vendor-username"
                        >

                            ${escapeHtml(
                                vendorUsername
                            )}

                        </span>

                    </div>

                </td>


                <!-- CATEGORY -->

                <td>

                    ${escapeHtml(
                        shop.category ||
                        "Uncategorized"
                    )}

                </td>


                <!-- WHATSAPP -->

                <td>

                    ${escapeHtml(
                        formatWhatsapp(
                            shop.whatsapp_number
                        )
                    )}

                </td>


                <!-- STATUS -->

                <td>

                    <span
                        class="shop-status ${escapeHtml(
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


                <!-- CREATED -->

                <td>

                    ${escapeHtml(
                        formatDate(
                            shop.created_at
                        )
                    )}

                </td>


                <!-- ACTION -->

                <td>

                    <select
                        class="shop-status-select"
                        data-shop-id="${escapeHtml(
                            shop.id
                        )}"
                        data-previous-value="${escapeHtml(
                            status
                        )}"
                    >

                        <option
                            value="active"
                            ${
                                status ===
                                "active"
                                    ? "selected"
                                    : ""
                            }
                        >

                            Active

                        </option>


                        <option
                            value="inactive"
                            ${
                                status ===
                                "inactive"
                                    ? "selected"
                                    : ""
                            }
                        >

                            Inactive

                        </option>

                    </select>

                </td>

            `;


            shopsTableBody.appendChild(
                row
            );

        }
    );

}


// ========================================
// UPDATE SHOP STATUS
// ========================================

async function updateShopStatus(
    shopId,
    status,
    selectElement
) {

    if (
        !shopId ||
        !status ||
        !selectElement
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
                `${API_BASE_URL}/admin/shops/${shopId}/status`,
                {
                    method: "PATCH",

                    headers: {

                        "Authorization":
                            `Bearer ${adminToken}`,

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
                "Failed to update shop status."
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
            "Shop status updated successfully.",
            "success"
        );


        // ========================================
        // RELOAD SHOPS
        // ========================================

        await loadShops();


    } catch (error) {

        console.error(
            "Update shop status error:",
            error
        );


        selectElement.value =
            previousValue;


        showMessage(
            error.message ||
            "Unable to update shop status.",
            "error"
        );


    } finally {

        selectElement.disabled =
            false;

    }

}


// ========================================
// STATUS CHANGE EVENT
// ========================================

if (shopsTableBody) {

    shopsTableBody.addEventListener(
        "change",
        function (event) {

            const select =
                event.target.closest(
                    ".shop-status-select"
                );


            if (!select) {
                return;
            }


            const shopId =
                select.dataset.shopId;


            const status =
                select.value;


            updateShopStatus(
                shopId,
                status,
                select
            );

        }
    );

}


// ========================================
// INITIAL LOAD
// ========================================

loadShops();

