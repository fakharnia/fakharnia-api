const multer = require("multer");
const path = require("path");
const fs = require('fs');

const getStorage = (folderName) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join("public", folderName);
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });
};

module.exports = {
    uploadAvatar: multer({ storage: getStorage("avatar") }),
    uploadService: multer({ storage: getStorage("service") }),
};