const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage }); //storing temporary in memory

module.exports = upload;