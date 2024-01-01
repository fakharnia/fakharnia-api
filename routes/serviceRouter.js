const express = require("express");
const router = express.Router();

const { getServices, getService, createService, updateService, deleteService } = require("../controllers/serviceController");

router.get("/getServices", getServices);
router.get("/getService/:serviceId", getService);
router.post("/createService", createService);
router.post("/updateService", updateService);
router.post("/deleteService/:serviceId", deleteService);

module.exports = router;