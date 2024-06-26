
const path = require("path");
const fs = require('fs');
const mongoose = require('mongoose');

/**
 * Upload file with property name example: files[property] = files.avatar
 *
 * @param {object} files - File Object
 * @param {string} property - Property name contains files array
 * @param {string} folderName - Upload Folder Name
 * @returns {string} - Return uploaded file name
 */
const uploadFileSync = async (files, property, folderName) => {
    try {
        if (!fs.existsSync(path.join("public", folderName))) {
            fs.mkdirSync(path.join("public", folderName), { recursive: true });
        }
        if (files[property] && files[property].length === 1) {
            let id = new mongoose.Types.ObjectId();

            const file = files[property][0];
            const tempPath = file._writeStream.path;

            let filename = `${id}${path.extname(file.originalFilename)}`;

            // Check if file with this name exist
            while (fs.existsSync(path.join("public", folderName, filename))) {
                id = new mongoose.Types.ObjectId();
                filename = `${id}${path.extname(file.originalFilename)}`;
            }

            const uploadPath = path.join("public", folderName, filename);

            const data = await fs.readFileSync(tempPath);
            await fs.writeFileSync(uploadPath, data);
            await fs.unlinkSync(tempPath);

            return filename;
        }
        return undefined;
    } catch (error) {
        console.log(error);
        return undefined;
    }

}

/**
 * Upload file 
 *
 * @param {file} files - directory address
 * @returns {string} - Return uploaded file name
 */
const uploadFilesSync = async (file, folderName) => {
    try {
        let id = new mongoose.Types.ObjectId();

        const tempPath = file._writeStream.path;

        let filename = `${id}${path.extname(file.originalFilename)}`;

        if (!fs.existsSync(path.join("public", folderName))) {
            fs.mkdirSync(path.join("public", folderName), { recursive: true });
        }

        // Check if file with this name exist
        while (fs.existsSync(path.join("public", folderName, filename))) {
            id = new mongoose.Types.ObjectId();
            filename = `${id}${path.extname(file.originalFilename)}`;
        }

        const uploadPath = path.join("public", folderName, filename);

        const data = await fs.readFileSync(tempPath);
        await fs.writeFileSync(uploadPath, data);
        await fs.unlinkSync(tempPath);

        return filename;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

/**
 * remove file from server
 *
 * @param {string} path - file address
 * @returns {boolean} - Return true if success and false if not
 */
const removeFileSync = async (path) => {
    try {
        await fs.rmSync(path, { recursive: true });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


/**
 * remove files from directory
 *
 * @param {string} directory - directory address
 * @returns {boolean} - Return true if successfuly and false if not
 */
const removeFilesSync = async (directory, removeDirectory = false) => {
    try {
        const files = await fs.readdirSync(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            await fs.rmSync(filePath, { recursive: true });
        }

        if (removeDirectory) {
            fs.rmSync(directory, { recursive: true, force: true });
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}

module.exports = {
    uploadFileSync,
    removeFileSync,
    uploadFilesSync,
    removeFilesSync
}