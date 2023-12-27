const stringValidation = require("../extensions/objectValidation");
const path = require("path");
const fs = require("fs");
const Project = require("../model/Project");

const modelValidation = (rawData) => {
    try {
        const model = stringValidation(rawData);
        let result = true;

        if (!model) {
            result = false;
        }
        if (model.name === null || model.name === undefined || model.name.length === 0) {
            result = false;
        }

        if (model.priority === null || model.priority === undefined || isNaN(model.priority)) {
            result = false;
        }

        if (model.description === null || model.description === undefined || model.description.length === 0) {
            result = false;
        }

        if (model.techDescription === null || model.techDescription === undefined || model.techDescription.length === 0) {
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

const innerModelValidation = (rawData) => {
    try {
        const model = stringValidation(JSON.parse(rawData));
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
        if (modelValidation(req.body)) {
            const model = stringValidation(req.body);
            const innerModel = innerModelValidation(model.technologies) ? JSON.parse(model.technologies) : [];
            const project = new Project({
                name: model.name,
                priority: model.priority,
                description: model.description,
                url: model.url,
                logoUrl: model.logoUrl,
                logoAlt: model.logoAlt,
                techDescription: model.techDescription,
                technologies: innerModel
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
        if (modelValidation(req.body)) {
            const model = stringValidation(req.body);
            const innerModel = innerModelValidation(model.technologies) ? JSON.parse(model.technologies) : []

            if (model.logoChanged) {
                const currentData = await Project.findById(model._id);
                if (currentData.logoUrl) {
                    const filePath = path.join('public', 'Project', currentData.logoUrl);
                    fs.unlink(filePath, (error) => {
                        if (error) {
                            console.log(`Error deleting file: ${error}`);
                        } else {
                            console.log(`file delete successfully!`);
                        }
                    })
                }
            }

            await Project.findOneAndUpdate(
                { _id: model._id },
                {
                    $set: {
                        name: model.name,
                        priority: model.priority,
                        description: model.description,
                        url: model.url,
                        logoUrl: model.logoUrl,
                        logoAlt: model.logoAlt,
                        techDescription: model.techDescription,
                        technologies: innerModel
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
                const filePath = path.join('public', 'Project', project.logoUrl);
                if (project.logoUrl) {
                    fs.unlink(filePath, (error) => {
                        if (error) {
                            console.log(`Error deleting file: ${error}`);
                        } else {
                            console.log(`file delete successfully!`);
                        }
                    })
                }
            }
            await Project.deleteOne({ _id: projectId });
        }
        return res.status(200).json({ message: "Successfully deleted!" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };