const GuideAssign = require("../Models/guideAssignModel");

// Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const { packageId, travellerName, guideId, startDate, endDate, paymentPerDay } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalPayment = totalDays * paymentPerDay;

    const newAssignment = new GuideAssign({
      packageId,
      travellerName,
      guideId,
      startDate,
      endDate,
      totalDays,
      paymentPerDay,
      totalPayment,
      status: "Assigned"
    });

    await newAssignment.save();
    res.status(201).json({ message: "Guide assigned successfully", assignment: newAssignment });
  } catch (err) {
    res.status(500).json({ error: "Failed to create assignment", details: err.message });
  }
};

// Get all assignments
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await GuideAssign.find()
      .populate("packageId", "packageName")
      .populate("guideId", "name");
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assignments", details: err.message });
  }
};

// Get one assignment
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await GuideAssign.findById(req.params.id)
      .populate("packageId", "packageName")
      .populate("guideId", "name");
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });
    res.status(200).json(assignment);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assignment", details: err.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { startDate, endDate, paymentPerDay } = req.body;

    let totalDays, totalPayment;
    if (startDate && endDate && paymentPerDay) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      totalPayment = totalDays * paymentPerDay;
    }

    const updatedAssignment = await GuideAssign.findByIdAndUpdate(
      req.params.id,
      { ...req.body, totalDays, totalPayment },
      { new: true }
    );

    if (!updatedAssignment) return res.status(404).json({ error: "Assignment not found" });
    res.status(200).json(updatedAssignment);
  } catch (err) {
    res.status(500).json({ error: "Failed to update assignment", details: err.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const deleted = await GuideAssign.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Assignment not found" });
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete assignment", details: err.message });
  }
};
