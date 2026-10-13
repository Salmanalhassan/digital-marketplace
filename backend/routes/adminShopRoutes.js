const express = require("express");

const router = express.Router();

const {
    getAdminShops,
    updateAdminShopStatus
} = require("../controllers/adminShopController");

const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");


// ========================================
// GET ALL SHOPS
// ========================================

router.get(
    "/",
    authenticateToken,
    requireAdmin,
    getAdminShops
);


// ========================================
// UPDATE SHOP STATUS
// ========================================

router.patch(
    "/:id/status",
    authenticateToken,
    requireAdmin,
    updateAdminShopStatus
);


module.exports = router;