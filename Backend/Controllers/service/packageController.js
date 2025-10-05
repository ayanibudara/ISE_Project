const Package = require('../../Models/Services/packageModel.js');

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
    // Make sure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find packages related to the logged-in provider
    const packages = await Package.find({ providerId: req.user.id });

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
    const updatedPackage = await Package.findByIdAndUpdate(packageId, req.body, { new: true });
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

// Get packages by category (optional: filter by province too)
exports.getPackagesByCategory = async (req, res) => {
  try {
    const { category, province } = req.query;
    const filter = { category };
    if (province) filter.province = province;

    const packages = await Package.find(filter);
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
