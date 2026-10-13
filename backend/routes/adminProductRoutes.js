
const express = require("express");

const router = express.Router();


// ========================================
// CONTROLLER
// ========================================

const {
    getAdminProducts,
    getAdminProduct,
    updateAdminProductStatus
} = require("../controllers/adminProductController");


// ========================================
// AUTH MIDDLEWARE
// ========================================

const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");


// ========================================
// GET ALL PRODUCTS
// ========================================

router.get(
    "/",
    authenticateToken,
    requireAdmin,
    getAdminProducts
);


// ========================================
// GET SINGLE PRODUCT
// ========================================

router.get(
    "/:id",
    authenticateToken,
    requireAdmin,
    getAdminProduct
);


// ========================================
// UPDATE PRODUCT STATUS
// ========================================

router.patch(
    "/:id/status",
    authenticateToken,
    requireAdmin,
    updateAdminProductStatus
);


// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;

