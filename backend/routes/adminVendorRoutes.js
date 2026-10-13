const express = require("express");

const router = express.Router();


const {

    getAdminVendors,

    createAdminVendor,

    updateAdminVendorStatus

} = require("../controllers/adminVendorController");


const {

    authenticateToken,

    requireAdmin

} = require("../middleware/authMiddleware");



// ========================================
// GET ALL VENDORS
// ========================================

router.get(

    "/",

    authenticateToken,

    requireAdmin,

    getAdminVendors

);



// ========================================
// CREATE VENDOR
// ========================================

router.post(

    "/",

    authenticateToken,

    requireAdmin,

    createAdminVendor

);



// ========================================
// UPDATE VENDOR STATUS
// ========================================

router.patch(

    "/:id/status",

    authenticateToken,

    requireAdmin,

    updateAdminVendorStatus

);


module.exports = router;