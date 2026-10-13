const db = require("../config/db");


// ========================================
// ADMIN DASHBOARD STATISTICS
// ========================================

const getAdminDashboardStats = (req, res) => {

    // ========================================
    // TOTAL VENDORS
    // ========================================

    const vendorsSql = `
        SELECT COUNT(*) AS totalVendors
        FROM vendors
    `;


    // ========================================
    // TOTAL SHOPS
    // ========================================

    const shopsSql = `
        SELECT COUNT(*) AS totalShops
        FROM shops
    `;


    // ========================================
    // TOTAL PRODUCTS
    // ========================================

    const productsSql = `
        SELECT COUNT(*) AS totalProducts
        FROM products
    `;


    // ========================================
    // TOTAL ORDERS
    // ========================================

    const ordersSql = `
        SELECT COUNT(*) AS totalOrders
        FROM orders
    `;


    // ========================================
    // TOTAL REVENUE
    // ========================================

    const revenueSql = `
        SELECT
            COALESCE(
                SUM(total_amount),
                0
            ) AS totalRevenue
        FROM orders
        WHERE status != 'cancelled'
    `;


    // ========================================
    // ORDER STATUS COUNTS
    // ========================================

    const orderStatusSql = `
        SELECT
            status,
            COUNT(*) AS total
        FROM orders
        GROUP BY status
    `;


    // ========================================
    // RECENT ORDERS
    // ========================================

    const recentOrdersSql = `
        SELECT
            id,
            customer_name,
            customer_phone,
            total_amount,
            status,
            created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 5
    `;


    // ========================================
    // RUN VENDORS QUERY
    // ========================================

    db.query(
        vendorsSql,
        (vendorsError, vendorsResult) => {

            if (vendorsError) {

                console.error(
                    "Admin dashboard vendors error:",
                    vendorsError
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            // ========================================
            // RUN SHOPS QUERY
            // ========================================

            db.query(
                shopsSql,
                (shopsError, shopsResult) => {

                    if (shopsError) {

                        console.error(
                            "Admin dashboard shops error:",
                            shopsError
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Server error"
                        });

                    }


                    // ========================================
                    // RUN PRODUCTS QUERY
                    // ========================================

                    db.query(
                        productsSql,
                        (productsError, productsResult) => {

                            if (productsError) {

                                console.error(
                                    "Admin dashboard products error:",
                                    productsError
                                );

                                return res.status(500).json({
                                    success: false,
                                    message: "Server error"
                                });

                            }


                            // ========================================
                            // RUN ORDERS QUERY
                            // ========================================

                            db.query(
                                ordersSql,
                                (ordersError, ordersResult) => {

                                    if (ordersError) {

                                        console.error(
                                            "Admin dashboard orders error:",
                                            ordersError
                                        );

                                        return res.status(500).json({
                                            success: false,
                                            message: "Server error"
                                        });

                                    }


                                    // ========================================
                                    // RUN REVENUE QUERY
                                    // ========================================

                                    db.query(
                                        revenueSql,
                                        (
                                            revenueError,
                                            revenueResult
                                        ) => {

                                            if (revenueError) {

                                                console.error(
                                                    "Admin dashboard revenue error:",
                                                    revenueError
                                                );

                                                return res.status(500).json({
                                                    success: false,
                                                    message: "Server error"
                                                });

                                            }


                                            // ========================================
                                            // RUN ORDER STATUS QUERY
                                            // ========================================

                                            db.query(
                                                orderStatusSql,
                                                (
                                                    statusError,
                                                    statusResults
                                                ) => {

                                                    if (statusError) {

                                                        console.error(
                                                            "Admin dashboard order status error:",
                                                            statusError
                                                        );

                                                        return res.status(500).json({
                                                            success: false,
                                                            message: "Server error"
                                                        });

                                                    }


                                                    // ========================================
                                                    // RUN RECENT ORDERS QUERY
                                                    // ========================================

                                                    db.query(
                                                        recentOrdersSql,
                                                        (
                                                            recentOrdersError,
                                                            recentOrders
                                                        ) => {

                                                            if (
                                                                recentOrdersError
                                                            ) {

                                                                console.error(
                                                                    "Admin dashboard recent orders error:",
                                                                    recentOrdersError
                                                                );

                                                                return res.status(500).json({
                                                                    success: false,
                                                                    message:
                                                                        "Server error"
                                                                });

                                                            }


                                                            // ========================================
                                                            // DEFAULT STATUS COUNTS
                                                            // ========================================

                                                            let pendingOrders = 0;

                                                            let processingOrders = 0;

                                                            let completedOrders = 0;

                                                            let cancelledOrders = 0;


                                                            // ========================================
                                                            // MAP STATUS COUNTS
                                                            // ========================================

                                                            statusResults.forEach(
                                                                row => {

                                                                    const count =
                                                                        Number(
                                                                            row.total
                                                                        ) || 0;


                                                                    if (
                                                                        row.status ===
                                                                        "pending"
                                                                    ) {

                                                                        pendingOrders =
                                                                            count;

                                                                    }


                                                                    if (
                                                                        row.status ===
                                                                        "processing"
                                                                    ) {

                                                                        processingOrders =
                                                                            count;

                                                                    }


                                                                    if (
                                                                        row.status ===
                                                                        "completed"
                                                                    ) {

                                                                        completedOrders =
                                                                            count;

                                                                    }


                                                                    if (
                                                                        row.status ===
                                                                        "cancelled"
                                                                    ) {

                                                                        cancelledOrders =
                                                                            count;

                                                                    }

                                                                }
                                                            );


                                                            // ========================================
                                                            // RESPONSE
                                                            // ========================================

                                                            return res.json({

                                                                success: true,


                                                                // ========================================
                                                                // MAIN STATISTICS
                                                                // ========================================

                                                                stats: {

                                                                    totalVendors:
                                                                        Number(
                                                                            vendorsResult[0]
                                                                                .totalVendors
                                                                        ),


                                                                    totalShops:
                                                                        Number(
                                                                            shopsResult[0]
                                                                                .totalShops
                                                                        ),


                                                                    totalProducts:
                                                                        Number(
                                                                            productsResult[0]
                                                                                .totalProducts
                                                                        ),


                                                                    totalOrders:
                                                                        Number(
                                                                            ordersResult[0]
                                                                                .totalOrders
                                                                        ),


                                                                    totalRevenue:
                                                                        Number(
                                                                            revenueResult[0]
                                                                                .totalRevenue
                                                                        )

                                                                },


                                                                // ========================================
                                                                // ORDER OVERVIEW
                                                                // ========================================

                                                                overview: {

                                                                    pendingOrders,

                                                                    processingOrders,

                                                                    completedOrders,

                                                                    cancelledOrders

                                                                },


                                                                // ========================================
                                                                // RECENT ORDERS
                                                                // ========================================

                                                                recentOrders:
                                                                    recentOrders || []

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

        }
    );

};


module.exports = {
    getAdminDashboardStats
};