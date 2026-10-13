const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const adminLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const sql = "SELECT * FROM admins WHERE email = ? LIMIT 1";

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Admin login error:", err);

            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const admin = results[0];

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });
    });
};


const vendorLogin = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    const sql = `
        SELECT *
        FROM vendors
        WHERE username = ?
        LIMIT 1
    `;

    db.query(sql, [username], async (err, results) => {

        if (err) {
            console.error("Vendor login error:", err);

            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const vendor = results[0];

        if (vendor.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your vendor account is inactive"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            vendor.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                id: vendor.id,
                username: vendor.username,
                role: "vendor"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            success: true,
            message: "Vendor login successful",
            token,
            vendor: {
                id: vendor.id,
                name: vendor.name,
                phone: vendor.phone,
                username: vendor.username
            }
        });
    });
};
module.exports = {
    adminLogin,
    vendorLogin
};