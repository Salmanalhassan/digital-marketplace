const db = require("../config/db");

const createOrder = (req, res) => {

    const {
        shop_id,
        customer_name,
        customer_phone,
        customer_address,
        items
    } = req.body;


    // 1. Validate order information

    if (
        !shop_id ||
        !customer_name ||
        !customer_phone ||
        !customer_address ||
        !Array.isArray(items) ||
        items.length === 0
    ) {
        return res.status(400).json({
            success: false,
            message: "All order details are required"
        });
    }


    // 2. Validate items

    for (const item of items) {

        if (
            !item.product_id ||
            !Number.isInteger(Number(item.quantity)) ||
            Number(item.quantity) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid product or quantity"
            });
        }

    }


    // 3. Start transaction

    db.beginTransaction((transactionError) => {

        if (transactionError) {

            console.error(
                "Transaction error:",
                transactionError
            );

            return res.status(500).json({
                success: false,
                message: "Failed to start order transaction"
            });

        }


        // 4. Check shop

        const shopSql = `
            SELECT
                id,
                name,
                whatsapp_number
            FROM shops
            WHERE id = ?
            AND status = 'active'
            LIMIT 1
        `;


        db.query(
            shopSql,
            [shop_id],
            (shopError, shops) => {

                if (shopError) {

                    return rollbackOrder(
                        shopError,
                        res,
                        "Failed to check shop"
                    );

                }


                if (shops.length === 0) {

                    return rollbackOrder(
                        null,
                        res,
                        "Shop not found or inactive",
                        404
                    );

                }


                const shop = shops[0];

                let totalAmount = 0;

                const orderItems = [];


                // 5. Check products one by one

                checkNextProduct(
                    0,
                    items,
                    shop_id,
                    orderItems,
                    totalAmount,
                    (productError, result) => {

                        if (productError) {

                            return rollbackOrder(
                                productError.error || null,
                                res,
                                productError.message,
                                productError.statusCode || 400
                            );

                        }


                        totalAmount =
                            result.totalAmount;


                        // 6. Create order

                        const orderSql = `
                            INSERT INTO orders (
                                shop_id,
                                customer_name,
                                customer_phone,
                                customer_address,
                                total_amount,
                                status,
                                whatsapp_status
                            )
                            VALUES (
                                ?,
                                ?,
                                ?,
                                ?,
                                ?,
                                'pending',
                                'not_sent'
                            )
                        `;


                        db.query(
                            orderSql,
                            [
                                shop_id,
                                customer_name,
                                customer_phone,
                                customer_address,
                                totalAmount
                            ],
                            (orderError, orderResult) => {

                                if (orderError) {

                                    return rollbackOrder(
                                        orderError,
                                        res,
                                        "Failed to create order"
                                    );

                                }


                                const orderId =
                                    orderResult.insertId;


                                // 7. Insert order items

                                insertOrderItems(
                                    orderId,
                                    orderItems,
                                    (itemsError) => {

                                        if (itemsError) {

                                            return rollbackOrder(
                                                itemsError,
                                                res,
                                                "Failed to create order items"
                                            );

                                        }


                                        // 8. Reduce stock

                                        reduceStock(
                                            orderItems,
                                            (stockError) => {

                                                if (stockError) {

                                                    return rollbackOrder(
                                                        stockError,
                                                        res,
                                                        "Failed to update product stock"
                                                    );

                                                }


                                                // 9. Commit

                                                db.commit(
                                                    (commitError) => {

                                                        if (commitError) {

                                                            return rollbackOrder(
                                                                commitError,
                                                                res,
                                                                "Failed to complete order"
                                                            );

                                                        }


                                                        // 10. Success

                                                        return res.status(201).json({

                                                            success: true,

                                                            message:
                                                                "Order created successfully",

                                                            order: {
                                                                id: orderId,
                                                                shop_id:
                                                                    Number(shop_id),
                                                                customer_name,
                                                                customer_phone,
                                                                customer_address,
                                                                total_amount:
                                                                    totalAmount,
                                                                status:
                                                                    "pending",
                                                                whatsapp_status:
                                                                    "not_sent"
                                                            },

                                                            shop: {
                                                                id: shop.id,
                                                                name: shop.name,
                                                                whatsapp_number:
                                                                    shop.whatsapp_number
                                                            }

                                                        });

                                                    }
                                                );

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    }
                );

            }
        );

    });

};


// ==========================================
// CHECK PRODUCTS
// ==========================================

function checkNextProduct(
    index,
    items,
    shopId,
    orderItems,
    totalAmount,
    callback
) {

    if (index >= items.length) {

        return callback(null, {
            totalAmount
        });

    }


    const item = items[index];


    const productSql = `
        SELECT
            id,
            shop_id,
            name,
            price,
            stock,
            status
        FROM products
        WHERE id = ?
        AND shop_id = ?
        LIMIT 1
    `;


    db.query(
        productSql,
        [
            item.product_id,
            shopId
        ],
        (error, products) => {

            if (error) {

                return callback({
                    error,
                    message:
                        "Failed to check product",
                    statusCode: 500
                });

            }


            if (products.length === 0) {

                return callback({
                    message:
                        `Product ${item.product_id} not found in this shop`,
                    statusCode: 404
                });

            }


            const product = products[0];


            // Product status

            if (product.status !== "active") {

                return callback({
                    message:
                        `${product.name} is not available`,
                    statusCode: 400
                });

            }


            const quantity =
                Number(item.quantity);

            const stock =
                Number(product.stock);


            // Stock check

            if (quantity > stock) {

                return callback({
                    message:
                        `Not enough stock for ${product.name}`,
                    statusCode: 400
                });

            }


            const price =
                Number(product.price);


            const subtotal =
                price * quantity;


            totalAmount += subtotal;


            orderItems.push({

                product_id:
                    product.id,

                quantity,

                price

            });


            // Check next product

            checkNextProduct(
                index + 1,
                items,
                shopId,
                orderItems,
                totalAmount,
                callback
            );

        }
    );

}


// ==========================================
// INSERT ORDER ITEMS
// ==========================================

function insertOrderItems(
    orderId,
    orderItems,
    callback
) {

    let index = 0;


    function insertNext() {

        if (index >= orderItems.length) {

            return callback(null);

        }


        const item =
            orderItems[index];


        const sql = `
            INSERT INTO order_items (
                order_id,
                product_id,
                quantity,
                price
            )
            VALUES (?, ?, ?, ?)
        `;


        db.query(
            sql,
            [
                orderId,
                item.product_id,
                item.quantity,
                item.price
            ],
            (error) => {

                if (error) {

                    return callback(error);

                }


                index++;

                insertNext();

            }
        );

    }


    insertNext();

}


// ==========================================
// REDUCE STOCK
// ==========================================

function reduceStock(
    orderItems,
    callback
) {

    let index = 0;


    function updateNext() {

        if (index >= orderItems.length) {

            return callback(null);

        }


        const item =
            orderItems[index];


        const sql = `
            UPDATE products
            SET stock = stock - ?
            WHERE id = ?
            AND stock >= ?
        `;


        db.query(
            sql,
            [
                item.quantity,
                item.product_id,
                item.quantity
            ],
            (error, result) => {

                if (error) {

                    return callback(error);

                }


                if (result.affectedRows === 0) {

                    return callback(
                        new Error(
                            "Stock update failed"
                        )
                    );

                }


                index++;

                updateNext();

            }
        );

    }


    updateNext();

}


// ==========================================
// ROLLBACK
// ==========================================

function rollbackOrder(
    error,
    res,
    message,
    statusCode = 500
) {

    if (error) {

        console.error(
            "Order error:",
            error
        );

    }


    db.rollback(() => {

        return res.status(statusCode).json({

            success: false,
            message

        });

    });

}


module.exports = {
    createOrder
};