const db = require("../config/db");


// ========================================
// GET ALL SHOPS
// ========================================

const getAdminShops = (req, res) => {

    const sql = `
        SELECT
            s.id,
            s.vendor_id,
            s.name,
            s.description,
            s.category,
            s.logo,
            s.whatsapp_number,
            s.status,
            s.created_at,

            v.name AS vendor_name,
            v.username AS vendor_username

        FROM shops s

        LEFT JOIN vendors v
            ON s.vendor_id = v.id

        ORDER BY s.created_at DESC
    `;


    db.query(
        sql,
        (error, shops) => {

            if (error) {

                console.error(
                    "Get admin shops error:",
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

                shops

            });

        }
    );

};



// ========================================
// UPDATE SHOP STATUS
// ========================================

const updateAdminShopStatus = (req, res) => {

    const shopId =
        req.params.id;


    const { status } =
        req.body;


    // ========================================
    // ALLOWED STATUSES
    // ========================================

    const allowedStatuses = [
        "active",
        "inactive"
    ];



    // ========================================
    // VALIDATE SHOP ID
    // ========================================

    if (
        !shopId ||
        isNaN(shopId)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid shop ID"

        });

    }



    // ========================================
    // VALIDATE STATUS
    // ========================================

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
    // UPDATE SHOP
    // ========================================

    const sql = `
        UPDATE shops
        SET status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            status,
            shopId
        ],
        (error, result) => {

            if (error) {

                console.error(
                    "Update admin shop status error:",
                    error
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Server error"

                });

            }



            // ========================================
            // SHOP NOT FOUND
            // ========================================

            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Shop not found"

                });

            }



            // ========================================
            // SUCCESS
            // ========================================

            return res.json({

                success: true,

                message:
                    "Shop status updated successfully",

                shop: {

                    id:
                        Number(shopId),

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

    getAdminShops,

    updateAdminShopStatus

};