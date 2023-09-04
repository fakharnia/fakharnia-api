const origins = require("../config/allowedOrigins.json");

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (origins.allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", true);
    }
    next();
}

module.exports = credentials;