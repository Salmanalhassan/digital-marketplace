
// ========================================
// VENDOR SETTINGS CONTROLLER
// ========================================

const db = require("../config/db");
const bcrypt = require("bcrypt");


// ========================================
// CHANGE VENDOR PASSWORD
// ========================================

const changeVendorPassword = (req, res) => {

    const vendorId = req.user.id;

    const {
        currentPassword,
        newPassword,
        confirmPassword
    } = req.body;


    // ========================================
    // VALIDATE INPUT
    // ========================================

    if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Please fill in all password fields."
        });

    }


    // ========================================
    // CHECK NEW PASSWORD MATCH
    // ========================================

    if (
        newPassword !== confirmPassword
    ) {

        return res.status(400).json({
            success: false,
            message:
                "New password and confirm password do not match."
        });

    }


    // ========================================
    // PASSWORD LENGTH
    // ========================================

    if (
        newPassword.length < 6
    ) {

        return res.status(400).json({
            success: false,
            message:
                "New password must be at least 6 characters."
        });

    }


    // ========================================
    // GET VENDOR
    // ========================================

    const vendorSql = `
        SELECT
            id,
            password
        FROM vendors
        WHERE id = ?
        LIMIT 1
    `;


    db.query(
        vendorSql,
        [vendorId],
        async (vendorError, vendors) => {

            if (vendorError) {

                console.error(
                    "Get vendor for password change error:",
                    vendorError
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            // ========================================
            // VENDOR NOT FOUND
            // ========================================

            if (
                vendors.length === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message: "Vendor not found."
                });

            }


            const vendor =
                vendors[0];


            try {

                // ========================================
                // CHECK CURRENT PASSWORD
                // ========================================

                const passwordMatch =
                    await bcrypt.compare(
                        currentPassword,
                        vendor.password
                    );


                if (!passwordMatch) {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Current password is incorrect."
                    });

                }


                // ========================================
                // HASH NEW PASSWORD
                // ========================================

                const hashedPassword =
                    await bcrypt.hash(
                        newPassword,
                        10
                    );


                // ========================================
                // UPDATE PASSWORD
                // ========================================

                const updateSql = `
                    UPDATE vendors
                    SET password = ?
                    WHERE id = ?
                `;


                db.query(
                    updateSql,
                    [
                        hashedPassword,
                        vendorId
                    ],
                    (updateError) => {

                        if (updateError) {

                            console.error(
                                "Update vendor password error:",
                                updateError
                            );

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Failed to update password."
                            });

                        }


                        // ========================================
                        // SUCCESS
                        // ========================================

                        return res.json({

                            success: true,

                            message:
                                "Password changed successfully."

                        });

                    }
                );


            } catch (error) {

                console.error(
                    "Change vendor password error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }

        }
    );

};


// ========================================
// EXPORT
// ========================================

module.exports = {
    changeVendorPassword
};

