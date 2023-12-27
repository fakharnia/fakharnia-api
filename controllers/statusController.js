const stringValidation = require("../extensions/objectValidation");
const path = require("path");
const fs = require("fs");
const Status = require("../model/Status");

const getStatus = async (req, res) => {
    try {
        const status = await Status.findOne();
        return res.status(200).json(status);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateStatus = async (req, res) => {
    try {
        const model = stringValidation(req.body);

        if (model._id) {
            if (model.deleteAvatar) {
                const directoryPath = path.join("public", "avatar");
                fs.readdir(directoryPath, (err, files) => {
                    if (err) {
                        console.error('Error reading directory:', err);
                        return;
                    }
                    files.forEach((file) => {
                        const filePath = path.join(directoryPath, file);

                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error('Error deleting file:', filePath, err);
                            } else {
                                console.log('Deleted file:', filePath);
                            }
                        });
                    });
                });
            }
            await Status.findOneAndUpdate(
                { _id: model._id },
                {
                    $set: {
                        dailyText: model.dailyText,
                        title: model.title,
                        state: model.state,
                        hasAvatar: (model.deleteAvatar && !req.file) ? false : true,
                        avatarUrl: model.avatarUrl
                    }
                },
                { new: true }
            );
        } else {
            await Status.create({
                dailyText: model.dailyText,
                title: model.title,
                state: model.state,
                hasAvatar: req.file ? true : false,
                avatarUrl: model.avatarUrl
            });
        }

        return res.status(200).json({ "message": "Successful!" });


    } catch (error) {
        return res.status(500).json({ "error": error });
    }
}

module.exports = { getStatus, updateStatus };

