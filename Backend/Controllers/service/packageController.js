const Package = require('../../Models/Services/packageModel.js');
const Appointment = require('../../models/Appoiment/appointmentModel.js');

// Define valid booking statuses that should be counted
const VALID_BOOKING_STATUSES = ['booked', 'confirmed', 'completed'];

// Create a new package
exports.createPackage = async (req, res) => {
  try {
    console.log("📦 Received package data:", req.body);
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (err) {
    console.error("❌ Error creating package:", err.message);
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

// Get package by ID with booking count (overall + by tier)
exports.getPackageById = async (req, res) => {
  try {
    const { packageId } = req.params;

    // Find the package
    const pkg = await Package.findById(packageId).populate('providerId', 'name email');
    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Count total valid bookings (including confirmed!)
    const totalBookings = await Appointment.countDocuments({
      packageId: packageId,
      status: { $in: VALID_BOOKING_STATUSES }
    });

    // Count by tier
    const tierCounts = {};
    const tiers = ['Standard', 'Premium', 'VIP'];
    for (const tier of tiers) {
      tierCounts[tier] = await Appointment.countDocuments({
        packageId: packageId,
        selectedTier: tier,
        status: { $in: VALID_BOOKING_STATUSES }
      });
    }

    // Attach to response
    const pkgWithCount = pkg.toObject();
    pkgWithCount.bookingCount = totalBookings;
    pkgWithCount.tierBookingCounts = tierCounts;

    res.json(pkgWithCount);
  } catch (err) {
    console.error("Error fetching package with tier booking counts:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get packages by provider ID with booking counts
exports.getPackagesByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Fetch all packages for this provider
    const packages = await Package.find({ providerId });

    // Enhance each package with booking counts
    const packagesWithCounts = await Promise.all(
      packages.map(async (pkg) => {
        const pkgId = pkg._id;

        // Count total valid bookings
        const totalBookings = await Appointment.countDocuments({
          packageId: pkgId,
          status: { $in: VALID_BOOKING_STATUSES }
        });

        // Count by tier
        const tierCounts = {};
        const tiers = ['Standard', 'Premium', 'VIP'];
        for (const tier of tiers) {
          tierCounts[tier] = await Appointment.countDocuments({
            packageId: pkgId,
            selectedTier: tier,
            status: { $in: VALID_BOOKING_STATUSES }
          });
        }

        // Convert to plain object and attach counts
        const pkgObj = pkg.toObject();
        pkgObj.bookingCount = totalBookings;
        pkgObj.tierBookingCounts = tierCounts;

        return pkgObj;
      })
    );

    res.json(packagesWithCounts);
  } catch (err) {
    console.error("Error in getPackagesByProvider with counts:", err);
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
    console.log("Delete request by user:", req.user);
    const { packageId } = req.params;
    const deletedPackage = await Package.findByIdAndDelete(packageId);
    if (!deletedPackage) return res.status(404).json({ error: "Package not found" });
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
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