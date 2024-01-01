const path = require("path");
const formidable = require('formidable');
const Status = require("../model/Status");
const { uploadFileSync, removeFilesSync, removeFileSync } = require("../extensions/uploadExtensions");
const { objectValidation } = require("../extensions/objectValidation");

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
        const form = new formidable.IncomingForm({
            uploadDir: path.join("public", "temp"),
        });
        const [fields, files] = await form.parse(req);

        const result = await uploadFileSync(files, "avatar", "avatar");
        const model = objectValidation(fields);
        if (result != undefined) {
            //  remove old avatar file
            const status = await Status.findById(model._id);
            if (status && status?.avatarUrl) {
                await removeFileSync(path.join("public", "avatar", status.avatarUrl));
            }
            model.avatarUrl = result;
        }

        if (model._id) {
            if (model.deleteAvatar) {
                const directoryPath = path.join("public", "avatar");
                await removeFilesSync(directoryPath);
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
            model._id = await Status.create({
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
