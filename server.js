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
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
const connectDB = require("./config/dbConfig");

connectDB();

app.use(logger);
app.use(helmet({
    crossOriginResourcePolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true }
}));
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use("/api/authentication", require("./routes/authentication"));
app.use("/api/blog", require("./routes/blog"));
app.use("/api/status", require("./routes/status"));
app.use("/api/service", require("./routes/service"));
app.use("/api/project", require("./routes/project"));
app.use("/api/design", require("./routes/design"));
app.get("/", (req, res, next) => res.json({ "message": "There is nothing for you kiddo!" }));

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });
});