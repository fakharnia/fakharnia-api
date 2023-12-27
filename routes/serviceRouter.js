const express = require("express");
const router = express.Router();
const { uploadService } = require("../middleware/multer");

const { getServices, getService, createService, updateService, deleteService } = require("../controllers/serviceController");

router.get("/getServices", getServices);
router.get("/getService/:serviceId", getService);
router.post("/createService", uploadService.single("cover"), createService);
router.post("/updateService", uploadService.single("cover"), updateService);
router.post("/deleteService/:serviceId", uploadService.single("cover"), deleteService);

module.exports = router;