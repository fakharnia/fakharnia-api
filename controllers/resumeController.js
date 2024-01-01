const path = require("path");
const formidable = require('formidable');
const Resume = require("../model/Resume");
const { removeFileSync, uploadFileSync, uploadFilesSync } = require("../extensions/uploadExtensions");
const { objectValidation } = require("../extensions/objectValidation");

const resumeValidation = (data) => {
    try {
        let result = true;

        if (!data) {
            result = false;
        }
        if (data.aboutMe === null || data.aboutMe === undefined || data.aboutMe.length === 0) {
            result = false;
        }

        if (data.text === null || data.text === undefined || data.text.length === 0) {
            result = false;
        }

        if (data.education === null || data.education === undefined || data.education.length === 0) {
            result = false;
        }

        if (data.fileUrl === null || data.fileUrl === undefined || data.fileUrl.length === 0) {
            result = false;
        }

        return result;
    } catch (error) {
        return false;
    }
}

const languageValidation = (data) => {
    try {
        let result = true;

        for (const prop of data) {
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

const contactValidation = (data) => {
    try {
        let result = true;

        for (const prop of data) {
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

const skillValidation = (data) => {
    try {
        let result = true;

        for (const prop of data) {
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
        const form = new formidable.IncomingForm({
            uploadDir: path.join("public", "temp"),
        });
        const [fields, files] = await form.parse(req);
        const model = objectValidation(fields);

        if (resumeValidation(model) && languageValidation(model.languages) && contactValidation(model.contacts) && skillValidation(model.skills)) {

            const fileResult = await uploadFileSync(files, "file", "resume");
            if (fileResult != undefined) {
                if (model._id) {
                    //  remove old avatar file
                    const resume = await Resume.findById(model._id);
                    if (resume && resume?.fileUrl) {
                        await removeFileSync(path.join("public", "resume", resume.fileUrl));
                    }
                }
                model.fileUrl = fileResult;
            }

            const avatarResult = await uploadFileSync(files, "avatar", "resume");
            if (avatarResult != undefined) {
                if (model._id) {
                    //  remove old avatar file
                    const resume = await Resume.findById(model._id);
                    if (resume && resume?.avatarUrl) {
                        await removeFileSync(path.join("public", "resume", resume.avatarUrl));
                    }
                }
                model.avatarUrl = avatarResult;
            }

            if (files.contactsFiles && files.contactsFiles.length > 0) {
                for (let file of files.contactsFiles) {
                    const result = await uploadFilesSync(file, "resume");
                    if (result != undefined) {
                        const foundedContact = model.contacts.findIndex(cnt => cnt.fileUrl === file.originalFilename);
                        if (foundedContact != -1) {
                            model.contacts[foundedContact].fileUrl = result;
                        }
                    }
                }
            }

            if (files.skillsFiles && files.skillsFiles.length > 0) {
                for (let file of files.skillsFiles) {
                    const result = await uploadFilesSync(file, "resume");
                    if (result != undefined) {
                        const foundedSkill = model.skills.findIndex(skl => skl.fileUrl === file.originalFilename);
                        if (foundedSkill != -1) {
                            model.skills[foundedSkill].fileUrl = result;
                        }
                    }
                }
            }

            if (model._id) {


                // Delete file if new one uploaded
                if (model.fileChanged) {
                    const currentData = await Resume.findById(model._id);
                    if (currentData.fileUrl) {
                        const filePath = path.join('public', 'resume', currentData.fileUrl);
                        await removeFileSync(filePath);
                    }


                }

                // Delete avatar if new one uploaded
                if (model.avatarChanged) {
                    const currentData = await Resume.findById(model._id);
                    if (currentData.avatarUrl) {
                        const filePath = path.join('public', 'resume', currentData.avatarUrl);
                        await removeFileSync(filePath);
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
                            contacts: model.contacts,
                            languages: model.languages,
                            skills: model.skills
                        }
                    },
                    { new: true }
                );

                if (model.deletedContacts.length > 0) {
                    for (const contact of model.deletedContacts) {
                        const filePath = path.join('public', 'resume', contact);
                        await removeFileSync(filePath);
                    }
                }

                if (model.deletedSkills.length > 0) {
                    for (const skill of model.deletedSkills) {
                        const filePath = path.join('public', 'resume', skill);
                        await removeFileSync(filePath);
                    }
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
                        contacts: model.contacts,
                        languages: model.languages,
                        skills: model.skills
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