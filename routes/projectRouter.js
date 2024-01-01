const express = require("express");
const router = express.Router();

const { getProjects, getProject, createProject, updateProject, deleteProject } = require("../controllers/projectController");

router.get("/getProjects", getProjects);
router.get("/getProject/:projectId", getProject);
router.post("/createProject", createProject);
router.post("/updateProject", updateProject);
router.post("/deleteProject/:projectId", deleteProject);

module.exports = router;
