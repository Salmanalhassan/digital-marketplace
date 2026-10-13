const checkoutForm =
    document.getElementById("checkoutForm");

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const checkoutShopName =
    document.getElementById("shopName");


function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


function loadCheckout() {

    const cart = Cart.getCart();

    if (
        !cart ||
        !cart.items ||
        cart.items.length === 0
    ) {

        document.body.innerHTML = `
            <div class="empty-checkout">

                <h2>Your cart is empty</h2>

                <p>
                    Please add products before checkout.
                </p>

                <br>

                <a href="./index.html">
                    Browse Shops
                </a>

            </div>
        `;

        return;
    }


    checkoutShopName.textContent =
        cart.shop.name;


    checkoutItems.innerHTML = "";


    cart.items.forEach(item => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);


        const element =
            document.createElement("div");

        element.className =
            "order-item";


        element.innerHTML = `

            <div>

                <div class="order-item-name">
                    ${item.name}
                </div>

                <div class="order-item-meta">
                    Qty: ${item.quantity}
                </div>

            </div>

            <div class="order-item-price">
                ${formatCurrency(itemTotal)}
            </div>

        `;


        checkoutItems.appendChild(element);

    });


    checkoutTotal.textContent =
        formatCurrency(
            Cart.getCartTotal()
        );

}

checkoutForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        clearErrors();


        const name =
            document
                .getElementById("customerName")
                .value
                .trim();


        const phone =
            document
                .getElementById("customerPhone")
                .value
                .trim();


        const address =
            document
                .getElementById("customerAddress")
                .value
                .trim();


        let valid = true;


        if (name.length < 2) {

            showError(
                "nameError",
                "Please enter your full name."
            );

            valid = false;

        }


        if (!isValidPhone(phone)) {

            showError(
                "phoneError",
                "Please enter a valid Nigerian phone number."
            );

            valid = false;

        }


        if (address.length < 5) {

            showError(
                "addressError",
                "Please enter your delivery address."
            );

            valid = false;

        }


        if (!valid) {
            return;
        }


        const customerDetails = {
            name,
            phone,
            address
        };
sessionStorage.setItem(
    "checkout_customer",
    JSON.stringify(customerDetails)
);

await createOrder(customerDetails);

    }
);


function isValidPhone(phone) {

    const cleaned =
        phone.replace(/\s+/g, "");

    return /^(?:\+234|0)[789][01]\d{8}$/.test(
        cleaned
    );

}


function showError(elementId, message) {

    document.getElementById(
        elementId
    ).textContent = message;

}


function clearErrors() {

    document.getElementById(
        "nameError"
    ).textContent = "";

    document.getElementById(
        "phoneError"
    ).textContent = "";

    document.getElementById(
        "addressError"
    ).textContent = "";

}

function generateWhatsAppOrder(
    order,
    shop
) {

    const cart = Cart.getCart();

    if (
        !cart ||
        !cart.items ||
        cart.items.length === 0
    ) {
        alert("Your cart is empty.");
        return;
    }


    const customerData =
        sessionStorage.getItem(
            "checkout_customer"
        );


    if (!customerData) {

        alert(
            "Please enter your details first."
        );

        return;
    }


    const customer =
        JSON.parse(customerData);


    const shopName =
        cart.shop.name;

const whatsappNumber =
    shop.whatsapp_number;

    if (!whatsappNumber) {

        alert(
            "This shop has no WhatsApp number configured."
        );

        return;
    }


    let message =
        `Hello ${shopName},\n\n`;

    message +=
        `I want to place an order:\n\n`;


    cart.items.forEach(item => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);


        message +=
            `${item.quantity} × ${item.name} — ${formatCurrency(itemTotal)}\n`;

    });

const total =
    Number(order.total_amount);

    message += `\n`;
    message += `Total: ${formatCurrency(total)}\n\n`;

    message += `Customer Details:\n`;
    message += `Name: ${customer.name}\n`;
    message += `Phone: ${customer.phone}\n`;
    message += `Address: ${customer.address}\n\n`;

    message +=
        `Thank you. I am waiting for confirmation of my order.`;


    const formattedNumber =
        normalizeWhatsAppNumber(
            whatsappNumber
        );


    const whatsappUrl =
        `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

window.location.href = whatsappUrl;
}

function normalizeWhatsAppNumber(number) {

    let cleaned =
        String(number)
            .replace(/\s+/g, "")
            .replace(/-/g, "");


    if (cleaned.startsWith("+")) {

        cleaned =
            cleaned.substring(1);

    }


    if (cleaned.startsWith("0")) {

        cleaned =
            "234" +
            cleaned.substring(1);

    }


    return cleaned;

}

async function createOrder(customerDetails) {

    const cart = Cart.getCart();


    if (
        !cart ||
        !cart.items ||
        cart.items.length === 0
    ) {

        alert("Your cart is empty.");

        return;

    }

const items =
    cart.items.map(item => {

        return {
            product_id: Number(
                item.product_id || item.id
            ),

            quantity: Number(
                item.quantity
            )
        };

    });

    const invalidItem =
    items.some(item =>
        !Number.isInteger(item.product_id) ||
        item.product_id <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
    );


if (invalidItem) {

    alert(
        "One or more products in your cart are invalid. Please return to the shop and add the product again."
    );

    return;

}


    const orderData = {

        shop_id: Number(cart.shop.id),

        customer_name:
            customerDetails.name,

        customer_phone:
            customerDetails.phone,

        customer_address:
            customerDetails.address,

        items

    };


    try {

        const response =
            await fetch(
                "http://172.20.10.5:5000/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(orderData)
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Failed to create order."
            );

            return;

        }


        // Save created order information

        sessionStorage.setItem(
            "created_order",
            JSON.stringify(data.order)
        );


        // Store shop WhatsApp information

        sessionStorage.setItem(
            "order_shop",
            JSON.stringify(data.shop)
        );


        // Now open WhatsApp

        generateWhatsAppOrder(
            data.order,
            data.shop
        );


    } catch (error) {

        console.error(
            "Create order error:",
            error
        );


        alert(
            "Unable to connect to the server. Please try again."
        );

    }

}

loadCheckout();