const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "marketplace",
        allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp"],
        resource_type: file.mimetype === "application/pdf" ? "raw" : "image",
        // Use a unique public_id so filenames are stable
        public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-").replace(/[^\w.-]/g, "")}`,
    }),
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only images (jpg, png, webp) and PDFs are allowed"), false);
        }
    },
});

module.exports = upload;
module.exports.cloudinary = cloudinary;