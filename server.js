require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const fs = require('fs');
const corsOptions = require("./config/corsOptions");
const cors = require("cors");
const credentials = require("./middleware/credentials");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { logger, errorLogger } = require("./middleware/logEvents");
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
const connectDB = require("./config/dbConfig");
const seedData = require("./extensions/seedData");

connectDB();

app.use(errorLogger);
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
app.use("/api/authentication", require("./routes/authenticationRouter"));
app.use("/api/post", require("./routes/postRouter"));
app.use("/api/status", require("./routes/statusRouter"));
app.use("/api/service", require("./routes/serviceRouter"));
app.use("/api/project", require("./routes/projectRouter"));
app.use("/api/design", require("./routes/designRouter"));
app.use("/api/resume", require("./routes/resumeRouter"));
app.get("/", (req, res, next) => res.json({ "message": "There is nothing for you kiddo!" }));

mongoose.connection.once("open", async () => {
    console.log("Connected to MongoDB");
    if (!fs.existsSync(path.join("public"))) {
        fs.mkdirSync(path.join("public"), { recursive: true });
    }
    if (!fs.existsSync(path.join("public", "temp"))) {
        fs.mkdirSync(path.join("public", "temp"), { recursive: true });
    }
    await seedData();
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });
});