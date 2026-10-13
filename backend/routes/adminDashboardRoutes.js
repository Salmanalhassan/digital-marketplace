const express = require("express");

const router = express.Router();


const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");


const {
    getAdminDashboardStats
} = require("../controllers/adminDashboardController");


// ========================================
// ADMIN DASHBOARD STATISTICS
// ========================================

router.get(
    "/stats",
    authenticateToken,
    requireAdmin,
    getAdminDashboardStats
);


module.exports = router;

