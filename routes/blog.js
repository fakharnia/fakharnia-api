const express = require("express");
const router = express.Router();

const { getRecentPosts, getPost, deletePost } = require("../controllers/blog");

router.get("/getRecentPosts", getRecentPosts);
router.get("/getPost", getPost);
router.delete("/deletePost", deletePost);

module.exports = router;
