
const db = require("../config/db");


// ========================================
// GET SINGLE VENDOR DETAILS
// ========================================

const getAdminVendorDetails = (req, res) => {

    const vendorId = req.params.id;


    // ========================================
    // VALIDATE VENDOR ID
    // ========================================

    if (!vendorId || isNaN(vendorId)) {

        return res.status(400).json({
            success: false,
            message: "Invalid vendor ID"
        });

    }


    // ========================================
    // GET VENDOR
    // ========================================

    const vendorSql = `
        SELECT
            id,
            name,
            username,
            phone,
            status,
            created_at
        FROM vendors
        WHERE id = ?
        LIMIT 1
    `;


    db.query(
        vendorSql,
        [vendorId],
        (vendorError, vendors) => {

            if (vendorError) {

                console.error(
                    "Get admin vendor details error:",
                    vendorError
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            if (vendors.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Vendor not found"
                });

            }


            const vendor = vendors[0];


            // ========================================
            // GET VENDOR SHOPS
            // ========================================

            const shopsSql = `
                SELECT
                    id,
                    name,
                    description,
                    category,
                    logo,
                    whatsapp_number,
                    status,
                    created_at
                FROM shops
                WHERE vendor_id = ?
                ORDER BY created_at DESC
            `;


            db.query(
                shopsSql,
                [vendorId],
                (shopsError, shops) => {

                    if (shopsError) {

                        console.error(
                            "Get vendor shops error:",
                            shopsError
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Server error"
                        });

                    }


                    // ========================================
                    // GET VENDOR PRODUCTS
                    // ========================================

                    const productsSql = `
                        SELECT
                            p.id,
                            p.shop_id,
                            p.name,
                            p.description,
                            p.price,
                            p.category,
                            p.image,
                            p.stock,
                            p.status,
                            p.created_at
                        FROM products p
                        INNER JOIN shops s
                            ON s.id = p.shop_id
                        WHERE s.vendor_id = ?
                        ORDER BY p.created_at DESC
                    `;


                    db.query(
                        productsSql,
                        [vendorId],
                        (productsError, products) => {

                            if (productsError) {

                                console.error(
                                    "Get vendor products error:",
                                    productsError
                                );

                                return res.status(500).json({
                                    success: false,
                                    message: "Server error"
                                });

                            }


                            // ========================================
                            // GET VENDOR ORDERS
                            // ========================================

                            const ordersSql = `
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
                                    o.updated_at
                                FROM orders o
                                INNER JOIN shops s
                                    ON s.id = o.shop_id
                                WHERE s.vendor_id = ?
                                ORDER BY o.created_at DESC
                            `;


                            db.query(
                                ordersSql,
                                [vendorId],
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


                                    // ========================================
                                    // RESPONSE
                                    // ========================================

                                    return res.json({

                                        success: true,

                                        vendor: {

                                            id:
                                                vendor.id,

                                            name:
                                                vendor.name,

                                            username:
                                                vendor.username,

                                            phone:
                                                vendor.phone,

                                            status:
                                                vendor.status,

                                            created_at:
                                                vendor.created_at

                                        },

                                        shops,

                                        products,

                                        orders

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};


// ========================================
// EXPORT
// ========================================

module.exports = {
    getAdminVendorDetails
};

