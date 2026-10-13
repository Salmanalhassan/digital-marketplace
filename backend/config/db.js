
const mysql = require("mysql2");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "..", ".env")
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("Aiven MySQL Database Connected Successfully");
});

module.exports = db;
