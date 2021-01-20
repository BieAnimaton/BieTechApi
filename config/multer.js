const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    diskStorage: (req, file, cb) => {
        cb(null, './src/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

module.exports = multer({ storage: storage })