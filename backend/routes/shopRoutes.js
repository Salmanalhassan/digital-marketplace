const express = require("express");

const router = express.Router();
const {
    createShop,
    getMyShop
} = require("../controllers/shopController");
const {
    authenticateToken,
    requireAdmin,
    requireVendor
} = require("../middleware/authMiddleware");

router.post(
    "/",
    authenticateToken,
    requireAdmin,
    createShop
);
router.get(
    "/my-shop",
    authenticateToken,
    requireVendor,
    getMyShop
);

module.exports = router;