const origins = require("./allowedOrigins.json");
const corsOptions = {
    origin: (origin, callback) => {
        if (origins.allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS!"));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;