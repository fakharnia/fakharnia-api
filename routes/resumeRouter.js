const express = require("express");
const router = express.Router();

const { getResume, updateResume } = require("../controllers/resumeController");

router.get("/getResume", getResume);
router.post("/updateResume", updateResume
);
module.exports = router;