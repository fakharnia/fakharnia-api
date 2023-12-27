const express = require("express");
const router = express.Router();
const { uploadAvatar } = require("../middleware/multer");

const { getStatus, updateStatus } = require("../controllers/statusController");

router.get("/getStatus", getStatus);
router.post("/updateStatus", uploadAvatar.single("avatar"), updateStatus);

module.exports = router;