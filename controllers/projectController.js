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

        if (model.fa_description === null || model.fa_description === undefined || model.fa_description.length === 0) {
            result = false;
        }
        if (model.en_description === null || model.en_description === undefined || model.en_description.length === 0) {
            result = false;
        }
        if (model.fa_techDescription === null || model.fa_techDescription === undefined || model.fa_techDescription.length === 0) {
            result = false;
        }
        if (model.en_techDescription === null || model.en_techDescription === undefined || model.en_techDescription.length === 0) {
            result = false;
        }

        if (model.lightLogoUrl === null || model.lightLogoUrl === undefined || model.lightLogoUrl.length === 0) {
            result = false;
        }

        if (model.darkLogoUrl === null || model.darkLogoUrl === undefined || model.darkLogoUrl.length === 0) {
            result = false;
        }
        if (model.fa_metatag_title === null || model.fa_metatag_title === undefined || model.fa_metatag_title.length === 0) {
            result = false;
        }
        if (model.en_metatag_title === null || model.en_metatag_title === undefined || model.en_metatag_title.length === 0) {
            result = false;
        }
        if (model.fa_metatag_description === null || model.fa_metatag_description === undefined || model.fa_metatag_description.length === 0) {
            result = false;
        }
        if (model.en_metatag_description === null || model.en_metatag_description === undefined || model.en_metatag_description.length === 0) {
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
        const projects = await Project.find().sort({ priority: 1 });
        return res.status(200).json(projects);
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

            const lightLogoResult = await uploadFileSync(files, "lightLogo", "project");
            if (lightLogoResult != undefined) {
                model.lightLogoUrl = lightLogoResult;
            }

            const darkLogoResult = await uploadFileSync(files, "darkLogo", "project");
            if (darkLogoResult != undefined) {
                model.darkLogoUrl = darkLogoResult;
            }

            const project = new Project({
                fa_name: model.fa_name,
                en_name: model.en_name,
                deu_name: model.deu_name,
                key: model.key,
                priority: model.priority,
                fa_description: model.fa_description,
                en_description: model.en_description,
                deu_description: model.deu_description,
                url: model.url,
                lightLogoUrl: model.lightLogoUrl,
                darkLogoUrl: model.darkLogoUrl,
                logoAlt: model.logoAlt,
                fa_techDescription: model.fa_techDescription,
                en_techDescription: model.en_techDescription,
                deu_techDescription: model.deu_techDescription,
                technologies: model.technologies,
                fa_metatag_title: model.fa_metatag_title,
                en_metatag_title: model.en_metatag_title,
                fa_metatag_description: model.fa_metatag_description,
                en_metatag_description: model.en_metatag_description        

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

            const lightLogoResult = await uploadFileSync(files, "lightLogo", "project");
            if (lightLogoResult != undefined) {
                //  remove old avatar file
                const project = await Project.findById(model._id);
                if (project && project.lightLogoUrl) {
                    await removeFileSync(path.join("public", "project", project.lightLogoUrl));
                }
                model.lightLogoUrl = lightLogoResult;
            }

            const darkLogoResult = await uploadFileSync(files, "darkLogo", "project");
            if (darkLogoResult != undefined) {
                //  remove old avatar file
                const project = await Project.findById(model._id);
                if (project && project.darkLogoUrl) {
                    await removeFileSync(path.join("public", "project", project.darkLogoUrl));
                }
                model.darkLogoUrl = darkLogoResult;
            }

            await Project.findOneAndUpdate(
                { _id: model._id },
                {
                    $set: {
                        fa_name: model.fa_name,
                        en_name: model.en_name,
                        deu_name: model.deu_name,
                        key: model.key,
                        priority: model.priority,
                        fa_description: model.fa_description,
                        en_description: model.en_description,
                        deu_description: model.deu_description,
                        url: model.url,
                        lightLogoUrl: model.lightLogoUrl,
                        darkLogoUrl: model.darkLogoUrl,
                        logoAlt: model.logoAlt,
                        fa_techDescription: model.fa_techDescription,
                        en_techDescription: model.en_techDescription,
                        deu_techDescription: model.deu_techDescription,
                        technologies: model.technologies,
                        fa_metatag_title: model.fa_metatag_title,
                        en_metatag_title: model.en_metatag_title,
                        fa_metatag_description: model.fa_metatag_description,
                        en_metatag_description: model.en_metatag_description        
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
            if (project.lightLogoUrl) {
                const filePath = path.join('public', 'project', project.lightLogoUrl);
                await removeFileSync(filePath);
            }
            if (project.darkLogoUrl) {
                const filePath = path.join('public', 'project', project.darkLogoUrl);
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