const Package = require("../Models/Package/packageModels.js");
const mongoose = require("mongoose");
const Category = require("../Models/Package/packageModels.js"); // keep this if category stays same

// Get all packages
const getAllPackages = async () => {
    try {
        const packages = await Package.find({ id: { $regex: /^PACK/, $options: "i" } })
            .populate("category", "name")
            .lean();

        return packages.map(pkg => ({
            id: pkg.id || '',
            name: pkg.name || '',
            price: pkg.price || 0,
            currency: pkg.currency || '',
            image: pkg.image || '',
            description: pkg.description || '',
            category: (pkg.category)?.name || 'Unknown Category',
        }));
    } catch (error) {
        console.error("Error retrieving packages:", error);
        throw error;
    }
};

// Save a new package
const savePackage = async (pkg) => {
    try {
        console.log("Saving package:", pkg);

        const existingPackage = await Package.findOne({ id: pkg.id }).lean();
        if (existingPackage) {
            throw new Error(`Package with id "${pkg.id}" already exists`);
        }

        const category = mongoose.isValidObjectId(pkg.category)
            ? await Category.findById(pkg.category).lean()
            : await Category.findOne({ name: pkg.category }).lean();

        if (!category) {
            throw new Error(`Category "${pkg.category}" not found`);
        }

        const savedPackage = await Package.create({
            ...pkg,
            category: category._id,
        });

        return savedPackage;
    } catch (error) {
        console.error("Error saving package:", error);
        throw error;
    }
};

// Get package by ID
const getPackageById = async (id) => {
    const pkg = await Package.findOne({ id })
        .populate("category", "name")
        .lean();

    if (!pkg) return null;

    return {
        id: pkg.id || '',
        name: pkg.name,
        price: pkg.price,
        currency: pkg.currency,
        image: pkg.image,
        description: pkg.description || '',
        category: (pkg.category)?.name || '',
    };
};

// Update package
const updatePackage = async (packageId, packageData) => {
    try {
        const category = mongoose.isValidObjectId(packageData.category)
            ? packageData.category
            : await Category.findOne({ name: packageData.category }).lean();

        if (!category || typeof category === "string") {
            throw new Error(`Category "${packageData.category}" not found or invalid`);
        }

        const updatedPackage = await Package.findOneAndUpdate(
            { id: packageId },
            { ...packageData, category: category._id },
            { new: true }
        );

        if (!updatedPackage) {
            throw new Error(`Package with id "${packageId}" not found`);
        }

        return updatedPackage;
    } catch (error) {
        console.error("Error updating package:", error);
        throw error;
    }
};

// Delete one package
const deletePackage = async (id) => {
    try {
        const result = await Package.deleteOne({ id });
        return result.deletedCount > 0;
    } catch (error) {
        console.error("Error in deletePackage service:", error);
        throw error;
    }
};

// Validate package
const validatePackage = (pkg) => {
    if (!pkg.id || !pkg.name || !pkg.price || !pkg.currency || !pkg.image || !pkg.description) {
        return 'All fields are required';
    }
    return null;
};

// Generate unique package ID
const generateUniqueId = async () => {
    const packages = await Package.find({ id: { $regex: /^PACK\d+$/ } }).lean();

    let lastIdNumber = 0;

    if (packages.length > 0) {
        const numericIds = packages.map(pkg => {
            const numericPart = pkg.id.replace("PACK", "");
            return parseInt(numericPart, 10) || 0;
        });

        lastIdNumber = Math.max(...numericIds);
    }

    const newIdNumber = lastIdNumber + 1;
    return `PACK${newIdNumber}`;
};

// Delete all packages
const deleteAllPackages = async () => {
    try {
        const result = await Package.deleteMany({});
        console.log(`Deleted ${result.deletedCount} packages from the database.`);
    } catch (error) {
        console.error("Error deleting all packages:", error);
        throw error;
    }
};

module.exports = {
    getAllPackages,
    savePackage,
    getPackageById,
    updatePackage,
    deletePackage,
    validatePackage,
    generateUniqueId,
    deleteAllPackages
};
