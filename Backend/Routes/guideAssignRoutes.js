const express = require("express");
const router = express.Router();
const guideAssignController = require("../Controllers/guideAssignController");
const GuideAssign = require("../Models/guideAssignModel");

router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body); // log the data received

    const newAssign = new GuideAssign(req.body);
    const savedAssign = await newAssign.save();

    res.status(201).json(savedAssign);
  } catch (err) {
    console.error("❌ Error saving guide assignment:", err.message);
    res.status(500).json({ message: err.message });
  }
});
router.get("/", guideAssignController.getAssignments);
router.get("/:id", guideAssignController.getAssignmentById);
router.put("/:id", guideAssignController.updateAssignment);
router.delete("/:id", guideAssignController.deleteAssignment);

module.exports = router;
