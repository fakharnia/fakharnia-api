const Admin = require("../model/Admin");
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try {
        const bodyObject = req.body;
        const keys = Object.keys(bodyObject);
        if (keys.includes("username") && keys.includes("username")) {
            const admin = await Admin.findOne({ username: bodyObject.username }).exec();
            if (admin) {
                const validPassword = await bcrypt.compare(bodyObject.password, admin.password);
                if (!validPassword) {
                    return res.status(400).send('Invalid username or password.');
                }
                admin.updateOne({ lastLoggedIn: new Date() });
                return res.status(200).json(admin);
            }
            else {
                return res.status(204).json(null);
            }
        } else {
            return res.status(204).json(null);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = { login }