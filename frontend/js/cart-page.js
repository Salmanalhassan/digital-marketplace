const cartItemsContainer =
    document.getElementById("cartItems");

const cartContent =
    document.getElementById("cartContent");

const emptyCart =
    document.getElementById("emptyCart");

const shopName =
    document.getElementById("shopName");

const subtotalElement =
    document.getElementById("subtotal");

const totalElement =
    document.getElementById("total");

const cartCount =
    document.getElementById("cartCount");


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


function renderCart() {

    const cart = Cart.getCart();

    if (
        !cart ||
        !cart.items ||
        cart.items.length === 0
    ) {

        cartContent.classList.add("hidden");

        emptyCart.classList.remove("hidden");

        cartCount.textContent = "0";

        return;
    }


    cartContent.classList.remove("hidden");

    emptyCart.classList.add("hidden");


    shopName.textContent =
        cart.shop.name;


    cartCount.textContent =
        Cart.getCartItemCount();


    cartItemsContainer.innerHTML = "";


    cart.items.forEach(
        (item, index) => {

            const itemElement =
                document.createElement("div");

            itemElement.className =
                "cart-item";


            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            itemElement.innerHTML = `

                <div class="product-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <div class="product-price">
                        ${formatCurrency(item.price)}
                    </div>

                    <button
                        class="remove-btn"
                        data-index="${index}"
                    >
                        Remove
                    </button>

                </div>


                <div class="quantity-control">

                    <button
                        class="quantity-btn decrease-btn"
                        data-index="${index}"
                    >
                        −
                    </button>

                    <span class="quantity">
                        ${item.quantity}
                    </span>

                    <button
                        class="quantity-btn increase-btn"
                        data-index="${index}"
                    >
                        +
                    </button>

                </div>


                <div class="item-total">
                    ${formatCurrency(itemTotal)}
                </div>

            `;


            cartItemsContainer.appendChild(
                itemElement
            );

        }
    );


    const total =
        Cart.getCartTotal();


    subtotalElement.textContent =
        formatCurrency(total);


    totalElement.textContent =
        formatCurrency(total);


    attachCartEvents();

}


function attachCartEvents() {

    document
        .querySelectorAll(".decrease-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    decreaseQuantity(index);

                }
            );

        });


    document
        .querySelectorAll(".increase-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    increaseQuantity(index);

                }
            );

        });


    document
        .querySelectorAll(".remove-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    removeItem(index);

                }
            );

        });

}


function increaseQuantity(index) {

    const cart = Cart.getCart();

    const item = cart.items[index];

    if (!item) {
        return;
    }


    if (
        item.quantity >=
        Number(item.stock)
    ) {

        alert(
            "You have reached the available stock."
        );

        return;
    }


    item.quantity++;

    Cart.saveCart(cart);

    renderCart();

}


function decreaseQuantity(index) {

    const cart = Cart.getCart();

    const item = cart.items[index];

    if (!item) {
        return;
    }


    if (item.quantity <= 1) {

        removeItem(index);

        return;
    }


    item.quantity--;

    Cart.saveCart(cart);

    renderCart();

}


function removeItem(index) {

    const cart = Cart.getCart();

    if (!cart) {
        return;
    }


    cart.items.splice(index, 1);


    if (cart.items.length === 0) {

        Cart.clearCart();

    } else {

        Cart.saveCart(cart);

    }


    renderCart();

}

document
    .getElementById("checkoutBtn")
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "./checkout.html";

        }
    );
    


renderCart();