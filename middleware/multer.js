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
            try {
                let id = new mongoose.Types.ObjectId();
                const filename = `${id}${path.extname(file.originalname)}`;

                const uploadPath = path.join("public", folderName, filename);

                while (fs.existsSync(uploadPath)) {
                    id = new mongoose.Types.ObjectId();
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
                    case "design":
                        const imagesString = req.body.imagesData;
                        if (imagesString) {
                            const image = JSON.parse(imagesString);
                            const foundedImage = image.findIndex(img => img.fileUrl === file.originalname);
                            if (foundedImage != -1) {
                                image[foundedImage].fileUrl = filename;
                                req.body.imagesData = JSON.stringify(image);
                            }
                        }
                        break;
                }
                cb(null, filename);
            } catch (error) {
                console.log(error);
            }
        }
    });
};

module.exports = {
    uploadAvatar: multer({ storage: getStorage("avatar") }),
    uploadService: multer({ storage: getStorage("service") }),
    uploadProject: multer({ storage: getStorage("project") }),
    uploadDesign: multer({ storage: getStorage("design") }),
};
