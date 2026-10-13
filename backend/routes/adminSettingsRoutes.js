const express = require("express");

const router = express.Router();


// ========================================
// CONTROLLER
// ========================================

const {
    getAdminSettings,
    updateAdminSettings,
    changeAdminPassword
} = require("../controllers/adminSettingsController");


// ========================================
// AUTH MIDDLEWARE
// ========================================

const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");


// ========================================
// GET ADMIN SETTINGS
// GET /api/admin/settings
// ========================================

router.get(
    "/",
    authenticateToken,
    requireAdmin,
    getAdminSettings
);


// ========================================
// UPDATE ADMIN PROFILE
// PUT /api/admin/settings
// ========================================

router.put(
    "/",
    authenticateToken,
    requireAdmin,
    updateAdminSettings
);


// ========================================
// CHANGE ADMIN PASSWORD
// PUT /api/admin/settings/password
// ========================================

router.put(
    "/password",
    authenticateToken,
    requireAdmin,
    changeAdminPassword
);


// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;