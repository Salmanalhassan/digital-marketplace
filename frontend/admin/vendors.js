
// ========================================
// ADMIN VENDORS
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

const vendorsTableBody =
    document.getElementById(
        "vendorsTableBody"
    );

const totalVendors =
    document.getElementById(
        "totalVendors"
    );

const vendorsMessage =
    document.getElementById(
        "vendorsMessage"
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

    if (!vendorsMessage) {
        return;
    }

    vendorsMessage.textContent =
        message;

    vendorsMessage.className =
        `vendors-message show ${type}`;

}


// ========================================
// HIDE MESSAGE
// ========================================

function hideMessage() {

    if (!vendorsMessage) {
        return;
    }

    vendorsMessage.textContent =
        "";

    vendorsMessage.className =
        "vendors-message";

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
// LOAD VENDORS
// ========================================

async function loadVendors() {

    hideMessage();

    if (!vendorsTableBody) {
        return;
    }

    vendorsTableBody.innerHTML = `

        <tr>

            <td
                colspan="7"
                class="vendors-loading"
            >

                Loading vendors...

            </td>

        </tr>

    `;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/admin/vendors`,
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
                "Failed to load vendors."
            );

        }


        // ========================================
        // RENDER
        // ========================================

        renderVendors(
            data.vendors || []
        );


    } catch (error) {

        console.error(
            "Load vendors error:",
            error
        );


        vendorsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="vendors-loading"
                >

                    Unable to load vendors.

                </td>

            </tr>

        `;


        showMessage(
            error.message ||
            "Unable to load vendors.",
            "error"
        );

    }

}


// ========================================
// RENDER VENDORS
// ========================================

function renderVendors(
    vendors
) {

    vendorsTableBody.innerHTML =
        "";


    // ========================================
    // TOTAL
    // ========================================

    if (totalVendors) {

        totalVendors.textContent =
            vendors.length;

    }


    // ========================================
    // EMPTY STATE
    // ========================================

    if (
        !vendors ||
        vendors.length === 0
    ) {

        vendorsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="vendors-empty"
                >

                    No vendors found.

                </td>

            </tr>

        `;

        return;

    }


    // ========================================
    // RENDER EACH VENDOR
    // ========================================

    vendors.forEach(
        function (vendor) {

            const row =
                document.createElement(
                    "tr"
                );


            const status =
                String(
                    vendor.status ||
                    "inactive"
                ).toLowerCase();


            // ========================================
            // VIEW DETAILS URL
            // ========================================

            const vendorDetailsUrl =
                `./vendor-details.html?id=${encodeURIComponent(
                    vendor.id
                )}`;


            row.innerHTML = `

                <td>

                    ${escapeHtml(
                        vendor.id
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        vendor.name ||
                        "N/A"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        vendor.username ||
                        "N/A"
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        vendor.phone ||
                        "N/A"
                    )}

                </td>


                <td>

                    <span
                        class="vendor-status ${escapeHtml(
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
                            vendor.created_at
                        )
                    )}

                </td>


                <td>

                    <div class="vendor-actions">


                        <!-- VIEW DETAILS -->

                        <a
                            href="${vendorDetailsUrl}"
                            class="vendor-view-button"
                        >

                            View Details

                        </a>


                        <!-- STATUS -->

                        <select
                            class="vendor-status-select"
                            data-vendor-id="${escapeHtml(
                                vendor.id
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


                    </div>

                </td>

            `;


            vendorsTableBody.appendChild(
                row
            );

        }
    );

}


// ========================================
// UPDATE VENDOR STATUS
// ========================================

async function updateVendorStatus(
    vendorId,
    status,
    selectElement
) {

    if (
        !vendorId ||
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
                `${API_BASE_URL}/admin/vendors/${vendorId}/status`,
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
        // ERROR
        // ========================================

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to update vendor status."
            );

        }


        // ========================================
        // SAVE CURRENT VALUE
        // ========================================

        selectElement.dataset
            .previousValue =
            status;


        // ========================================
        // SUCCESS
        // ========================================

        showMessage(
            data.message ||
            "Vendor status updated successfully.",
            "success"
        );


        // ========================================
        // RELOAD
        // ========================================

        await loadVendors();


    } catch (error) {

        console.error(
            "Update vendor status error:",
            error
        );


        selectElement.value =
            previousValue;


        showMessage(
            error.message ||
            "Unable to update vendor status.",
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

if (vendorsTableBody) {

    vendorsTableBody.addEventListener(
        "change",
        function (event) {

            const select =
                event.target.closest(
                    ".vendor-status-select"
                );


            if (!select) {
                return;
            }


            const vendorId =
                select.dataset.vendorId;


            const status =
                select.value;


            updateVendorStatus(
                vendorId,
                status,
                select
            );

        }
    );

}


// ========================================
// INITIAL LOAD
// ========================================

loadVendors();

