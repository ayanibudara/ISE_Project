const express = require("express");
const multer = require("multer");
const {
  saveCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../../Controllers/Package/categoryController.js");
const { authorizeRoles } = require("../../Middleware/authMiddleware");
const { deleteAllCategories } = require("../../Services/category.service");

const categoryRouter = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
categoryRouter.get("/all", getAllCategories);
categoryRouter.post("/save", authorizeRoles("admin"), upload.single("image"), saveCategory);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/update/:id", authorizeRoles("admin"), upload.single("image"), updateCategory);
categoryRouter.delete("/delete/:id", authorizeRoles("admin"), deleteCategory);
categoryRouter.delete("/delete-all", authorizeRoles("admin"), async (req, res) => {
  try {
    await deleteAllCategories();
    res.status(200).json({ message: "All categories deleted successfully." });
  } catch (error) {
    console.error("Error deleting all categories:", error);
    res.status(500).json({ message: "Error deleting all categories", error });
  }
});

module.exports = categoryRouter;
