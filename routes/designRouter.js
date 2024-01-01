const express = require("express");
const router = express.Router();

const { getDesigns, getDesign, createDesign, updateDesign, deleteDesign } = require("../controllers/designController");

router.get("/getDesigns", getDesigns);
router.get("/getDesign/:designId", getDesign);
router.post("/createDesign", createDesign);
router.post("/updateDesign", updateDesign);
router.post("/deleteDesign/:designId", deleteDesign);

module.exports = router;