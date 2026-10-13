const express = require("express");

const router = express.Router();

const {
    authenticateToken,
    requireAdmin
} = require("../middleware/authMiddleware");

router.get(
    "/dashboard",
    authenticateToken,
    requireAdmin,
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome to Admin Dashboard",
            user: req.user
        });
    }
);

module.exports = router;