const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function createAdmin() {
    try {
        const name = "Main Admin";
        const email = "admin@digitalmarketplace.com";
        const password = "admin12345";

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO admins (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, hashedPassword],
            (err, result) => {
                if (err) {
                    console.error("Error creating admin:", err.message);
                    db.end();
                    return;
                }

                console.log("Admin created successfully!");
                console.log("Admin ID:", result.insertId);

                db.end();
            }
        );

    } catch (error) {
        console.error("Error:", error.message);
        db.end();
    }
}

createAdmin();