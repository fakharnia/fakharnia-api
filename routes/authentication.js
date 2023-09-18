const express = require("express");
const { login } = require("../controllers/authentication");
const router = express.Router();

module.exports = router.post("/authentication/login", login);