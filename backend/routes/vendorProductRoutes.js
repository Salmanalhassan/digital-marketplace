const express = require("express");

const router = express.Router();
const {

    getVendorProducts,

    getVendorProductById,

    createProduct,

    updateProduct,

    deleteProduct

} = require("../controllers/vendorProductController");
const {
    authenticateToken,
    requireVendor
} = require("../middleware/authMiddleware");


const upload =
    require("../middleware/upload");


// ========================================
// GET VENDOR PRODUCTS
// ========================================

router.get(
    "/",
    authenticateToken,
    requireVendor,
    getVendorProducts
);

// ========================================
// GET SINGLE VENDOR PRODUCT
// ========================================

router.get(
    "/:id",
    authenticateToken,
    requireVendor,
    getVendorProductById
);
// ========================================
// CREATE VENDOR PRODUCT
// ========================================

router.post(
    "/",
    authenticateToken,
    requireVendor,
    upload.single("image"),
    createProduct
);

// ========================================
// UPDATE VENDOR PRODUCT
// ========================================

router.put(
    "/:id",
    authenticateToken,
    requireVendor,
    upload.single("image"),
    updateProduct
);

// ========================================
// DELETE VENDOR PRODUCT
// ========================================

router.delete(

    "/:id",

    authenticateToken,

    requireVendor,

    deleteProduct

);

module.exports = router;