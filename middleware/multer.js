const multer = require("multer");
const path = require("path");
const fs = require('fs');
const mongoose = require('mongoose');

const getStorage = (folderName) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join("public", folderName);
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            let postId = req.body.postId || new mongoose.Types.ObjectId();
            const filename = `${postId}${path.extname(file.originalname)}`;

            const uploadPath = path.join("public", folderName, filename);

            while (fs.existsSync(uploadPath)) {
                postId = new mongoose.Types.ObjectId();
            }

            switch (folderName) {
                case "avatar":
                    req.body.avatarUrl = filename;
                    break;
                case "service":
                    req.body.coverUrl = filename;
                    break;
                case "project":
                    req.body.logoUrl = filename;
                    break;
            }
            cb(null, filename);
        },
    });
};

module.exports = {
    uploadAvatar: multer({ storage: getStorage("avatar") }),
    uploadService: multer({ storage: getStorage("service") }),
    uploadProject: multer({ storage: getStorage("project") }),
};