
const express = require("express");

const router = express.Router();


const {
    getAdminVendorDetails
} = require("../controllers/adminVendorDetailsController");


const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");


// ========================================
// GET SINGLE VENDOR DETAILS
// ========================================

router.get(
    "/:id/details",
    authenticateToken,
    requireAdmin,
    getAdminVendorDetails
);


module.exports = router;

