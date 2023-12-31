const express = require("express");
const router = express.Router();
const { uploadResume } = require("../middleware/multer");

const { getResume, updateResume } = require("../controllers/resumeController");


router.get("/getResume", getResume);
router.post("/updateResume",
    uploadResume.fields([
        { name: "file", maxCount: 1 },
        { name: "avatar", maxCount: 1 },
        { name: "skillsFiles", maxCount: 30 },
        { name: "contactsFiles", maxCount: 30 },
    ]), updateResume
);
module.exports = router;