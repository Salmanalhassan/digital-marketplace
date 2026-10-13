
const express = require("express");

const router = express.Router();


// ========================================
// AUTHENTICATION
// ========================================

const {
    authenticateToken,
    requireVendor
} = require("../middleware/authMiddleware");


// ========================================
// CONTROLLER
// ========================================

const {
    changeVendorPassword
} = require("../controllers/vendorSettingsController");


// ========================================
// CHANGE VENDOR PASSWORD
// ========================================

router.patch(
    "/password",
    authenticateToken,
    requireVendor,
    changeVendorPassword
);


// ========================================
// EXPORT
// ========================================

module.exports = router;

