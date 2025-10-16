const GuideAssign = require("../Models/guideAssignModel");



exports.createGuideAssign = async (req, res) => {
  try {
    console.log("📩 Incoming:", req.body);
// ✅ Validate required fields
    const { guideId, touristId, startDate, endDate, totalDays, paymentPerDay, totalPayment } = req.body;
    
    if (!guideId || !touristId || !startDate || !endDate) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields" 
      });
    }

    const newAssign = new GuideAssign(req.body);
    const savedAssign = await newAssign.save();

    // ✅ Populate before sending response
    await savedAssign.populate('guideId', 'firstName lastName email');
    await savedAssign.populate('touristId', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: savedAssign
    });
    } catch (err) {
    console.error("❌ Error saving:", err.message);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};



// Get all assignments
// Get all assignments - FIXED VERSION

exports.getAssignments = async (req, res) => {
  try {
    console.log("🟢 Fetching guide assignments...");
    
    const assignments = await GuideAssign.find()
      .populate({
        path: "guideId",
        select: "firstName lastName email",
        strictPopulate: false
      })
      .populate({
        path: "touristId", 
        select: "firstName lastName email",
        strictPopulate: false
      })
      .lean();

    console.log(`📋 Found ${assignments.length} assignments`);
    
    res.status(200).json(assignments || []);
    
  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    console.error("❌ ERROR STACK:", err.stack);
    
    res.status(500).json({ 
      error: "Failed to fetch assignments",
      message: err.message 
    });
  }
};
// Get one assignment
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await GuideAssign.findById(req.params.id)
     // .populate("packageId", "packageName")
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
