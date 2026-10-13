// ========================================
// ADMIN SETTINGS CONTROLLER
// ========================================

const bcrypt = require("bcryptjs");
const db = require("../config/db");


// ========================================
// GET ADMIN SETTINGS
// ========================================

const getAdminSettings = async (req, res) => {
    try {

        const adminId = req.user.id;

        const [admins] = await db.promise().query(
            `
            SELECT
                id,
                name,
                email
            FROM admins
            WHERE id = ?
            LIMIT 1
            `,
            [adminId]
        );


        if (admins.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Admin account not found."
            });

        }


        return res.status(200).json({
            success: true,
            admin: admins[0]
        });


    } catch (error) {

        console.error(
            "Get admin settings error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load admin settings."
        });

    }
};



// ========================================
// UPDATE ADMIN PROFILE
// ========================================

const updateAdminSettings = async (req, res) => {
    try {

        const adminId = req.user.id;

        const {
            name,
            email
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Admin name is required."
            });

        }


        if (!email || !email.trim()) {

            return res.status(400).json({
                success: false,
                message: "Admin email is required."
            });

        }


        const cleanName =
            name.trim();

        const cleanEmail =
            email.trim().toLowerCase();


        // ========================================
        // CHECK EMAIL
        // ========================================

        const [existingAdmins] =
            await db.promise().query(
                `
                SELECT id
                FROM admins
                WHERE email = ?
                AND id != ?
                LIMIT 1
                `,
                [
                    cleanEmail,
                    adminId
                ]
            );


        if (existingAdmins.length > 0) {

            return res.status(409).json({
                success: false,
                message: "This email is already being used by another admin."
            });

        }


        // ========================================
        // UPDATE ADMIN
        // ========================================

        const [result] =
            await db.promise().query(
                `
                UPDATE admins
                SET
                    name = ?,
                    email = ?
                WHERE id = ?
                `,
                [
                    cleanName,
                    cleanEmail,
                    adminId
                ]
            );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Admin account not found."
            });

        }


        // ========================================
        // RETURN UPDATED ADMIN
        // ========================================

        return res.status(200).json({
            success: true,
            message: "Admin settings updated successfully.",
            admin: {
                id: adminId,
                name: cleanName,
                email: cleanEmail
            }
        });


    } catch (error) {

        console.error(
            "Update admin settings error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to update admin settings."
        });

    }
};



// ========================================
// CHANGE ADMIN PASSWORD
// ========================================

const changeAdminPassword = async (req, res) => {
    try {

        const adminId = req.user.id;

        const {
            currentPassword,
            newPassword
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !currentPassword ||
            !newPassword
        ) {

            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });

        }


        if (newPassword.length < 6) {

            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters."
            });

        }


        if (
            currentPassword ===
            newPassword
        ) {

            return res.status(400).json({
                success: false,
                message: "New password must be different from current password."
            });

        }


        // ========================================
        // GET ADMIN PASSWORD
        // ========================================

        const [admins] =
            await db.promise().query(
                `
                SELECT
                    id,
                    password
                FROM admins
                WHERE id = ?
                LIMIT 1
                `,
                [adminId]
            );


        if (admins.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Admin account not found."
            });

        }


        const admin =
            admins[0];


        // ========================================
        // VERIFY CURRENT PASSWORD
        // ========================================

        const passwordMatch =
            await bcrypt.compare(
                currentPassword,
                admin.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
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

        await db.promise().query(
            `
            UPDATE admins
            SET password = ?
            WHERE id = ?
            `,
            [
                hashedPassword,
                adminId
            ]
        );


        // ========================================
        // SUCCESS
        // ========================================

        return res.status(200).json({
            success: true,
            message: "Admin password changed successfully."
        });


    } catch (error) {

        console.error(
            "Change admin password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to change admin password."
        });

    }
};



// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
    getAdminSettings,
    updateAdminSettings,
    changeAdminPassword
};