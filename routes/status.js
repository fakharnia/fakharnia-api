const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");


const { getStatus, updateStatus } = require("../controllers/status");

router.get("/getStatus", getStatus);
router.post("/updateStatus", upload.single("avatar"), updateStatus);


module.exports = router;