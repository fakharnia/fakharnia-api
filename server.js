require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();

const corsOptions = require("./config/corsOptions");
const cors = require("cors");
const credentials = require("./middleware/credentials");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/logEvents");
const rateLimit = require('express-rate-limit');
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
const connectDB = require("./config/dbConfig");

connectDB();

app.use(logger);
app.use(helmet({ hsts: { maxAge: 31536000, includeSubDomains: true } }));
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/resources", express.static(path.join(__dirname, "/public")));

app.get("/", (req, res, next) => res.json({ "message": "There is nothing for you kiddo!" }));

const limiter = rateLimit({
    windowMs: 2000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
});

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });
})