const bcrypt = require("bcryptjs");
const db = require("./config/db");

const username = "aisha_fashion";
const newPassword = "Aisha@123";

bcrypt.hash(newPassword, 10, (err, hash) => {

    if (err) {
        console.error("Password hashing failed:", err);
        process.exit(1);
    }

    const sql = `
        UPDATE vendors
        SET password = ?
        WHERE username = ?
    `;

    db.query(sql, [hash, username], (error, result) => {

        if (error) {
            console.error(
                "Password update failed:",
                error.message
            );

            process.exit(1);
        }

        if (result.affectedRows === 0) {

            console.log(
                "Vendor account not found."
            );

            process.exit(1);
        }

        console.log(
            "Vendor password updated successfully."
        );

        console.log(
            "Username:",
            username
        );

        console.log(
            "Password:",
            newPassword
        );

        process.exit(0);
    });

});