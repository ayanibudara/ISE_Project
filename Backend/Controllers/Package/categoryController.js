const categoryService = require('../../Services/category.service');
const { sendEmail } = require("../../utils/email.util");
const { getAdminEmails } = require("../../utils/user.util");

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.log('Error retrieving categories:', error);
        res.status(500).json({ message: 'Error retrieving categories', error });
    }
};

// Save a category
const saveCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name || !description || !image) {
            return res.status(400).json({ error: "Name, description, and image URL are required" });
        }

        const id = await categoryService.generateUniqueId();
        const category = { id, name, description, image };
        const savedCategory = await categoryService.saveCategory(category);

        const adminEmails = await getAdminEmails();
        await sendEmail(
            adminEmails.join(','),
            "New Category Added",
            `A new category "${name}" has been added.`,
            `<p>A new category "<strong>${name}</strong>" has been added.</p>`
        );

        res.status(201).json(savedCategory);
    } catch (error) {
        console.error("Error saving category:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    const categoryId = req.params.id;
    if (isNaN(Number(categoryId))) {
        res.status(400).json({ error: 'Invalid category ID' });
        return;
    }
    try {
        const category = await categoryService.getCategoryById(categoryId);
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }
        res.status(200).json(category);
    } catch (error) {
        console.log('Error retrieving category:', error);
        res.status(500).json({ message: 'Error retrieving category', error });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id, name, description, image } = req.body;

        if (!id || !name || !description) {
            return res.status(400).json({ error: "ID, name, and description are required" });
        }

        const updatedData = { name, description };
        if (image) updatedData.image = image;

        const updatedCategory = await categoryService.updateCategory(id, updatedData);

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        const adminEmails = await getAdminEmails();
        await sendEmail(
            adminEmails.join(','),
            "Category Updated",
            `The category "${name}" has been updated.`,
            `<p>The category "<strong>${name}</strong>" has been updated.</p>`
        );

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;

    if (!categoryId) {
        res.status(400).json({ error: "Category ID is required" });
        return;
    }

    try {
        const deletedCategory = await categoryService.deleteCategory(categoryId);
        if (!deletedCategory) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        const adminEmails = await getAdminEmails();
        await sendEmail(
            adminEmails.join(','),
            "Category Deleted",
            `A category with ID "${categoryId}" has been deleted.`,
            `<p>A category with ID "<strong>${categoryId}</strong>" has been deleted.</p>`
        );

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Error deleting category", error });
    }
};

module.exports = {
    getAllCategories,
    saveCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};
