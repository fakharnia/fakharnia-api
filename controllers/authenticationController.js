const Admin = require("../model/Admin");

const login = async (req, res) => {
    try {
        const bodyObject = req.body;
        const keys = Object.keys(bodyObject);
        if (keys.includes("username") && keys.includes("username")) {
            const exist = await Admin.findOne({ username: bodyObject.username, password: bodyObject.password }).exec();
            if (exist) {
                exist.updateOne({ lastLoggedIn: new Date() });
                res.status(200).json(exist);
            }
            else {
                res.status(204).json(null);
            }
        } else {
            res.status(204).json(null);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = { login }