const db = require("../config/db");
const bcrypt = require("bcryptjs");


// ========================================
// GET ALL VENDORS
// ========================================

const getAdminVendors = (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            username,
            phone,
            status,
            created_at
        FROM vendors
        ORDER BY created_at DESC
    `;


    db.query(
        sql,
        (error, vendors) => {

            if (error) {

                console.error(
                    "Get admin vendors error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            return res.json({

                success: true,

                vendors

            });

        }
    );

};



// ========================================
// CREATE ADMIN VENDOR
// ========================================

const createAdminVendor = async (req, res) => {

    try {

        const {
            name,
            username,
            phone,
            password,
            status
        } = req.body;


        // ========================================
        // CLEAN INPUT
        // ========================================

        const cleanName =
            String(name || "").trim();


        const cleanUsername =
            String(username || "")
                .trim()
                .toLowerCase();


        const cleanPhone =
            String(phone || "").trim();


        const cleanPassword =
            String(password || "");


        const cleanStatus =
            String(status || "active")
                .trim()
                .toLowerCase();



        // ========================================
        // REQUIRED FIELDS
        // ========================================

        if (
            !cleanName ||
            !cleanUsername ||
            !cleanPhone ||
            !cleanPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, username, phone and password are required"

            });

        }



        // ========================================
        // USERNAME VALIDATION
        // ========================================

        if (cleanUsername.length < 3) {

            return res.status(400).json({

                success: false,

                message:
                    "Username must be at least 3 characters"

            });

        }



        // ========================================
        // PASSWORD VALIDATION
        // ========================================

        if (cleanPassword.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters"

            });

        }



        // ========================================
        // STATUS VALIDATION
        // ========================================

        const allowedStatuses = [
            "active",
            "inactive"
        ];


        if (
            !allowedStatuses.includes(
                cleanStatus
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid status. Allowed values: active, inactive"

            });

        }



        // ========================================
        // CHECK USERNAME
        // ========================================

        const checkUsernameSql = `
            SELECT
                id
            FROM vendors
            WHERE username = ?
            LIMIT 1
        `;


        db.query(
            checkUsernameSql,
            [cleanUsername],
            async (usernameError, usernameResult) => {

                if (usernameError) {

                    console.error(
                        "Check vendor username error:",
                        usernameError
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Server error"

                    });

                }



                // ========================================
                // USERNAME EXISTS
                // ========================================

                if (
                    usernameResult &&
                    usernameResult.length > 0
                ) {

                    return res.status(409).json({

                        success: false,

                        message:
                            "Username already exists"

                    });

                }



                // ========================================
                // HASH PASSWORD
                // ========================================

                let hashedPassword;


                try {

                    hashedPassword =
                        await bcrypt.hash(
                            cleanPassword,
                            10
                        );

                } catch (hashError) {

                    console.error(
                        "Hash vendor password error:",
                        hashError
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to secure password"

                    });

                }



                // ========================================
                // INSERT VENDOR
                // ========================================

                const insertSql = `
                    INSERT INTO vendors
                    (
                        name,
                        username,
                        phone,
                        password,
                        status
                    )
                    VALUES
                    (?, ?, ?, ?, ?)
                `;


                db.query(
                    insertSql,
                    [
                        cleanName,
                        cleanUsername,
                        cleanPhone,
                        hashedPassword,
                        cleanStatus
                    ],
                    (insertError, result) => {

                        if (insertError) {

                            console.error(
                                "Create admin vendor error:",
                                insertError
                            );



                            // ========================================
                            // DUPLICATE USERNAME
                            // ========================================

                            if (
                                insertError.code ===
                                "ER_DUP_ENTRY"
                            ) {

                                return res.status(409).json({

                                    success: false,

                                    message:
                                        "Username already exists"

                                });

                            }



                            return res.status(500).json({

                                success: false,

                                message:
                                    "Unable to create vendor"

                            });

                        }



                        // ========================================
                        // SUCCESS
                        // ========================================

                        return res.status(201).json({

                            success: true,

                            message:
                                "Vendor created successfully",

                            vendor: {

                                id:
                                    result.insertId,

                                name:
                                    cleanName,

                                username:
                                    cleanUsername,

                                phone:
                                    cleanPhone,

                                status:
                                    cleanStatus

                            }

                        });

                    }
                );

            }
        );


    } catch (error) {

        console.error(
            "Create admin vendor unexpected error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

};



// ========================================
// UPDATE VENDOR STATUS
// ========================================

const updateAdminVendorStatus = (req, res) => {

    const vendorId = req.params.id;

    const { status } = req.body;


    const allowedStatuses = [
        "active",
        "inactive"
    ];


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


    const sql = `
        UPDATE vendors
        SET status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            status,
            vendorId
        ],
        (error, result) => {

            if (error) {

                console.error(
                    "Update admin vendor status error:",
                    error
                );

                return res.status(500).json({

                    success: false,

                    message: "Server error"

                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,

                    message: "Vendor not found"

                });

            }


            return res.json({

                success: true,

                message:
                    "Vendor status updated successfully",

                vendor: {

                    id:
                        Number(vendorId),

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

    getAdminVendors,

    createAdminVendor,

    updateAdminVendorStatus

};