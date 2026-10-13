
const db = require("../config/db");


// ========================================
// GET VENDOR SHOP
// ========================================

const getVendorShop = (req, res) => {

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


    db.query(
        sql,
        [vendorId],
        (error, shops) => {

            if (error) {

                console.error(
                    "Get vendor shop error:",
                    error
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


            return res.json({

                success: true,

                shop: shops[0]

            });

        }
    );

};



// ========================================
// CREATE VENDOR SHOP
// ========================================

const createVendorShop = (req, res) => {

    const vendorId = req.user.id;


    const {
        name,
        description,
        category,
        logo,
        whatsapp_number
    } = req.body;



    // ========================================
    // VALIDATE SHOP NAME
    // ========================================

    if (
        !name ||
        !String(name).trim()
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Shop name is required"

        });

    }



    // ========================================
    // VALIDATE WHATSAPP NUMBER
    // ========================================

    if (
        !whatsapp_number ||
        !String(whatsapp_number).trim()
    ) {

        return res.status(400).json({

            success: false,

            message:
                "WhatsApp number is required"

        });

    }



    // ========================================
    // CHECK VENDOR
    // ========================================

    const vendorSql = `
        SELECT
            id,
            name,
            status
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
                    "Check vendor error:",
                    vendorError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Server error"

                });

            }



            // ========================================
            // VENDOR NOT FOUND
            // ========================================

            if (vendors.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Vendor account not found"

                });

            }



            const vendor =
                vendors[0];



            // ========================================
            // CHECK VENDOR STATUS
            // ========================================

            if (
                String(
                    vendor.status || ""
                ).toLowerCase() !== "active"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Your vendor account is inactive. You cannot create a shop."

                });

            }



            // ========================================
            // CHECK EXISTING SHOP
            // ========================================

            const existingShopSql = `
                SELECT
                    id,
                    name
                FROM shops
                WHERE vendor_id = ?
                LIMIT 1
            `;


            db.query(
                existingShopSql,
                [vendorId],
                (existingError, existingShops) => {

                    if (existingError) {

                        console.error(
                            "Check existing shop error:",
                            existingError
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                "Server error"

                        });

                    }



                    // ========================================
                    // VENDOR ALREADY HAS SHOP
                    // ========================================

                    if (
                        existingShops.length > 0
                    ) {

                        return res.status(409).json({

                            success: false,

                            message:
                                "You already have a shop. You can update your existing shop."

                        });

                    }



                    // ========================================
                    // PREPARE DATA
                    // ========================================

                    const shopName =
                        String(
                            name
                        ).trim();


                    const shopDescription =
                        description
                            ? String(
                                description
                            ).trim()
                            : null;


                    const shopCategory =
                        category
                            ? String(
                                category
                            ).trim()
                            : null;


                    const shopLogo =
                        logo
                            ? String(
                                logo
                            ).trim()
                            : null;


                    const shopWhatsapp =
                        String(
                            whatsapp_number
                        ).trim();



                    // ========================================
                    // CREATE SHOP
                    // ========================================

                    const createShopSql = `
                        INSERT INTO shops
                        (
                            vendor_id,
                            name,
                            description,
                            category,
                            logo,
                            whatsapp_number,
                            status
                        )
                        VALUES
                        (
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            ?,
                            'active'
                        )
                    `;


                    db.query(
                        createShopSql,
                        [
                            vendorId,
                            shopName,
                            shopDescription,
                            shopCategory,
                            shopLogo,
                            shopWhatsapp
                        ],
                        (
                            createError,
                            result
                        ) => {

                            if (createError) {

                                console.error(
                                    "Create vendor shop error:",
                                    createError
                                );

                                return res.status(500).json({

                                    success: false,

                                    message:
                                        "Failed to create shop"

                                });

                            }



                            // ========================================
                            // SUCCESS
                            // ========================================

                            return res.status(201).json({

                                success: true,

                                message:
                                    "Shop created successfully",

                                shop: {

                                    id:
                                        result.insertId,

                                    vendor_id:
                                        Number(
                                            vendorId
                                        ),

                                    name:
                                        shopName,

                                    description:
                                        shopDescription,

                                    category:
                                        shopCategory,

                                    logo:
                                        shopLogo,

                                    whatsapp_number:
                                        shopWhatsapp,

                                    status:
                                        "active"

                                }

                            });

                        }
                    );

                }
            );

        }
    );

};



// ========================================
// UPDATE VENDOR SHOP
// ========================================

const updateVendorShop = (req, res) => {

    const vendorId = req.user.id;


    const {
        name,
        description,
        category,
        logo,
        whatsapp_number
    } = req.body;



    // ========================================
    // VALIDATION
    // ========================================

    if (
        !name ||
        !String(name).trim()
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Shop name is required"

        });

    }


    if (
        !whatsapp_number ||
        !String(whatsapp_number).trim()
    ) {

        return res.status(400).json({

            success: false,

            message:
                "WhatsApp number is required"

        });

    }



    // ========================================
    // FIND VENDOR SHOP
    // ========================================

    const findShopSql = `
        SELECT
            id
        FROM shops
        WHERE vendor_id = ?
        LIMIT 1
    `;


    db.query(
        findShopSql,
        [vendorId],
        (findError, shops) => {

            if (findError) {

                console.error(
                    "Find vendor shop error:",
                    findError
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Server error"

                });

            }



            if (shops.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "No shop found for this vendor"

                });

            }



            const shopId =
                shops[0].id;



            // ========================================
            // PREPARE DATA
            // ========================================

            const shopName =
                String(
                    name
                ).trim();


            const shopDescription =
                description !== undefined
                    ? (
                        description
                            ? String(
                                description
                            ).trim()
                            : null
                    )
                    : null;


            const shopCategory =
                category !== undefined
                    ? (
                        category
                            ? String(
                                category
                            ).trim()
                            : null
                    )
                    : null;


            const shopLogo =
                logo !== undefined
                    ? (
                        logo
                            ? String(
                                logo
                            ).trim()
                            : null
                    )
                    : null;


            const shopWhatsapp =
                String(
                    whatsapp_number
                ).trim();



            // ========================================
            // UPDATE SHOP
            // ========================================

            const updateSql = `
                UPDATE shops
                SET
                    name = ?,
                    description = ?,
                    category = ?,
                    logo = ?,
                    whatsapp_number = ?
                WHERE id = ?
                AND vendor_id = ?
            `;


            db.query(
                updateSql,
                [
                    shopName,
                    shopDescription,
                    shopCategory,
                    shopLogo,
                    shopWhatsapp,
                    shopId,
                    vendorId
                ],
                (updateError) => {

                    if (updateError) {

                        console.error(
                            "Update vendor shop error:",
                            updateError
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                "Failed to update shop"

                        });

                    }



                    // ========================================
                    // SUCCESS
                    // ========================================

                    return res.json({

                        success: true,

                        message:
                            "Shop profile updated successfully",

                        shop: {

                            id:
                                shopId,

                            vendor_id:
                                Number(
                                    vendorId
                                ),

                            name:
                                shopName,

                            description:
                                shopDescription,

                            category:
                                shopCategory,

                            logo:
                                shopLogo,

                            whatsapp_number:
                                shopWhatsapp

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

    getVendorShop,

    createVendorShop,

    updateVendorShop

};

