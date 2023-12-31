const stringValidation = require("../extensions/objectValidation");
const path = require("path");
const fs = require("fs");
const Resume = require("../model/Resume");

const modelValidation = (rawData) => {
    try {
        const model = stringValidation(rawData);
        let result = true;

        if (!model) {
            result = false;
        }
        if (model.aboutMe === null || model.aboutMe === undefined || model.aboutMe.length === 0) {
            result = false;
        }

        if (model.text === null || model.text === undefined || model.text.length === 0) {
            result = false;
        }

        if (model.education === null || model.education === undefined || model.education.length === 0) {
            result = false;
        }

        if (model.fileUrl === null || model.fileUrl === undefined || model.fileUrl.length === 0) {
            result = false;
        }

        return result;
    } catch (error) {
        return false;
    }
}

const languageValidation = (rawData) => {
    try {
        const model = stringValidation(JSON.parse(rawData));
        let result = true;

        for (const prop of model) {
            if (prop.title === null || prop.title === undefined || prop.title.length === 0) {
                result = false;
            }
            if (prop.speakingRate === null || prop.speakingRate === undefined || isNaN(prop.speakingRate)) {
                result = false;
            }
            if (prop.readingRate === null || prop.readingRate === undefined || isNaN(prop.readingRate)) {
                result = false;
            }
            if (prop.writingRate === null || prop.writingRate === undefined || isNaN(prop.writingRate)) {
                result = false;
            }
            if (prop.listeningRate === null || prop.listeningRate === undefined || isNaN(prop.listeningRate)) {
                result = false;
            }
        }

        return result;
    } catch (error) {
        return false;
    }
}

const contactValidation = (rawData) => {
    try {
        const model = stringValidation(JSON.parse(rawData));
        let result = true;

        for (const prop of model) {
            if (prop.link === null || prop.link === undefined || prop.link.length === 0) {
                result = false;
            }
            if (prop.fileUrl === null || prop.fileUrl === undefined || prop.fileUrl.length === 0) {
                result = false;
            }

        }

        return result;
    } catch (error) {
        return false;
    }
}

const skillValidation = (rawData) => {
    try {
        const model = stringValidation(JSON.parse(rawData));
        let result = true;

        for (const prop of model) {
            if (prop.title === null || prop.title === undefined || prop.title.length === 0) {
                result = false;
            }
            if (prop.description === null || prop.description === undefined || prop.description.length === 0) {
                result = false;
            }
            if (prop.fileUrl === null || prop.fileUrl === undefined || prop.fileUrl.length === 0) {
                result = false;
            }

        }

        return result;
    } catch (error) {
        return false;
    }
}

const getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne();
        return res.status(200).json(resume);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateResume = async (req, res) => {
    try {

        if (modelValidation(req.body)) {
            const model = stringValidation(req.body);
            const contactModel = contactValidation(model.contacts) ? JSON.parse(model.contacts) : [];
            const languageModel = languageValidation(model.languages) ? JSON.parse(model.languages) : [];
            const skillModel = skillValidation(model.skills) ? JSON.parse(model.skills) : [];

            if (model._id) {

                // Delete file if new one uploaded
                if (model.fileChanged) {
                    const currentData = await Resume.findById(model._id);
                    if (currentData.fileUrl) {
                        const filePath = path.join('public', 'resume', currentData.fileUrl);
                        fs.unlink(filePath, (error) => {
                            if (error) {
                                console.log(`Error deleting file: ${error}`);
                            } else {
                                console.log(`file delete successfully!`);
                            }
                        })
                    }


                }

                // Delete avatar if new one uploaded
                if (model.avatarChanged) {
                    const currentData = await Resume.findById(model._id);
                    if (currentData.avatarUrl) {
                        const filePath = path.join('public', 'resume', currentData.avatarUrl);
                        fs.unlink(filePath, (error) => {
                            if (error) {
                                console.log(`Error deleting file: ${error}`);
                            } else {
                                console.log(`file delete successfully!`);
                            }
                        })
                    }
                }

                await Resume.findOneAndUpdate(
                    { _id: model._id },
                    {
                        $set: {
                            aboutMe: model.aboutMe,
                            text: model.text,
                            education: model.education,
                            fileUrl: model.fileUrl,
                            avatarUrl: model.avatarUrl,
                            hobbies: model.hobbies,
                            contacts: contactModel,
                            languages: languageModel,
                            skills: skillModel
                        }
                    },
                    { new: true }
                );

                if (model.deletedContacts.length > 0) {
                    const deletedcContacts = JSON.parse(model.deletedContacts);
                    deletedcContacts.forEach(contact => {
                        const filePath = path.join('public', 'resume', contact);
                        fs.unlink(filePath, (error) => {
                            if (error) {
                                console.log(`Error deleting file: ${error}`);
                            } else {
                                console.log(`file delete successfully!`);
                            }
                        })
                    })
                }

                if (model.deletedSkills.length > 0) {
                    const deletedSkills = JSON.parse(model.deletedSkills);
                    deletedSkills.forEach(skill => {
                        const filePath = path.join('public', 'resume', skill);
                        fs.unlink(filePath, (error) => {
                            if (error) {
                                console.log(`Error deleting file: ${error}`);
                            } else {
                                console.log(`file delete successfully!`);
                            }
                        })
                    })
                }
            } else {
                await Resume.create(
                    {
                        aboutMe: model.aboutMe,
                        text: model.text,
                        education: model.education,
                        fileUrl: model.fileUrl,
                        avatarUrl: model.avatarUrl,
                        hobbies: model.hobbies,
                        contacts: contactModel,
                        languages: languageModel,
                        skills: skillModel
                    }
                );
            }



            return res.status(200).json({ message: "Successful" });
        }
        return res.status(500).json({ message: "Model validation failed!" });
    } catch (error) {
        res.status(500).json(error);
    }
}


module.exports = { getResume, updateResume };