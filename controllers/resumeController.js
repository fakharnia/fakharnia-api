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
        if (data.fa_aboutMe === null || data.fa_aboutMe === undefined || data.fa_aboutMe.length === 0) {
            result = false;
        }
        if (data.en_aboutMe === null || data.en_aboutMe === undefined || data.en_aboutMe.length === 0) {
            result = false;
        }
        if (data.deu_aboutMe === null || data.deu_aboutMe === undefined || data.deu_aboutMe.length === 0) {
            result = false;
        }

        if (data.fa_text === null || data.fa_text === undefined || data.fa_text.length === 0) {
            result = false;
        }
        if (data.en_text === null || data.en_text === undefined || data.en_text.length === 0) {
            result = false;
        }
        if (data.deu_text === null || data.deu_text === undefined || data.deu_text.length === 0) {
            result = false;
        }

        if (data.fa_education === null || data.fa_education === undefined || data.fa_education.length === 0) {
            result = false;
        }
        if (data.en_education === null || data.en_education === undefined || data.en_education.length === 0) {
            result = false;
        }
        if (data.deu_education === null || data.deu_education === undefined || data.deu_education.length === 0) {
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
            if (prop.fa_description === null || prop.fa_description === undefined || prop.fa_description.length === 0) {
                result = false;
            }
            if (prop.en_description === null || prop.en_description === undefined || prop.en_description.length === 0) {
                result = false;
            }
            if (prop.deu_description === null || prop.deu_description === undefined || prop.deu_description.length === 0) {
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
                            fa_aboutMe: model.fa_aboutMe,
                            en_aboutMe: model.en_aboutMe,
                            deu_aboutMe: model.deu_aboutMe,
                            fa_text: model.fa_text,
                            en_text: model.en_text,
                            deu_text: model.deu_text,
                            fa_education: model.fa_education,
                            en_education: model.en_education,
                            deu_education: model.deu_education,
                            fileUrl: model.fileUrl,
                            avatarUrl: model.avatarUrl,
                            fa_hobbies: model.fa_hobbies,
                            en_hobbies: model.en_hobbies,
                            deu_hobbies: model.deu_hobbies,
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
                        fa_aboutMe: model.fa_aboutMe,
                        en_aboutMe: model.en_aboutMe,
                        deu_aboutMe: model.deu_aboutMe,
                        fa_text: model.fa_text,
                        en_text: model.en_text,
                        deu_text: model.deu_text,
                        fa_education: model.fa_education,
                        en_education: model.en_education,
                        deu_education: model.deu_education,
                        fileUrl: model.fileUrl,
                        avatarUrl: model.avatarUrl,
                        fa_hobbies: model.fa_hobbies,
                        en_hobbies: model.en_hobbies,
                        deu_hobbies: model.deu_hobbies,
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