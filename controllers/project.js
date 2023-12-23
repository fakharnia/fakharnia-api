const stringValidation = require("../extensions/objectValidation");
const path = require("path");
const fs = require("fs");
const Project = require("../model/Project");

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

        const model = stringValidation(req.body);

        const project = new Project({
            name: model.name,
            priority: model.priority,
            description: model.description,
            url: model.url,
            logoUrl: model.logoUrl,
            logoAlt: model.logoAlt,
            techDescription: model.techDescription,
            technologies: model.technologies ? JSON.parse(model.technologies) : null
        });

        await project.save();
        return res.status(200).json({ message: "Successfully Created!" });

    } catch (error) {
        console.log(error);
        // delete the file....
        return res.status(500).json(error);
    }
}

const updateProject = async (req, res) => {

    try {
        const model = stringValidation(req.body);

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
                    technologies: model.technologies ? JSON.parse(model.technologies) : null
                }
            },
            { new: true }
        );

        return res.status(200).json({ message: "Successful" });
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