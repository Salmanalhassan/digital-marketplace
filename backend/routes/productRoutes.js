const express = require("express");

const router = express.Router();

const {
    addProduct,
    getMyProducts,
    updateProduct,
    deleteProduct,
    getPublicProduct
} = require("../controllers/productController");

const {
    authenticateToken,
    requireVendor
} = require("../middleware/authMiddleware");


// ========================================
// VENDOR ADD PRODUCT
// ========================================

router.post(
    "/",
    authenticateToken,
    requireVendor,
    addProduct
);


// ========================================
// VENDOR MY PRODUCTS
// ========================================

router.get(
    "/my-products",
    authenticateToken,
    requireVendor,
    getMyProducts
);


// ========================================
// PUBLIC PRODUCT DETAILS
// ========================================

router.get(
    "/:id",
    getPublicProduct
);


// ========================================
// VENDOR UPDATE PRODUCT
// ========================================

router.put(
    "/:id",
    authenticateToken,
    requireVendor,
    updateProduct
);


// ========================================
// VENDOR DELETE PRODUCT
// ========================================

router.delete(
    "/:id",
    authenticateToken,
    requireVendor,
    deleteProduct
);


module.exports = router;