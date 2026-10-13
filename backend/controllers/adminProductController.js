const db = require("../config/db");


// ========================================
// GET ALL PRODUCTS FOR ADMIN
// ========================================

const getAdminProducts = (req, res) => {

    const sql = `
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
            p.created_at,

            s.name AS shop_name,
            s.logo AS shop_logo,

            v.id AS vendor_id,
            v.name AS vendor_name,
            v.username AS vendor_username,
            v.phone AS vendor_phone

        FROM products p

        INNER JOIN shops s
            ON p.shop_id = s.id

        INNER JOIN vendors v
            ON s.vendor_id = v.id

        ORDER BY p.created_at DESC
    `;


    db.query(
        sql,
        (error, products) => {

            if (error) {

                console.error(
                    "Get admin products error:",
                    error
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Server error"

                });

            }


            return res.json({

                success: true,

                products: products || []

            });

        }
    );

};



// ========================================
// GET SINGLE PRODUCT
// ========================================

const getAdminProduct = (req, res) => {

    const productId = req.params.id;


    // ========================================
    // VALIDATE PRODUCT ID
    // ========================================

    if (
        !productId ||
        isNaN(productId)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid product ID"

        });

    }


    const sql = `
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
            p.created_at,

            s.name AS shop_name,
            s.logo AS shop_logo,

            v.id AS vendor_id,
            v.name AS vendor_name,
            v.username AS vendor_username,
            v.phone AS vendor_phone

        FROM products p

        INNER JOIN shops s
            ON p.shop_id = s.id

        INNER JOIN vendors v
            ON s.vendor_id = v.id

        WHERE p.id = ?

        LIMIT 1
    `;


    db.query(
        sql,
        [productId],
        (error, products) => {

            if (error) {

                console.error(
                    "Get admin product error:",
                    error
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Server error"

                });

            }


            if (
                products.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            return res.json({

                success: true,

                product: products[0]

            });

        }
    );

};



// ========================================
// UPDATE PRODUCT STATUS
// ========================================

const updateAdminProductStatus = (
    req,
    res
) => {

    const productId =
        req.params.id;

    const {
        status
    } = req.body;


    // ========================================
    // VALIDATE PRODUCT ID
    // ========================================

    if (
        !productId ||
        isNaN(productId)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid product ID"

        });

    }


    // ========================================
    // VALIDATE STATUS
    // ========================================

    const allowedStatuses = [
        "active",
        "inactive"
    ];


    if (
        !status ||
        !allowedStatuses.includes(status)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid status. Allowed values: active, inactive"

        });

    }


    // ========================================
    // UPDATE PRODUCT
    // ========================================

    const sql = `
        UPDATE products
        SET status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            status,
            productId
        ],
        (
            error,
            result
        ) => {

            if (error) {

                console.error(
                    "Update admin product status error:",
                    error
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Server error"

                });

            }


            // ========================================
            // PRODUCT NOT FOUND
            // ========================================

            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            // ========================================
            // SUCCESS
            // ========================================

            return res.json({

                success: true,

                message:
                    "Product status updated successfully",

                product: {

                    id:
                        Number(productId),

                    status

                }

            });

        }
    );

};



// ========================================
// EXPORT
// ========================================

module.exports = {

    getAdminProducts,

    getAdminProduct,

    updateAdminProductStatus

};

