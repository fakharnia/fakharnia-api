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
        if (model.title === null || model.title === undefined || model.title.length === 0) {
            result = false;
        }

        if (model.priority === null || model.priority === undefined || isNaN(model.priority)) {
            result = false;
        }

        if (model.content === null || model.content === undefined || model.content.length === 0) {
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
            const result = await uploadFileSync(files, "cover", "service");
            if (result != undefined) {
                model.coverUrl = result;
            }

            await Service.create({
                title: model.title,
                priority: model.priority,
                content: model.content,
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

        const result = await uploadFileSync(files, "cover", "service");
        if (result != undefined) {
            //  remove old avatar file
            const service = await Service.findById(model._id);
            if (service && service.coverUrl) {
                await removeFileSync(path.join("public", "service", service.coverUrl));
            }
            model.coverUrl = result;
        }
        if (serviceValidation(model)) {
            await Service.findOneAndUpdate(
                { _id: model._id },
                {
                    $set: {
                        title: model.title,
                        priority: model.priority,
                        content: model.content,
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
            await Service.deleteOne({ _id: serviceId });
            return res.status(200).json({ message: "Successfully deleted!" });
        }

        return res.status(500).json({ message: "Model validation failed!" });

    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = { getServices, getService, createService, updateService, deleteService };