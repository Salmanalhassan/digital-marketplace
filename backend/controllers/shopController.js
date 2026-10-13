const db = require("../config/db");

const createShop = (req, res) => {
    const {
        vendor_id,
        name,
        description,
        category,
        whatsapp_number
    } = req.body;

    if (
        !vendor_id ||
        !name ||
        !whatsapp_number
    ) {
        return res.status(400).json({
            success: false,
            message: "Vendor ID, shop name and WhatsApp number are required"
        });
    }

    const checkVendorSql = `
        SELECT id
        FROM vendors
        WHERE id = ?
        LIMIT 1
    `;

    db.query(
        checkVendorSql,
        [vendor_id],
        (err, vendorResults) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }

            if (vendorResults.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Vendor not found"
                });
            }

            const insertSql = `
                INSERT INTO shops
                (
                    vendor_id,
                    name,
                    description,
                    category,
                    whatsapp_number
                )
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [
                    vendor_id,
                    name,
                    description || null,
                    category || null,
                    whatsapp_number
                ],
                (err, result) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to create shop"
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "Shop created successfully",
                        shop: {
                            id: result.insertId,
                            vendor_id,
                            name,
                            description: description || null,
                            category: category || null,
                            whatsapp_number
                        }
                    });
                }
            );
        }
    );
};


const getMyShop = (req, res) => {
    const vendorId = req.user.id;

    const sql = `
        SELECT
            id,
            vendor_id,
            name,
            description,
            category,
            logo,
            whatsapp_number,
            status,
            created_at
        FROM shops
        WHERE vendor_id = ?
        LIMIT 1
    `;

    db.query(sql, [vendorId], (err, results) => {

        if (err) {
            console.error("Get shop error:", err);

            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            });
        }

        return res.json({
            success: true,
            shop: results[0]
        });
    });
};
module.exports = {
    createShop,
    getMyShop
};