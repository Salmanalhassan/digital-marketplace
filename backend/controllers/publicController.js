const db = require("../config/db");

const getPublicShops = (req, res) => {

    const sql = `
        SELECT
            s.id,
            s.name,
            s.description,
            s.category,
            s.logo,
            COUNT(
                CASE
                    WHEN p.status = 'active'
                    THEN p.id
                END
            ) AS product_count
        FROM shops s
        LEFT JOIN products p
            ON p.shop_id = s.id
        WHERE s.status = 'active'
        GROUP BY
            s.id,
            s.name,
            s.description,
            s.category,
            s.logo
        ORDER BY s.created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(
                "Get public shops error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }

        return res.json({
            success: true,
            shops: results
        });
    });
};

const getPublicShop = (req, res) => {
    const shopId = req.params.id;

    const shopSql = `
        SELECT
            id,
            name,
            description,
            category,
            logo,
            whatsapp_number
        FROM shops
        WHERE id = ?
        AND status = 'active'
        LIMIT 1
    `;

    db.query(
        shopSql,
        [shopId],
        (err, shopResults) => {

            if (err) {
                console.error("Get public shop error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }

            if (shopResults.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Shop not found"
                });
            }

            const shop = shopResults[0];

            const productsSql = `
                SELECT
                    id,
                    name,
                    description,
                    price,
                    category,
                    stock
                FROM products
                WHERE shop_id = ?
                AND status = 'active'
                AND stock > 0
                ORDER BY created_at DESC
            `;

            db.query(
                productsSql,
                [shopId],
                (err, products) => {

                    if (err) {
                        console.error(
                            "Get shop products error:",
                            err
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Server error"
                        });
                    }

                    return res.json({
                        success: true,
                        shop: {
                            ...shop,
                            products
                        }
                    });
                }
            );
        }
    );
};

const getPublicProduct = (req, res) => {
    const productId = req.params.id;

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
            s.name AS shop_name,
            s.id AS shop_id
        FROM products p
        INNER JOIN shops s
            ON p.shop_id = s.id
        WHERE
            p.id = ?
            AND p.status = 'active'
            AND p.stock > 0
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
    getPublicShops,
    getPublicShop,
    getPublicProduct
};