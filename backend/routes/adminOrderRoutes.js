const express = require("express");

const router = express.Router();


// ========================================
// CONTROLLER
// ========================================

const {
    getAdminOrders,
    getAdminOrder,
    updateAdminOrderStatus
} = require("../controllers/adminOrderController");


// ========================================
// AUTH MIDDLEWARE
// ========================================

const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");


// ========================================
// GET ALL ORDERS
// ========================================

router.get(
    "/",
    authenticateToken,
    requireAdmin,
    getAdminOrders
);


// ========================================
// GET SINGLE ORDER
// ========================================

router.get(
    "/:id",
    authenticateToken,
    requireAdmin,
    getAdminOrder
);


// ========================================
// UPDATE ORDER STATUS
// ========================================

router.patch(
    "/:id/status",
    authenticateToken,
    requireAdmin,
    updateAdminOrderStatus
);


// ========================================
// EXPORT
// ========================================

module.exports = router;