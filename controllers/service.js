const stringValidation = require("../extensions/objectValidation");
const path = require("path");
const fs = require("fs");
const Service = require("../model/Service");

const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json(error);
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

        const model = stringValidation(req.body);

        await Service.create({
            title: model.title,
            priority: model.priority,
            content: model.content,
            coverUrl: model.coverUrl,
            coverAlt: model.coverAlt
        });

        return res.status(200).json({ message: "Successful" });
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateService = async (req, res) => {
    try {

        const model = stringValidation(req.body);

        if (model.coverChanged) {
            const currentData = await Service.findById(model._id);
            const filePath = path.join('public', 'service', currentData.coverUrl);
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.log(`Error deleting file: ${error}`);
                } else {
                    console.log(`file delete successfully!`);
                }
            })
        }

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
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getServices, getService, createService, updateService };