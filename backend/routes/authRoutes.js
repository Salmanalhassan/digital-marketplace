const express = require("express");
const router = express.Router();
const {
    adminLogin,
    vendorLogin
} = require("../controllers/authController");

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth route working"
    });
});

router.post("/admin/login", adminLogin);

router.post("/vendor/login", vendorLogin);
module.exports = router;