const express = require("express");

const router = express.Router();

const {
    createVendor
} = require("../controllers/vendorController");

const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");

router.post(
    "/",
    authenticateToken,
    requireAdmin,
    createVendor
);

module.exports = router;