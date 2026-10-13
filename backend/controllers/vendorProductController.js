const db = require("../config/db");
const fs = require("fs");


// ========================================
// GET VENDOR PRODUCTS
// ========================================

const getVendorProducts = (req, res) => {

    const vendorId = req.user.id;


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
            p.updated_at
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

                console.error(
                    "Get vendor products error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            return res.json({

                success: true,

                products: results

            });

        }
    );

};

// ========================================
// GET SINGLE VENDOR PRODUCT
// ========================================

const getVendorProductById = (req, res) => {

    const vendorId = req.user.id;

    const productId =
        Number(req.params.id);


    // ========================================
    // VALIDATE PRODUCT ID
    // ========================================

    if (
        !Number.isInteger(productId) ||
        productId <= 0
    ) {

        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });

    }


    // ========================================
    // GET PRODUCT
    // ========================================

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
            p.updated_at
        FROM products p
        INNER JOIN shops s
            ON p.shop_id = s.id
        WHERE p.id = ?
        AND s.vendor_id = ?
        LIMIT 1
    `;


    db.query(
        sql,
        [
            productId,
            vendorId
        ],
        (err, results) => {

            if (err) {

                console.error(
                    "Get vendor product error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            // ========================================
            // PRODUCT NOT FOUND
            // ========================================

            if (
                results.length === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });

            }


            // ========================================
            // SUCCESS
            // ========================================

            return res.json({

                success: true,

                product:
                    results[0]

            });

        }
    );

};

// ========================================
// CREATE VENDOR PRODUCT
// ========================================

const createProduct = (req, res) => {

    const vendorId = req.user.id;


    const {
        name,
        description,
        price,
        category,
        stock,
        status
    } = req.body;


    // ========================================
    // VALIDATION
    // ========================================

    if (!name || !name.trim()) {

        removeUploadedFile(req.file);

        return res.status(400).json({
            success: false,
            message: "Product name is required"
        });

    }


    const productPrice =
        Number(price);


    const productStock =
        Number(stock);


    if (
        !Number.isFinite(productPrice) ||
        productPrice <= 0
    ) {

        removeUploadedFile(req.file);

        return res.status(400).json({
            success: false,
            message: "Valid product price is required"
        });

    }


    if (
        !Number.isInteger(productStock) ||
        productStock < 0
    ) {

        removeUploadedFile(req.file);

        return res.status(400).json({
            success: false,
            message: "Valid stock quantity is required"
        });

    }


    // ========================================
    // IMAGE REQUIRED
    // ========================================

    if (!req.file) {

        return res.status(400).json({
            success: false,
            message: "Product image is required"
        });

    }


    // ========================================
    // FIND VENDOR SHOP
    // ========================================

    const shopSql = `
        SELECT id
        FROM shops
        WHERE vendor_id = ?
        AND status = 'active'
        LIMIT 1
    `;


    db.query(
        shopSql,
        [vendorId],
        (shopError, shopResults) => {

            if (shopError) {

                console.error(
                    "Find vendor shop error:",
                    shopError
                );

                removeUploadedFile(req.file);

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            if (
                shopResults.length === 0
            ) {

                removeUploadedFile(req.file);

                return res.status(404).json({
                    success: false,
                    message: "Active shop not found"
                });

            }


            const shopId =
                shopResults[0].id;


            // ========================================
            // IMAGE PATH
            // ========================================

            const imagePath =
                `/uploads/products/${req.file.filename}`;


            // ========================================
            // PRODUCT STATUS
            // ========================================

            const productStatus =
                status === "inactive"
                    ? "inactive"
                    : "active";


            // ========================================
            // INSERT PRODUCT
            // ========================================

            const productSql = `
                INSERT INTO products
                (
                    shop_id,
                    name,
                    description,
                    price,
                    category,
                    image,
                    stock,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;


            db.query(
                productSql,
                [
                    shopId,
                    name.trim(),
                    description
                        ? description.trim()
                        : null,
                    productPrice,
                    category
                        ? category.trim()
                        : null,
                    imagePath,
                    productStock,
                    productStatus
                ],
                (productError, result) => {

                    if (productError) {

                        console.error(
                            "Create product error:",
                            productError
                        );

                        removeUploadedFile(
                            req.file
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "Failed to create product"
                        });

                    }


                    // ========================================
                    // SUCCESS
                    // ========================================

                    return res.status(201).json({

                        success: true,

                        message:
                            "Product created successfully",

                        product: {

                            id:
                                result.insertId,

                            shop_id:
                                shopId,

                            name:
                                name.trim(),

                            description:
                                description
                                    ? description.trim()
                                    : null,

                            price:
                                productPrice,

                            category:
                                category
                                    ? category.trim()
                                    : null,

                            image:
                                imagePath,

                            stock:
                                productStock,

                            status:
                                productStatus

                        }

                    });

                }
            );

        }
    );

};

// ========================================
// UPDATE VENDOR PRODUCT
// ========================================

const updateProduct = (req, res) => {

    const vendorId = req.user.id;
    const productId = req.params.id;

    const {
        name,
        description,
        price,
        category,
        stock,
        status
    } = req.body;


    // ========================================
    // VALIDATE PRODUCT ID
    // ========================================

    if (!productId || !Number.isInteger(Number(productId))) {

        removeUploadedFile(req.file);

        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });

    }


    // ========================================
    // VALIDATE PRODUCT NAME
    // ========================================

    if (!name || !name.trim()) {

        removeUploadedFile(req.file);

        return res.status(400).json({
            success: false,
            message: "Product name is required"
        });

    }


    // ========================================
    // VALIDATE PRICE
    // ========================================

    const productPrice = Number(price);

    if (
        !Number.isFinite(productPrice) ||
        productPrice <= 0
    ) {

        removeUploadedFile(req.file);

        return res.status(400).json({
            success: false,
            message: "Valid product price is required"
        });

    }


    // ========================================
    // VALIDATE STOCK
    // ========================================

    const productStock = Number(stock);

    if (
        !Number.isInteger(productStock) ||
        productStock < 0
    ) {

        removeUploadedFile(req.file);

        return res.status(400).json({
            success: false,
            message: "Valid stock quantity is required"
        });

    }


    // ========================================
    // VALIDATE STATUS
    // ========================================

    const productStatus =
        status === "inactive"
            ? "inactive"
            : "active";


    // ========================================
    // FIND PRODUCT BELONGING TO VENDOR
    // ========================================

    const productSql = `
        SELECT
            p.id,
            p.shop_id,
            p.image
        FROM products p
        INNER JOIN shops s
            ON p.shop_id = s.id
        WHERE p.id = ?
        AND s.vendor_id = ?
        LIMIT 1
    `;


    db.query(
        productSql,
        [productId, vendorId],
        (productError, productResults) => {

            if (productError) {

                console.error(
                    "Find product for update error:",
                    productError
                );

                removeUploadedFile(req.file);

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            // ========================================
            // PRODUCT NOT FOUND
            // ========================================

            if (
                productResults.length === 0
            ) {

                removeUploadedFile(req.file);

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });

            }


            const oldImage =
                productResults[0].image;


            // ========================================
            // IMAGE
            // ========================================

            let imagePath = oldImage;


            if (req.file) {

                imagePath =
                    `/uploads/products/${req.file.filename}`;

            }


            // ========================================
            // UPDATE PRODUCT
            // ========================================

            const updateSql = `
                UPDATE products
                SET
                    name = ?,
                    description = ?,
                    price = ?,
                    category = ?,
                    image = ?,
                    stock = ?,
                    status = ?
                WHERE id = ?
            `;


            db.query(
                updateSql,
                [
                    name.trim(),

                    description
                        ? description.trim()
                        : null,

                    productPrice,

                    category
                        ? category.trim()
                        : null,

                    imagePath,

                    productStock,

                    productStatus,

                    productId
                ],
                (updateError) => {

                    if (updateError) {

                        console.error(
                            "Update product error:",
                            updateError
                        );

                        removeUploadedFile(req.file);

                        return res.status(500).json({
                            success: false,
                            message:
                                "Failed to update product"
                        });

                    }


                    // ========================================
                    // DELETE OLD IMAGE
                    // ========================================

                    if (
                        req.file &&
                        oldImage &&
                        oldImage.startsWith(
                            "/uploads/products/"
                        )
                    ) {

                        const oldImagePath =
                            require("path").join(
                                __dirname,
                                "..",
                                oldImage
                            );


                        fs.unlink(
                            oldImagePath,
                            (imageError) => {

                                if (imageError) {

                                    console.error(
                                        "Failed to remove old image:",
                                        imageError.message
                                    );

                                }

                            }
                        );

                    }


                    // ========================================
                    // SUCCESS
                    // ========================================

                    return res.json({

                        success: true,

                        message:
                            "Product updated successfully",

                        product: {

                            id:
                                Number(productId),

                            name:
                                name.trim(),

                            description:
                                description
                                    ? description.trim()
                                    : null,

                            price:
                                productPrice,

                            category:
                                category
                                    ? category.trim()
                                    : null,

                            image:
                                imagePath,

                            stock:
                                productStock,

                            status:
                                productStatus

                        }

                    });

                }
            );

        }
    );

};



// ========================================
// DELETE VENDOR PRODUCT
// ========================================

const deleteProduct = (req, res) => {

    const vendorId = req.user.id;

    const productId =
        Number(req.params.id);


    // ========================================
    // VALIDATE PRODUCT ID
    // ========================================

    if (
        !Number.isInteger(productId) ||
        productId <= 0
    ) {

        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });

    }


    // ========================================
    // FIND PRODUCT BELONGING TO VENDOR
    // ========================================

    const findProductSql = `
        SELECT
            p.id,
            p.image
        FROM products p
        INNER JOIN shops s
            ON p.shop_id = s.id
        WHERE p.id = ?
        AND s.vendor_id = ?
        LIMIT 1
    `;


    db.query(
        findProductSql,
        [
            productId,
            vendorId
        ],
        (findError, results) => {

            if (findError) {

                console.error(
                    "Find product for delete error:",
                    findError
                );

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            // ========================================
            // PRODUCT NOT FOUND
            // ========================================

            if (
                results.length === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });

            }


            const product =
                results[0];

            const oldImage =
                product.image;


            // ========================================
            // DELETE PRODUCT
            // ========================================

            const deleteSql = `
                DELETE FROM products
                WHERE id = ?
            `;


            db.query(
                deleteSql,
                [productId],
                (deleteError) => {

                    if (deleteError) {

                        console.error(
                            "Delete product error:",
                            deleteError
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "Failed to delete product"
                        });

                    }


                    // ========================================
                    // DELETE PRODUCT IMAGE
                    // ========================================

                    if (
                        oldImage &&
                        oldImage.startsWith(
                            "/uploads/products/"
                        )
                    ) {

                        const imagePath =
                            require("path").join(
                                __dirname,
                                "..",
                                oldImage
                            );


                        fs.unlink(
                            imagePath,
                            (imageError) => {

                                if (
                                    imageError &&
                                    imageError.code !== "ENOENT"
                                ) {

                                    console.error(
                                        "Failed to remove product image:",
                                        imageError.message
                                    );

                                }

                            }
                        );

                    }


                    // ========================================
                    // SUCCESS
                    // ========================================

                    return res.json({

                        success: true,

                        message:
                            "Product deleted successfully"

                    });

                }
            );

        }
    );

};
// ========================================
// REMOVE UPLOADED FILE
// ========================================

function removeUploadedFile(file) {

    if (!file || !file.path) {
        return;
    }


    fs.unlink(
        file.path,
        (error) => {

            if (error) {

                console.error(
                    "Failed to remove uploaded file:",
                    error.message
                );

            }

        }
    );

}


// ========================================
// EXPORT
// ========================================
// EXPORT
// ========================================

module.exports = {

    getVendorProducts,

    getVendorProductById,

    createProduct,

    updateProduct,

    deleteProduct

};