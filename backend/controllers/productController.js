const db = require("../config/db");

const addProduct = (req, res) => {
    const vendorId = req.user.id;

    const {
        name,
        description,
        price,
        category,
        stock
    } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({
            success: false,
            message: "Product name and price are required"
        });
    }

    const getShopSql = `
        SELECT id
        FROM shops
        WHERE vendor_id = ?
        AND status = 'active'
        LIMIT 1
    `;

    db.query(
        getShopSql,
        [vendorId],
        (err, shopResults) => {

            if (err) {
                console.error("Get shop error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }

            if (shopResults.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Active shop not found"
                });
            }

            const shopId = shopResults[0].id;

            const insertSql = `
                INSERT INTO products
                (
                    shop_id,
                    name,
                    description,
                    price,
                    category,
                    stock
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [
                    shopId,
                    name,
                    description || null,
                    price,
                    category || null,
                    stock || 0
                ],
                (err, result) => {

                    if (err) {
                        console.error(
                            "Add product error:",
                            err
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Failed to add product"
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "Product added successfully",
                        product: {
                            id: result.insertId,
                            shop_id: shopId,
                            name,
                            description: description || null,
                            price,
                            category: category || null,
                            stock: stock || 0
                        }
                    });
                }
            );
        }
    );
};

const getMyProducts = (req, res) => {
    const vendorId = req.user.id;

    const sql = `
        SELECT
            p.id,
            p.shop_id,
            p.name,
            p.description,
            p.price,
            p.category,
            p.stock,
            p.status,
            p.created_at
        FROM products p
        INNER JOIN shops s
            ON p.shop_id = s.id
        WHERE s.vendor_id = ?
        ORDER BY p.created_at DESC
    `;

    db.query(
        sql,
        [vendorId],
        (err, results) => {

            if (err) {
                console.error("Get products error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }

            return res.json({
                success: true,
                count: results.length,
                products: results
            });
        }
    );
};

const updateProduct = (req, res) => {
    const vendorId = req.user.id;
    const productId = req.params.id;

    const {
        name,
        description,
        price,
        category,
        stock
    } = req.body;

    if (
        !name ||
        price === undefined ||
        stock === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Name, price and stock are required"
        });
    }

    const sql = `
        UPDATE products p
        INNER JOIN shops s
            ON p.shop_id = s.id
        SET
            p.name = ?,
            p.description = ?,
            p.price = ?,
            p.category = ?,
            p.stock = ?
        WHERE
            p.id = ?
            AND s.vendor_id = ?
    `;

    db.query(
        sql,
        [
            name,
            description || null,
            price,
            category || null,
            stock,
            productId,
            vendorId
        ],
        (err, result) => {

            if (err) {
                console.error("Update product error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update product"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found or access denied"
                });
            }

            return res.json({
                success: true,
                message: "Product updated successfully"
            });
        }
    );
};
const deleteProduct = (req, res) => {
    const vendorId = req.user.id;
    const productId = req.params.id;

    const sql = `
        UPDATE products p
        INNER JOIN shops s
            ON p.shop_id = s.id
        SET p.status = 'inactive'
        WHERE
            p.id = ?
            AND s.vendor_id = ?
    `;

    db.query(
        sql,
        [productId, vendorId],
        (err, result) => {

            if (err) {
                console.error("Delete product error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete product"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found or access denied"
                });
            }

            return res.json({
                success: true,
                message: "Product deleted successfully"
            });
        }
    );
};

const getPublicProduct = (req, res) => {
    const productId = req.params.id;

    if (!productId || isNaN(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }

    const sql = `
        SELECT
            p.id,
            p.shop_id,
            p.name,
            p.description,
            p.price,
            p.category,
            p.image,
            p.stock,
            p.status,
            p.created_at,

            s.name AS shop_name,
            s.description AS shop_description,
            s.category AS shop_category,
            s.logo AS shop_logo,
            s.whatsapp_number AS shop_whatsapp,

            v.id AS vendor_id,
            v.name AS vendor_name

        FROM products p

        INNER JOIN shops s
            ON p.shop_id = s.id

        INNER JOIN vendors v
            ON s.vendor_id = v.id

        WHERE
            p.id = ?
            AND p.status = 'active'
            AND s.status = 'active'

        LIMIT 1
    `;

    db.query(
        sql,
        [productId],
        (err, results) => {

            if (err) {
                console.error(
                    "Get public product error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.json({
                success: true,
                product: results[0]
            });
        }
    );
};
module.exports = {
    addProduct,
    getMyProducts,
    updateProduct,
    deleteProduct,
    getPublicProduct
};