const multer = require("multer");

const upload = multer({ dest: "files/" });

module.exports = upload;
