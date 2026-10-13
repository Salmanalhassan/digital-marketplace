const express = require("express");

const router = express.Router();

const {
    authenticateToken,
    requireVendor
} = require("../middleware/authMiddleware");

const {
    getVendorOrders,
    getVendorOrderById,
    updateVendorOrderStatus
} = require("../controllers/vendorOrderController");

router.get(
    "/",
    authenticateToken,
    requireVendor,
    getVendorOrders
);

router.get(
    "/:id",
    authenticateToken,
    requireVendor,
    getVendorOrderById
);

router.patch(
    "/:id/status",
    authenticateToken,
    requireVendor,
    updateVendorOrderStatus
);
module.exports = router;