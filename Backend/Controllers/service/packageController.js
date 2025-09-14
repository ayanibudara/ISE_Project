const Package = require('../../Models/Services/packageModel.js');

// ===============================
// Main Package CRUD
// ===============================

// Create a new package
exports.createPackage = async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get package by ID
exports.getPackageById = async (req, res) => {
  try {
    const { packageId } = req.params;
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update package by ID
exports.updatePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPackage) return res.status(404).json({ error: "Package not found" });
    res.json(updatedPackage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete package by ID
exports.deletePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const deletedPackage = await Package.findByIdAndDelete(packageId);
    if (!deletedPackage) return res.status(404).json({ error: "Package not found" });
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get packages by category (and optionally province)
exports.getPackagesByCategory = async (req, res) => {
  try {
    const { category, province } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (province) filter.province = province;

    const packages = await Package.find(filter);
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// Sub-Package CRUD (Standard / Premium / VIP inside packages[])
// ===============================

// Get a single sub-package (tier) from a package
exports.getSubPackage = async (req, res) => {
  try {
    const { packageId, type } = req.params; // type = Standard | Premium | VIP
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    const subPkg = pkg.packages.find(p => p.packageType === type);
    if (!subPkg) return res.status(404).json({ error: `${type} sub-package not found` });

    res.json(subPkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a sub-package (tier) inside a package
exports.updateSubPackage = async (req, res) => {
  try {
    const { packageId, type } = req.params;
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    const subPkg = pkg.packages.find(p => p.packageType === type);
    if (!subPkg) return res.status(404).json({ error: `${type} sub-package not found` });

    // Update only fields provided
    if (req.body.price !== undefined) subPkg.price = req.body.price;
    if (req.body.tourDays !== undefined) subPkg.tourDays = req.body.tourDays;
    if (req.body.services !== undefined) subPkg.services = req.body.services;

    await pkg.save();
    res.json(subPkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a sub-package (tier) from a package
exports.deleteSubPackage = async (req, res) => {
  try {
    const { packageId, type } = req.params;
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ error: "Package not found" });

    const initialLength = pkg.packages.length;
    pkg.packages = pkg.packages.filter(p => p.packageType !== type);

    if (pkg.packages.length === initialLength) {
      return res.status(404).json({ error: `${type} sub-package not found` });
    }

    await pkg.save();
    res.json({ message: `${type} sub-package deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
