// Controller/Package/packageController.js
const packageService = require('../../Services/package.service');
const { sendEmail } = require('../../utils/email.util');
const { getAdminEmails } = require('../../utils/user.util');

// Get all packages
const getAllPackages = async (req, res) => {
    try {
        const packages = await packageService.getAllPackages();
        console.log("Retrieved packages:", packages);
        res.status(200).json(packages);
    } catch (error) {
        console.log('Error retrieving packages:', error);
        res.status(500).json({ message: 'Error retrieving packages', error });
    }
};

// Save a package
const savePackage = async (req, res) => {
    try {
        const { name, price, currency, description, category, image } = req.body;

        if (!name || !price || !currency || !description || !category || !image) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const id = await packageService.generateUniqueId();
        const newPackage = { id, name, price, currency, description, category, image };

        const savedPackage = await packageService.savePackage(newPackage);

        const adminEmails = await getAdminEmails();
        await sendEmail(
            adminEmails.join(','),
            "New Package Added",
            `A new package "${name}" has been added.`,
            `<p>A new package "<strong>${name}</strong>" has been added with a price of ${price} ${currency}.</p>`
        );

        return res.status(201).json(savedPackage);
    } catch (error) {
        console.error("Error saving package:", error);
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
};

// Get single package
const getPackage = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: 'Package ID is required' });
        }

        const packageId = parseInt(id);
        if (isNaN(packageId)) {
            return res.status(400).json({ error: 'Invalid package ID' });
        }

        const pkg = await packageService.getPackageById(packageId);
        if (!pkg) {
            return res.status(404).json({ error: 'Package not found' });
        }

        return res.status(200).json(pkg);
    } catch (error) {
        console.error("Error getting package:", error);
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
};

// Update a package
const updatePackage = async (req, res) => {
    try {
        console.log("Update package request body:", req.body);

        const { id, ...updateData } = req.body;

        if (!/^PKG\d+$/.test(id)) {
            return res.status(400).json({ error: "Invalid package ID format." });
        }

        const updatedPackage = await packageService.updatePackage(id, updateData);
        if (!updatedPackage) {
            return res.status(404).json({ error: "Package not found." });
        }

        const adminEmails = await getAdminEmails();
        await sendEmail(
            adminEmails.join(','),
            "Package Updated",
            `The package "${updatedPackage.name}" has been updated.`,
            `<p>The package "<strong>${updatedPackage.name}</strong>" has been updated with new details.</p>`
        );

        res.status(200).json(updatedPackage);
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a package
const deletePackage = async (req, res) => {
    const packageId = req.params.id;

    if (!packageId) {
        return res.status(400).json({ error: "Package ID is required" });
    }

    try {
        const deletedPackage = await packageService.deletePackage(packageId);
        if (!deletedPackage) {
            return res.status(404).json({ error: "Package not found" });
        }

        const adminEmails = await getAdminEmails();
        await sendEmail(
            adminEmails.join(','),
            "Package Deleted",
            `The package with ID "${packageId}" has been deleted.`,
            `<p>The package with ID "<strong>${packageId}</strong>" has been deleted from the inventory.</p>`
        );

        res.status(200).json({ message: "Package deleted successfully" });
    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ message: "Error deleting package", error });
    }
};

module.exports = {
    getAllPackages,
    savePackage,
    getPackage,
    updatePackage,
    deletePackage
};
