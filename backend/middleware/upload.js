const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ========================================
// UPLOAD DIRECTORY
// ========================================

const uploadDirectory = path.resolve(
    __dirname,
    "..",
    "uploads",
    "products"
);


// ========================================
// MAKE SURE DIRECTORY EXISTS
// ========================================

function ensureUploadDirectory() {

    if (!fs.existsSync(uploadDirectory)) {

        fs.mkdirSync(
            uploadDirectory,
            {
                recursive: true
            }
        );

    }

}


// Create it when server starts
ensureUploadDirectory();


// ========================================
// MULTER STORAGE
// ========================================

const storage = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {

        try {

            // Make absolutely sure
            // folder exists before writing

            ensureUploadDirectory();


            console.log(
                "Saving image to:",
                uploadDirectory
            );


            cb(
                null,
                uploadDirectory
            );


        } catch (error) {

            console.error(
                "Upload directory error:",
                error
            );


            cb(
                error
            );

        }

    },


    filename: function (
        req,
        file,
        cb
    ) {

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();


        const uniqueName =
            `product-${Date.now()}-${Math.round(
                Math.random() * 1E9
            )}${extension}`;


        cb(
            null,
            uniqueName
        );

    }

});


// ========================================
// FILE FILTER
// ========================================

const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only JPG, PNG and WebP images are allowed."
            )
        );

    }

};


// ========================================
// MULTER
// ========================================

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize:
            5 * 1024 * 1024

    }

});


module.exports = upload;