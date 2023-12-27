const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = (message, logName) => {
    const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
        fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    fsPromises.appendFile(path.join(__dirname, "..", "logs", logName), logItem);
}

const logger = (req, res, next) => {
    const message = `${req.method}\t${req.headers.origin} ${req.url} IP:${req.socket.remoteAddress ? req.socket.remoteAddress : req.headers["x-forwarded-for"]}`;
    logEvents(message, "reqLog.txt");
    next();
};

const errorLogger = (error, req, res, next) => {
    const message = `\n${error}\n${req.method}${req.headers.origin} ${req.url} IP:${req.socket.remoteAddress ? req.socket.remoteAddress : req.headers["x-forwarded-for"]}`;
    logEvents(message, "errorLog.txt");
}

module.exports = { logEvents, logger, errorLogger };