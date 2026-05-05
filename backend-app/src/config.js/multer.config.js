const multer = require("multer")
const path = require("path")

// configure where files will be stored
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")  // files go in uploads folder
    },
    filename: function (req, file, cb) {
        // unique filename: timestamp + sanitized original name
        const sanitizedName = file.originalname.replace(/\s+/g, '-').replace(/[^\w.-]/g, '');
        cb(null, Date.now() + "-" + sanitizedName)
    }
})

// filter — only allow images and PDFs
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only images and PDFs allowed"), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // 5MB max
})

module.exports = upload