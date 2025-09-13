// Services/category.service.js

const { v4: uuidv4 } = require('uuid');
const Category = require('../Models/Package/categoryModels.js');

// Get all categories
const getAllCategories = async () => {
    const categories = await Category.find().lean();
    return categories.map(category => ({
        id: category.id || '',
        name: category.name,
        description: category.description,
        image: category.image,
    }));
};

// Save category
const saveCategory = async (category) => {
    const savedCategory = await Category.create(category);
    return {
        id: savedCategory.id || '',
        name: savedCategory.name,
        description: savedCategory.description,
        image: savedCategory.image || '',
    };
};

// Get category by id
const getCategoryById = async (id) => {
    const category = await Category.findOne({ id }).lean();
    if (!category) return null;
    return {
        id: category.id || '',
        name: category.name,
        description: category.description,
        image: category.image,
    };
};

// Update category
const updateCategory = async (id, data) => {
    const updatedCategory = await Category.findOneAndUpdate({ id }, data, { new: true }).lean();
    if (!updatedCategory) return null;
    return {
        id: updatedCategory.id || '',
        name: updatedCategory.name,
        description: updatedCategory.description,
        image: updatedCategory.image,
    };
};

// Delete category
const deleteCategory = async (id) => {
    try {
        const result = await Category.deleteOne({ id });
        return result.deletedCount > 0; // true if deleted
    } catch (error) {
        console.error("Error in deleteCategory service:", error);
        throw error;
    }
};

// Validate category
const validateCategory = (category) => {
    if (!category.id || !category.name || !category.description || !category.image) {
        return 'All fields are required';
    }
    return null;
};

// Generate unique ID
const generateUniqueId = async () => {
    let uniqueId;
    let isUnique = false;

    do {
        uniqueId = uuidv4();
        const existingCategory = await Category.findOne({ id: uniqueId });
        if (!existingCategory) {
            isUnique = true;
        }
    } while (!isUnique);

    return uniqueId;
};

// Delete all categories
const deleteAllCategories = async () => {
    try {
        const result = await Category.deleteMany({});
        console.log(`Deleted ${result.deletedCount} categories from the database.`);
    } catch (error) {
        console.error("Error deleting all categories:", error);
        throw error;
    }
};

module.exports = {
    getAllCategories,
    saveCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    validateCategory,
    generateUniqueId,
    deleteAllCategories
};
