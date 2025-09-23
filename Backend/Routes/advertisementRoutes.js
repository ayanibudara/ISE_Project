const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  createAdvertisement,
  getAllAdvertisements,
  getActiveAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
} = require("../Controllers/advertisementController");

// Multer configuration for advertisement images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "advertisement-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};

// Routes
router.post(
  "/",
  requireAuth,
  adminOnly,
  upload.single("image"),
  createAdvertisement
);
router.get("/", requireAuth, adminOnly, getAllAdvertisements);
router.get("/active", getActiveAdvertisements); // Public route for active advertisements
router.put(
  "/:id",
  requireAuth,
  adminOnly,
  upload.single("image"),
  updateAdvertisement
);
router.delete("/:id", requireAuth, adminOnly, deleteAdvertisement);

module.exports = router;
