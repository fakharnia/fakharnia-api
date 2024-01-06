const { objectValidation } = require("../extensions/objectValidation");
const path = require("path");
const fs = require("fs");
const formidable = require('formidable');
const { Design } = require("../model/Design");
const { removeFileSync, uploadFilesSync } = require("../extensions/uploadExtensions");

const designValidation = (rawData) => {
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

        if (model.description === null || model.description === undefined || model.description.length === 0) {
            result = false;
        }

        if (model.imagesData === null || model.imagesData === undefined || model.imagesData.length === 0) {
            result = false;
        }

        return result;
    } catch (error) {
        return false;
    }
}

const designImageValidation = (rawData) => {
    try {
        const model = rawData;
        let result = true;

        if (!model || model.length === 0) {
            result = false;
        }

        for (const prop of model) {
            if (prop.fileUrl === null || prop.fileUrl === undefined || prop.fileUrl.length === 0) {
                result = false;
            }

        }

        return result;
    } catch (error) {
        return false;
    }
}


const getDesigns = async (req, res) => {
    try {
        let designs = await Design.find();
        designs = designs.map(ds => {
            let cover;
            if (ds.images && ds.images.length > 0) {
                cover = ds.images?.filter(img => img.isCover);
                if (cover.length > 0) {
                    cover = cover[0]?.fileUrl
                } else {
                    cover = ds.images[0].fileUrl
                }
            } else {
                cover = ""
            }
            return {
                _id: ds._id,
                title: ds.title,
                priority: ds.priority,
                description: ds.description,
                coverUrl: cover,
                images: ds.images
            };
        })
        return res.status(200).json(designs);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getDesign = async (req, res) => {
    try {
        const { designId } = req.params;
        const design = await Design.findById(designId);
        return res.status(200).json(design);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const createDesign = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: path.join("public", "temp"),
        });
        const [fields, files] = await form.parse(req);
        const model = objectValidation(fields);

        if (designValidation(model) && designImageValidation(model.imagesData)) {

            for (let file of files.images) {
                const result = await uploadFilesSync(file, "design", "design");
                if (result != undefined) {
                    const foundedImage = model.imagesData.findIndex(img => img.fileUrl === file.originalFilename);
                    if (foundedImage != -1) {
                        model.imagesData[foundedImage].fileUrl = result;
                    }
                }
            }

            const images = model.imagesData.map(image => ({
                priority: image.priority,
                fileAlt: image.fileAlt,
                fileUrl: image.fileUrl,
                isCover: image.isCover,
            }));

            await Design.create({
                title: model.title,
                priority: model.priority,
                description: model.description,
                images: images ?? []
            });

            return res.status(200).json({ message: "Successful" });
        }
        return res.status(500).json({ message: "Model validation failed!" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateDesign = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: path.join("public", "temp"),
        });
        const [fields, files] = await form.parse(req);
        const model = objectValidation(fields);

        if (designValidation(model) && designImageValidation(model.imagesData)) {

            if (files?.images && files.images.length > 0) {
                for (let file of files?.images) {
                    const result = await uploadFilesSync(file, "design", "design");
                    if (result != undefined) {
                        const foundedImage = model.imagesData.findIndex(img => img.fileUrl === file.originalFilename);
                        if (foundedImage != -1) {
                            model.imagesData[foundedImage].fileUrl = result;
                        }
                    }
                }
            }

            const images = model.imagesData.map(image => ({
                priority: image.priority,
                fileAlt: image.fileAlt,
                fileUrl: image.fileUrl,
                isCover: image.isCover,
                _id: image._id
            }));

            await Design.findOneAndUpdate(
                { _id: model._id },
                {
                    $set: {
                        title: model.title,
                        priority: model.priority,
                        description: model.description,
                        images: images ?? []
                    }
                },
                { new: true }
            );

            if (model.deletedImages) {
                const deletedImages = model.deletedImages;
                for (const img of deletedImages) {
                    const filePath = path.join('public', 'design', img.fileUrl);
                    await removeFileSync(filePath);
                }
            }
            return res.status(200).json({ message: "Successful" });
        }
        return res.status(500).json({ message: "Model validation failed!" });
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteDesign = async (req, res) => {
    try {
        const { designId } = req.params;
        if (designId) {
            const design = await Design.findOne({ _id: designId });
            if (design.images) {
                design.images.forEach(img => {
                    const filePath = path.join('public', 'Design', img.fileUrl);
                    if (img.fileUrl) {
                        fs.unlink(filePath, (error) => {
                            if (error) {
                                console.log(`Error deleting file: ${error}`);
                            } else {
                                console.log(`file delete successfully!`);
                            }
                        })
                    }
                })
            }
            await Design.deleteOne({ _id: designId });
        }
        return res.status(200).json({ message: "Successfully deleted!" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = { getDesigns, getDesign, createDesign, updateDesign, deleteDesign };