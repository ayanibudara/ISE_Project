const express = require("express");
const router = express.Router();
const guideAssignController = require("../Controllers/guideAssignController");
const GuideAssign = require("../Models/guideAssignModel");

router.post("/", guideAssignController.createAssignment);
router.get("/", guideAssignController.getAssignments);
router.get("/:id", guideAssignController.getAssignmentById);
router.put("/:id", guideAssignController.updateAssignment);
router.delete("/:id", guideAssignController.deleteAssignment);

module.exports = router;
