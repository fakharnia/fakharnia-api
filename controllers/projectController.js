const path = require("path");
const formidable = require('formidable');
const Project = require("../model/Project");
const { removeFileSync, uploadFileSync } = require("../extensions/uploadExtensions");
const { objectValidation } = require("../extensions/objectValidation");

const projectValidation = (rawData) => {
    try {
        const model = rawData;
        let result = true;

        if (!model) {
            result = false;
        }
        if (model.fa_name === null || model.fa_name === undefined || model.fa_name.length === 0) {
            result = false;
        }
        if (model.en_name === null || model.en_name === undefined || model.en_name.length === 0) {
            result = false;
        }
        if (model.deu_name === null || model.deu_name === undefined || model.deu_name.length === 0) {
            result = false;
        }
        if (model.fa_description === null || model.fa_description === undefined || model.fa_description.length === 0) {
            result = false;
        }
        if (model.en_description === null || model.en_description === undefined || model.en_description.length === 0) {
            result = false;
        }
        if (model.deu_description === null || model.deu_description === undefined || model.deu_description.length === 0) {
            result = false;
        }

        if (model.fa_techDescription === null || model.fa_techDescription === undefined || model.fa_techDescription.length === 0) {
            result = false;
        }
        if (model.en_techDescription === null || model.en_techDescription === undefined || model.en_techDescription.length === 0) {
            result = false;
        }
        if (model.deu_techDescription === null || model.deu_techDescription === undefined || model.deu_techDescription.length === 0) {
            result = false;
        }

        if (model.logoUrl === null || model.logoUrl === undefined || model.logoUrl.length === 0) {
            result = false;
        }
        return result;
    } catch (error) {
        return false;
    }
}

const projectTechnologiesValidation = (rawData) => {
    try {
        const model = rawData;
        let result = true;

        if (!model || model.length === 0) {
            result = false;
        }

        for (const prop of model) {
            if (prop.name === null || prop.name === undefined || prop.name.length === 0) {
                result = false;
            }

        }

        return result;
    } catch (error) {
        return false;
    }
}

const getProjects = async (req, res) => {
    try {
        const Projects = await Project.find();
        return res.status(200).json(Projects);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const createProject = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: path.join("public", "temp"),
        });
        const [fields, files] = await form.parse(req);
        const model = objectValidation(fields);
        if (projectValidation(model) && projectTechnologiesValidation(model.technologies)) {

            const result = await uploadFileSync(files, "logo", "project");
            if (result != undefined) {
                model.logoUrl = result;
            }
            const project = new Project({
                fa_name: model.fa_name,
                en_name: model.en_name,
                deu_name: model.deu_name,
                priority: model.priority,
                fa_description: model.fa_description,
                en_description: model.en_description,
                deu_description: model.deu_description,
                url: model.url,
                logoUrl: model.logoUrl,
                logoAlt: model.logoAlt,
                fa_techDescription: model.fa_techDescription,
                en_techDescription: model.en_techDescription,
                deu_techDescription: model.deu_techDescription,
                technologies: model.technologies
            });
            await project.save();
            return res.status(200).json({ message: "Successfully Created!" });
        }
        return res.status(500).json({ message: "Model validation failed!" });

    } catch (error) {
        console.log(error);
        // delete the file....
        return res.status(500).json(error);
    }
}

const updateProject = async (req, res) => {

    try {
        const form = new formidable.IncomingForm({
            uploadDir: path.join("public", "temp"),
        });
        const [fields, files] = await form.parse(req);
        const model = objectValidation(fields);
        if (projectValidation(model) && projectTechnologiesValidation(model.technologies)) {

            const result = await uploadFileSync(files, "logo", "project");
            if (result != undefined) {
                //  remove old avatar file
                const project = await Project.findById(model._id);
                if (project && project.logoUrl) {
                    await removeFileSync(path.join("public", "project", project.logoUrl));
                }
                model.logoUrl = result;
            }
            await Project.findOneAndUpdate(
                { _id: model._id },
                {
                    $set: {
                        fa_name: model.fa_name,
                        en_name: model.en_name,
                        deu_name: model.deu_name,
                        priority: model.priority,
                        fa_description: model.fa_description,
                        en_description: model.en_description,
                        deu_description: model.deu_description,
                        url: model.url,
                        logoUrl: model.logoUrl,
                        logoAlt: model.logoAlt,
                        fa_techDescription: model.fa_techDescription,
                        en_techDescription: model.en_techDescription,
                        deu_techDescription: model.deu_techDescription,
                        technologies: model.technologies
                    }
                },
                { new: true }
            );

            return res.status(200).json({ message: "Successful" });

        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (projectId) {
            const project = await Project.findOne({ _id: projectId });
            if (project.logoUrl) {
                const filePath = path.join('public', 'project', project.logoUrl);
                await removeFileSync(filePath);
            }
            await Project.deleteOne({ _id: projectId });
        }
        return res.status(200).json({ message: "Successfully deleted!" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };