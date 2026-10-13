const express = require("express");

const router = express.Router();
const {
    getPublicShops,
    getPublicShop,
    getPublicProduct
} = require("../controllers/publicController");

router.get(
    "/shops",
    getPublicShops
);
router.get(
    "/shops/:id",
    getPublicShop
);

router.get(
    "/products/:id",
    getPublicProduct
);
module.exports = router;