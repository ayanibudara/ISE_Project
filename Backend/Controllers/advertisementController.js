const Advertisement = require("../Models/advertisementModel");
const path = require("path");
const fs = require("fs");

// Create a new advertisement
const createAdvertisement = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const advertisement = new Advertisement({
      title: title || "Advertisement",
      image: req.file.filename,
      createdBy: req.user.id,
    });

    await advertisement.save();

    res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      data: advertisement,
    });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Error creating advertisement",
      error: error.message,
    });
  }
};

// Get all advertisements
const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Advertisements retrieved successfully",
      data: advertisements,
    });
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching advertisements",
      error: error.message,
    });
  }
};

// Get active advertisements (for public display)
const getActiveAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Active advertisements retrieved successfully",
      data: advertisements,
    });
  } catch (error) {
    console.error("Error fetching active advertisements:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching active advertisements",
      error: error.message,
    });
  }
};

// Update advertisement
const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isActive } = req.body;

    const updateData = {
      title,
      isActive,
      updatedAt: Date.now(),
    };

    // If new image is uploaded, update the image field
    if (req.file) {
      const advertisement = await Advertisement.findById(id);
      if (advertisement && advertisement.image) {
        // Delete old image file
        const oldImagePath = path.join(
          __dirname,
          "../uploads",
          advertisement.image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = req.file.filename;
    }

    const advertisement = await Advertisement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement updated successfully",
      data: advertisement,
    });
  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Error updating advertisement",
      error: error.message,
    });
  }
};

// Delete advertisement
const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisement.findById(id);
    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    // Delete image file
    if (advertisement.image) {
      const imagePath = path.join(__dirname, "../uploads", advertisement.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Advertisement.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting advertisement",
      error: error.message,
    });
  }
};

module.exports = {
  createAdvertisement,
  getAllAdvertisements,
  getActiveAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
};
