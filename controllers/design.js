const stringValidation = require("../extensions/objectValidation");
const path = require("path");
const fs = require("fs");
const Design = require("../model/Design");

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
        res.status(200).json(designs);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getDesign = async (req, res) => {
    try {
        const { designId } = req.params;
        const design = await Design.findById(designId);
        res.status(200).json(design);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createDesign = async (req, res) => {
    try {

        const model = stringValidation(req.body);

        const imagesArray = JSON.parse(model.imagesData);

        const images = imagesArray.map(image => ({
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
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateDesign = async (req, res) => {
    try {

        const model = stringValidation(req.body);

        if (model.deletedImages) {
            const deletedImages = JSON.parse(model.deletedImages);
            deletedImages.forEach(image => {
                const filePath = path.join('public', 'Design', image.fileUrl);
                fs.unlink(filePath, (error) => {
                    if (error) {
                        console.log(`Error deleting file: ${error}`);
                    } else {
                        console.log(`file delete successfully!`);
                    }
                })
            })
        }

        const imagesArray = JSON.parse(model.imagesData);

        const images = imagesArray.map(image => ({
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
        return res.status(200).json({ message: "Successful" });
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