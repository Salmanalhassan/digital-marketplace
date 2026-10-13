const CART_KEY = "digital_marketplace_cart";

function getCart() {
    const cart = localStorage.getItem(CART_KEY);

    if (!cart) {
        return null;
    }

    try {
        return JSON.parse(cart);
    } catch (error) {
        console.error("Invalid cart data:", error);

        localStorage.removeItem(CART_KEY);

        return null;
    }
}

function saveCart(cart) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
}

function getCartItemCount() {
    const cart = getCart();

    if (!cart || !cart.items) {
        return 0;
    }

    return cart.items.reduce(
        (total, item) => total + item.quantity,
        0
    );
}

function getCartTotal() {
    const cart = getCart();

    if (!cart || !cart.items) {
        return 0;
    }

    return cart.items.reduce(
        (total, item) => {
            return total + (
                Number(item.price) * Number(item.quantity)
            );
        },
        0
    );
}

function addToCart(product, shop) {

    let cart = getCart();

    if (!cart) {
        cart = {
            shop: {
                id: shop.id,
                name: shop.name,
                whatsapp_number: shop.whatsapp_number
            },
            items: []
        };
    }

    if (cart.shop.id !== shop.id) {
        return {
            success: false,
            message: "You can only order from one shop at a time"
        };
    }

    const existingItem = cart.items.find(
        item => item.product_id === product.id
    );

    if (existingItem) {

        if (
            existingItem.quantity + 1 >
            Number(product.stock)
        ) {
            return {
                success: false,
                message: "Not enough stock available"
            };
        }

        existingItem.quantity += 1;

    } else {

        cart.items.push({
            product_id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            stock: Number(product.stock)
        });
    }

    saveCart(cart);

    return {
        success: true,
        message: "Product added to cart"
    };
}

window.Cart = {
    getCart,
    saveCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    addToCart
};