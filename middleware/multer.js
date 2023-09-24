const multer = require("multer");
const path = require("path");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(path.join("public", "avatar"), { recursive: true });
        cb(null, './public/avatar'); // Define the folder where uploaded files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;