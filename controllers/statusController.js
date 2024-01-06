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

        const model = objectValidation(fields);

        const result = await uploadFileSync(files, "avatar", "avatar");
        if (result != undefined && model._id) {

            //  remove old avatar file
            const status = await Status.findById(model._id);
            if (status && status?.avatarUrl) {
                await removeFileSync(path.join("public", "avatar", status.avatarUrl));
            }
        }
        model.avatarUrl = result;

        if (model._id) {
            if (model.deleteAvatar) {
                const directoryPath = path.join("public", "avatar");
                await removeFilesSync(directoryPath);
                model.avatarUrl = null;
            }
            await Status.findOneAndUpdate(
                { _id: model._id },
                {
                    $set: {
                        fa_text: model.fa_text,
                        en_text: model.en_text,
                        deu_text: model.deu_text,
                        fa_status: model.fa_status,
                        en_status: model.en_status,
                        deu_status: model.deu_status,
                        state: model.state,
                        hasAvatar: (model.deleteAvatar && !req.file) ? false : true,
                        avatarUrl: model.avatarUrl
                    }
                },
                { new: true }
            );
        } else {
            model._id = await Status.create({
                fa_text: model.fa_text,
                en_text: model.en_text,
                deu_text: model.deu_text,
                fa_status: model.fa_status,
                en_status: model.en_status,
                deu_status: model.deu_status,
                state: model.state,
                hasAvatar: (model.deleteAvatar && !req.file) ? false : true,
                avatarUrl: (model.deleteAvatar && !req.file) ? null : model.avatarUrl
            });
        }

        return res.status(200).json({ "message": "Successful!" });
    } catch (error) {
        return res.status(500).json({ "error": error });
    }
}

module.exports = { getStatus, updateStatus };
