const bcrypt = require('bcrypt');
const Admin = require("../model/Admin");

const seedData = async () => {
    try {
        const admin = await Admin.findOne({ username: "admin" });
        if (!admin) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await Admin.create({
                username: "admin",
                password: hashedPassword
            });
            console.log("Admin activated!")
        }
    } catch (error) {
        console.log("Error on seeding data!: ", error);
        throw error("Error on seeding data!");
    }
}

module.exports = seedData;