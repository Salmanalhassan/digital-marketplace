const db = require("../config/db");


const getVendorOrders = (req, res) => {

    const vendorId = req.user.id;


    // 1. Find the shop owned by this vendor

    const shopSql = `
        SELECT
            id,
            name,
            whatsapp_number
        FROM shops
        WHERE vendor_id = ?
        LIMIT 1
    `;


    db.query(
        shopSql,
        [vendorId],
        (shopError, shops) => {

            if (shopError) {

                console.error(
                    "Find vendor shop error:",
                    shopError
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            if (shops.length === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "No shop found for this vendor"
                });

            }


            const shop = shops[0];


            // 2. Get orders belonging to this shop

            const ordersSql = `
                SELECT
                    id,
                    customer_name,
                    customer_phone,
                    customer_address,
                    total_amount,
                    status,
                    whatsapp_status,
                    created_at,
                    updated_at
                FROM orders
                WHERE shop_id = ?
                ORDER BY created_at DESC
            `;


            db.query(
                ordersSql,
                [shop.id],
                (ordersError, orders) => {

                    if (ordersError) {

                        console.error(
                            "Get vendor orders error:",
                            ordersError
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Server error"
                        });

                    }


                    // 3. If no orders

                    if (orders.length === 0) {

                        return res.json({

                            success: true,

                            shop: {
                                id: shop.id,
                                name: shop.name
                            },

                            orders: []

                        });

                    }


                    // 4. Get order items

                    const orderIds =
                        orders.map(
                            order => order.id
                        );


                    const placeholders =
                        orderIds
                            .map(() => "?")
                            .join(",");


                    const itemsSql = `
                        SELECT
                            oi.id,
                            oi.order_id,
                            oi.product_id,
                            oi.quantity,
                            oi.price,
                            p.name AS product_name
                        FROM order_items oi
                        LEFT JOIN products p
                            ON p.id = oi.product_id
                        WHERE oi.order_id IN (${placeholders})
                        ORDER BY oi.id ASC
                    `;


                    db.query(
                        itemsSql,
                        orderIds,
                        (itemsError, items) => {

                            if (itemsError) {

                                console.error(
                                    "Get order items error:",
                                    itemsError
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Server error"
                                });

                            }


                            // 5. Attach items to orders

// ========================================
// ATTACH ITEMS TO ORDERS
// ========================================

const ordersWithItems =
    orders.map(order => {

        const orderItems =
            items.filter(
                item =>
                    Number(item.order_id) ===
                    Number(order.id)
            );

        return {
            ...order,
            items: orderItems,
            item_count: orderItems.length
        };

    });




                            // 6. Return response

                            return res.json({

                                success: true,

                                shop: {
                                    id: shop.id,
                                    name: shop.name
                                },

                                orders:
                                    ordersWithItems

                            });

                        }
                    );

                }
            );

        }
    );

};

const getVendorOrderById = (req, res) => {

    const vendorId = req.user.id;
    const orderId = req.params.id;


    if (!orderId || isNaN(orderId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order ID"
        });
    }


    // 1. Find vendor's shop

    const shopSql = `
        SELECT
            id,
            name
        FROM shops
        WHERE vendor_id = ?
        LIMIT 1
    `;


    db.query(
        shopSql,
        [vendorId],
        (shopError, shops) => {

            if (shopError) {

                console.error(
                    "Find vendor shop error:",
                    shopError
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }


            if (shops.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "No shop found for this vendor"
                });
            }


            const shop = shops[0];


            // 2. Get the order
            // IMPORTANT:
            // shop_id is checked here so a vendor
            // cannot access another vendor's order.

            const orderSql = `
                SELECT
                    id,
                    customer_name,
                    customer_phone,
                    customer_address,
                    total_amount,
                    status,
                    whatsapp_status,
                    created_at,
                    updated_at
                FROM orders
                WHERE id = ?
                AND shop_id = ?
                LIMIT 1
            `;


            db.query(
                orderSql,
                [orderId, shop.id],
                (orderError, orders) => {

                    if (orderError) {

                        console.error(
                            "Get vendor order error:",
                            orderError
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Server error"
                        });
                    }


                    if (orders.length === 0) {

                        return res.status(404).json({
                            success: false,
                            message: "Order not found"
                        });
                    }


                    const order = orders[0];


                    // 3. Get order items

                    const itemsSql = `
                        SELECT
                            oi.id,
                            oi.order_id,
                            oi.product_id,
                            oi.quantity,
                            oi.price,
                            p.name AS product_name
                        FROM order_items oi
                        LEFT JOIN products p
                            ON p.id = oi.product_id
                        WHERE oi.order_id = ?
                        ORDER BY oi.id ASC
                    `;


                    db.query(
                        itemsSql,
                        [orderId],
                        (itemsError, items) => {

                            if (itemsError) {

                                console.error(
                                    "Get order items error:",
                                    itemsError
                                );

                                return res.status(500).json({
                                    success: false,
                                    message: "Server error"
                                });
                            }


                            return res.json({

                                success: true,

                                shop: {
                                    id: shop.id,
                                    name: shop.name
                                },

                                order: {
                                    ...order,
                                    items
                                }

                            });

                        }
                    );

                }
            );

        }
    );

};

const updateVendorOrderStatus = (req, res) => {

    const vendorId = req.user.id;
    const orderId = req.params.id;
    const { status } = req.body;


    const allowedStatuses = [
        "pending",
        "processing",
        "completed",
        "cancelled"
    ];


    // 1. Validate order ID

    if (!orderId || isNaN(orderId)) {

        return res.status(400).json({
            success: false,
            message: "Invalid order ID"
        });

    }


    // 2. Validate status

    if (!status || !allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message:
                "Invalid status. Allowed values: pending, processing, completed, cancelled"
        });

    }


    // 3. Find vendor's shop

    const shopSql = `
        SELECT id
        FROM shops
        WHERE vendor_id = ?
        LIMIT 1
    `;


    db.query(
        shopSql,
        [vendorId],
        (shopError, shops) => {

            if (shopError) {

                console.error(
                    "Find vendor shop error:",
                    shopError
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            if (shops.length === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "No shop found for this vendor"
                });

            }


            const shopId = shops[0].id;


            // 4. Make sure order belongs
            // to this vendor's shop

            const checkOrderSql = `
                SELECT
                    id,
                    status
                FROM orders
                WHERE id = ?
                AND shop_id = ?
                LIMIT 1
            `;


            db.query(
                checkOrderSql,
                [
                    orderId,
                    shopId
                ],
                (orderError, orders) => {

                    if (orderError) {

                        console.error(
                            "Check order error:",
                            orderError
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Server error"
                        });

                    }


                    if (orders.length === 0) {

                        return res.status(404).json({
                            success: false,
                            message: "Order not found"
                        });

                    }


                    // 5. Update status

                    const updateSql = `
                        UPDATE orders
                        SET status = ?
                        WHERE id = ?
                        AND shop_id = ?
                    `;


                    db.query(
                        updateSql,
                        [
                            status,
                            orderId,
                            shopId
                        ],
                        (updateError) => {

                            if (updateError) {

                                console.error(
                                    "Update order status error:",
                                    updateError
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Failed to update order status"
                                });

                            }


                            return res.json({

                                success: true,

                                message:
                                    "Order status updated successfully",

                                order: {
                                    id:
                                        Number(orderId),

                                    status

                                }

                            });

                        }
                    );

                }
            );

        }
    );

};
module.exports = {
    getVendorOrders,
    getVendorOrderById,
    updateVendorOrderStatus
};