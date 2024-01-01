const express = require("express");
const router = express.Router();

const { getStatus, updateStatus } = require("../controllers/statusController");

router.get("/getStatus", getStatus);
router.post("/updateStatus", updateStatus);

module.exports = router;