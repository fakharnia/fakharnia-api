const express = require("express");
const { login } = require("../controllers/authenticationController");

const router = express.Router();

module.exports = router.post("/login", login);