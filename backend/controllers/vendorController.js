const bcrypt = require("bcryptjs");
const db = require("../config/db");

const createVendor = async (req, res) => {
    const {
        name,
        phone,
        username,
        password
    } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, username and password are required"
        });
    }

    try {
        const checkSql = `
            SELECT id
            FROM vendors
            WHERE username = ?
            LIMIT 1
        `;

        db.query(
            checkSql,
            [username],
            async (err, results) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message: "Server error"
                    });
                }

                if (results.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: "Username already exists"
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                const insertSql = `
                    INSERT INTO vendors
                    (name, phone, username, password)
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [
                        name,
                        phone || null,
                        username,
                        hashedPassword
                    ],
                    (err, result) => {

                        if (err) {
                            console.error(err);

                            return res.status(500).json({
                                success: false,
                                message: "Failed to create vendor"
                            });
                        }

                        return res.status(201).json({
                            success: true,
                            message: "Vendor created successfully",
                            vendor: {
                                id: result.insertId,
                                name,
                                phone: phone || null,
                                username
                            }
                        });
                    }
                );
            }
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    createVendor
};