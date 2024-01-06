const path = require("path");
const formidable = require('formidable');
const Service = require("../model/Service");
const { removeFileSync, uploadFileSync } = require("../extensions/uploadExtensions");
const { objectValidation } = require("../extensions/objectValidation");

const serviceValidation = async (rawData) => {
    try {
        const model = rawData;
        let result = true;

        if (!model) {
            result = false;
        }
        if (model.fa_title === null || model.fa_title === undefined || model.fa_title.length === 0) {
            result = false;
        }
        if (model.en_title === null || model.en_title === undefined || model.en_title.length === 0) {
            result = false;
        }
        if (model.deu_title === null || model.deu_title === undefined || model.deu_title.length === 0) {
            result = false;
        }

        if (model.priority === null || model.priority === undefined || isNaN(model.priority)) {
            result = false;
        }

        if (model.fa_fileUrl === null || model.fa_fileUrl === undefined || model.fa_fileUrl.length === 0) {
            result = false;
        }
        if (model.en_fileUrl === null || model.en_fileUrl === undefined || model.en_fileUrl.length === 0) {
            result = false;
        }
        if (model.deu_fileUrl === null || model.deu_fileUrl === undefined || model.deu_fileUrl.length === 0) {
            result = false;
        }

        if (model.coverUrl === null || model.coverUrl === undefined || model.coverUrl.length === 0) {
            result = false;
        }

        return result;
    } catch (error) {
        return false;
    }
}

const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        return res.status(200).json(services);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const service = await Service.findById(serviceId);
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createService = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: path.join("public", "temp"),
        });
        const [fields, files] = await form.parse(req);
        const model = objectValidation(fields);

        if (serviceValidation(model)) {
            const coverResult = await uploadFileSync(files, "cover", "service");
            if (coverResult != undefined) {
                model.coverUrl = coverResult;
            }

            const fa_fileResult = await uploadFileSync(files, "fa_file", "service");
            if (fa_fileResult != undefined) {
                model.fa_fileUrl = fa_fileResult;
            }

            const en_fileResult = await uploadFileSync(files, "en_file", "service");
            if (en_fileResult != undefined) {
                model.en_fileUrl = en_fileResult;
            }
            const deu_fileResult = await uploadFileSync(files, "deu_file", "service");
            if (deu_fileResult != undefined) {
                model.deu_fileUrl = deu_fileResult;
            }


            await Service.create({
                fa_title: model.fa_title,
                en_title: model.en_title,
                deu_title: model.deu_title,
                priority: model.priority,
                fa_fileUrl: model.fa_fileUrl,
                en_fileUrl: model.en_fileUrl,
                deu_fileUrl: model.deu_fileUrl,
                coverUrl: model.coverUrl,
                coverAlt: model.coverAlt
            });

            return res.status(200).json({ message: "Successful" });
        }

        return res.status(500).json({ message: "Model validation failed!" });

    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateService = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: path.join("public", "temp"),
        });
        const [fields, files] = await form.parse(req);
        const model = objectValidation(fields);

        const coverResult = await uploadFileSync(files, "cover", "service");
        if (coverResult != undefined) {
            //  remove old avatar file
            const service = await Service.findById(model._id);
            if (service && service.coverUrl) {
                await removeFileSync(path.join("public", "service", service.coverUrl));
            }
            model.coverUrl = coverResult;
        }

        const fa_fileUrlResult = await uploadFileSync(files, "fa_file", "service");
        if (fa_fileUrlResult != undefined) {
            //  remove farsi file
            const service = await Service.findById(model._id);
            if (service && service.fa_fileUrl) {
                await removeFileSync(path.join("public", "service", service.fa_fileUrl));
            }
            model.fa_fileUrl = fa_fileUrlResult;
        }

        const en_fileUrlResult = await uploadFileSync(files, "en_file", "service");
        if (en_fileUrlResult != undefined) {
            //  remove farsi file
            const service = await Service.findById(model._id);
            if (service && service.en_fileUrl) {
                await removeFileSync(path.join("public", "service", service.en_fileUrl));
            }
            model.en_fileUrl = en_fileUrlResult;
        }

        const deu_fileUrlResult = await uploadFileSync(files, "deu_file", "service");
        if (deu_fileUrlResult != undefined) {
            //  remove farsi file
            const service = await Service.findById(model._id);
            if (service && service.deu_fileUrl) {
                await removeFileSync(path.join("public", "service", service.deu_fileUrl));
            }
            model.deu_fileUrl = deu_fileUrlResult;
        }

        if (serviceValidation(model)) {
            await Service.findOneAndUpdate(
                { _id: model._id },
                {
                    $set: {
                        fa_title: model.fa_title,
                        en_title: model.en_title,
                        deu_title: model.deu_title,
                        priority: model.priority,
                        fa_fileUrl: model.fa_fileUrl,
                        en_fileUrl: model.en_fileUrl,
                        deu_fileUrl: model.deu_fileUrl,
                        coverUrl: model.coverUrl,
                        coverAlt: model.coverAlt
                    }
                },
                { new: true }
            );

            return res.status(200).json({ message: "Successful" });
        }

        return res.status(500).json({ message: "Model validation failed!" });

    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        if (serviceId) {
            const service = await Service.findOne({ _id: serviceId });
            if (service.coverUrl) {
                const filePath = path.join('public', 'service', service.coverUrl);
                await removeFileSync(filePath);
            }
            if (service.fa_fileUrl) {
                const filePath = path.join('public', 'service', service.fa_fileUrl);
                await removeFileSync(filePath);
            }
            if (service.en_fileUrl) {
                const filePath = path.join('public', 'service', service.en_fileUrl);
                await removeFileSync(filePath);
            }
            if (service.deu_fileUrl) {
                const filePath = path.join('public', 'service', service.deu_fileUrl);
                await removeFileSync(filePath);
            }

            await Service.deleteOne({ _id: serviceId });
            return res.status(200).json({ message: "Successfully deleted!" });
        }

        return res.status(500).json({ message: "Model validation failed!" });

    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = { getServices, getService, createService, updateService, deleteService };