const stringValidation = (obj) => {
    try {
        Object.keys(obj).forEach(property => {
            if (obj[property] === "null") {
                obj[property] = null;
            }

            if (obj[property] === "undefined") {
                obj[property] = undefined;
            }

            if (obj[property] === 'true') {
                obj[property] = true;
            }

            if (obj[property] === 'false') {
                obj[property] = false;
            }
            if (isValidJson(obj[property])) {
                obj[property] = JSON.parse(obj[property]);
            }
        });

        return obj;
    } catch (error) {
        return obj;
    }
}

const handleObjectPropertyArray = (obj) => {
    try {
        Object.keys(obj).forEach(key => {
            if (obj[key].length === 1) {
                obj[key] = obj[key][0];
            }
        })
        return obj;
    } catch (error) {
        console.log(error);
        return obj;
    }
}

const isValidJson = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}

const objectValidation = (obj) => stringValidation(handleObjectPropertyArray(obj));

module.exports = { objectValidation };