const express = require("express");
const router = express.Router();

const { uploadProject } = require("../middleware/multer");
const { getProjects, getProject, createProject, updateProject, deleteProject } = require("../controllers/projectController");

router.get("/getProjects", getProjects);
router.get("/getProject/:projectId", getProject);
router.post("/createProject", uploadProject.single("logo"), createProject);
router.post("/updateProject", uploadProject.single("logo"), updateProject);
router.post("/deleteProject/:projectId", uploadProject.single("logo"), deleteProject);

module.exports = router;
