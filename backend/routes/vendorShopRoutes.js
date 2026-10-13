//```javascript//
const express = require("express");

const router = express.Router();


const {

    getVendorShop,

    createVendorShop,

    updateVendorShop

} = require("../controllers/vendorShopController");


const {

    authenticateToken,

    requireVendor

} = require("../middleware/authMiddleware");



// ========================================
// GET VENDOR SHOP
// ========================================

router.get(

    "/",

    authenticateToken,

    requireVendor,

    getVendorShop

);



// ========================================
// CREATE VENDOR SHOP
// ========================================

router.post(

    "/",

    authenticateToken,

    requireVendor,

    createVendorShop

);



// ========================================
// UPDATE VENDOR SHOP
// ========================================

router.put(

    "/",

    authenticateToken,

    requireVendor,

    updateVendorShop

);

// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;

