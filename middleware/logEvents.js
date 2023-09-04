const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");


const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);
    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", logName), logItem);
    } catch (error) {
        console.error(error);
    }
}

const logger = async (req, res, next) => {
    await logEvents(`${req.method}\t${req.headers.origin} ${req.url} IP:${req.socket.remoteAddress ? req.socket.remoteAddress : req.headers["x-forwarded-for"]}`, "reqLog.txt");
    console.log(`${req.method} ${req.path}`);
    next();
};

module.exports = { logEvents, logger };