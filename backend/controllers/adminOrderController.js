const db = require("../config/db");

// ========================================
// ADMIN ORDERS
// ========================================

// ========================================
// GET ALL ORDERS
// ========================================

const getAdminOrders = (req, res) => {

    const sql = `
        SELECT
            o.id,
            o.shop_id,
            o.customer_name,
            o.customer_phone,
            o.customer_address,
            o.total_amount,
            o.status,
            o.whatsapp_status,
            o.created_at,

            s.name AS shop_name,

            s.vendor_id,

            v.name AS vendor_name

        FROM orders o

        LEFT JOIN shops s
            ON o.shop_id = s.id

        LEFT JOIN vendors v
            ON s.vendor_id = v.id

        ORDER BY o.created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Get admin orders error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Server error"
            });

        }

        return res.json({
            success: true,
            orders: results || []
        });

    });

};


// ========================================
// GET SINGLE ORDER
// ========================================

const getAdminOrder = (req, res) => {

    const orderId = req.params.id;

    const orderSql = `
        SELECT
            o.id,
            o.shop_id,
            o.customer_name,
            o.customer_phone,
            o.customer_address,
            o.total_amount,
            o.status,
            o.whatsapp_status,
            o.created_at,

            s.name AS shop_name,
            s.logo AS shop_logo,
            s.vendor_id,

            v.name AS vendor_name,
            v.username AS vendor_username,
            v.phone AS vendor_phone

        FROM orders o

        LEFT JOIN shops s
            ON o.shop_id = s.id

        LEFT JOIN vendors v
            ON s.vendor_id = v.id

        WHERE o.id = ?

        LIMIT 1
    `;

    db.query(
        orderSql,
        [orderId],
        (err, orderResults) => {

            if (err) {

                console.error(
                    "Get admin order error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }

            if (orderResults.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });

            }

            const order =
                orderResults[0];


            // ========================================
            // GET ORDER ITEMS
            // ========================================

            const itemsSql = `
                SELECT
                    oi.id,
                    oi.order_id,
                    oi.product_id,
                    oi.quantity,
                    oi.price,

                    p.name AS product_name,
                    p.image AS product_image

                FROM order_items oi

                LEFT JOIN products p
                    ON oi.product_id = p.id

                WHERE oi.order_id = ?

                ORDER BY oi.id ASC
            `;

            db.query(
                itemsSql,
                [orderId],
                (itemsError, itemsResults) => {

                    if (itemsError) {

                        console.error(
                            "Get admin order items error:",
                            itemsError
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Server error"
                        });

                    }

                    return res.json({

                        success: true,

                        order: {
                            ...order,

                            items:
                                itemsResults || []

                        }

                    });

                }
            );

        }
    );

};


// ========================================
// UPDATE ORDER STATUS
// ========================================

const updateAdminOrderStatus = (req, res) => {

    const orderId = req.params.id;

    const { status } = req.body;


    // ========================================
    // ALLOWED STATUS
    // ========================================

    const allowedStatuses = [
        "pending",
        "processing",
        "completed",
        "cancelled"
    ];


    if (
        !allowedStatuses.includes(status)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid order status"

        });

    }


    // ========================================
    // CHECK ORDER EXISTS
    // ========================================

    const checkSql = `
        SELECT
            id,
            status
        FROM orders
        WHERE id = ?
        LIMIT 1
    `;

    db.query(
        checkSql,
        [orderId],
        (checkError, checkResults) => {

            if (checkError) {

                console.error(
                    "Check admin order error:",
                    checkError
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            if (checkResults.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });

            }


            // ========================================
            // UPDATE STATUS
            // ========================================

            const updateSql = `
                UPDATE orders

                SET status = ?

                WHERE id = ?
            `;

            db.query(
                updateSql,
                [status, orderId],
                (updateError, updateResult) => {

                    if (updateError) {

                        console.error(
                            "Update admin order status error:",
                            updateError
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Server error"
                        });

                    }


                    return res.json({

                        success: true,

                        message:
                            "Order status updated successfully.",

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

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    getAdminOrders,

    getAdminOrder,

    updateAdminOrderStatus

};