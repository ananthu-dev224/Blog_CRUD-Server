const { v4: uuidv4 } = require("uuid");
const path = require("path");

const createFilename = (name) => {
    const uniqueFilename = uuidv4() + path.extname(name);
    return uniqueFilename;
}


module.exports = createFilename;