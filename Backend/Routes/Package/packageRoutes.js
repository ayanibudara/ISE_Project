const express = require("express");
const { 
    deletePackage, 
    getAllPackages, 
    getPackage, 
    savePackage, 
    updatePackage 
} = require("../../Controllers/Package/packageController.js");
const { authorizeRoles } = require("../../Middleware/authMiddleware.js");
const multer = require("multer");
const { deleteAllPackages } = require("../../Services/package.service.js");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
router.get("/all", getAllPackages); // Get All
router.post(
    //protect,
    "/save", 
    authorizeRoles("admin"), 
    upload.single("image"), 
    savePackage
); // Save
router.get("/:id", getPackage);
router.put("/update/:id", authorizeRoles("admin"), updatePackage);
router.delete("/delete/:id", authorizeRoles("admin"), deletePackage);
router.delete("/delete-all", authorizeRoles("admin"), async (req, res) => {
    try {
        await deleteAllPackages(); // Call the service to delete all packages
        res.status(200).json({ message: "All packages deleted successfully." });
    } catch (error) {
        console.error("Error deleting all packages:", error);
        res.status(500).json({ message: "Error deleting all packages", error });
    }
});

module.exports = router;
