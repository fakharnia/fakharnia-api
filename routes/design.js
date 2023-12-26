const express = require("express");
const router = express.Router();
const { uploadDesign } = require("../middleware/multer");


const { getDesigns, getDesign, createDesign, updateDesign, deleteDesign } = require("../controllers/design");

router.get("/getDesigns", getDesigns);
router.get("/getDesign/:designId", getDesign);
router.post("/createDesign", uploadDesign.array("images"), createDesign);
router.post("/updateDesign", uploadDesign.array("images"), updateDesign);
router.post("/deleteDesign/:designId", deleteDesign);

module.exports = router;