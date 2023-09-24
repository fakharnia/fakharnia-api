const stringValidation = (obj) => {
    try {
        Object.keys(obj).forEach(property => {
            if (obj[property] === "null") {
                obj[property] = null;
            }

            if (obj[property] === "undefined") {
                obj[property] == undefined;
            }

            if (obj[property] === 'true') {
                obj[property] = true;
            }

            if (obj[property] === 'false') {
                obj[property] = false;
            }
        });

        return obj;
    } catch (error) {
        return obj;
    }
}

module.exports = stringValidation;