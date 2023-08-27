var express = require("express");
const { MaxFileUploadLimit } = require("../config/config");
const upload = require("../middlewares/upload");
const sqlite3 = require("sqlite3").verbose();
var router = express.Router();

const db = new sqlite3.Database("files-db");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS files");
  db.run("CREATE TABLE files(  name TEXT, path TEXT, size INT)");
});

router.post(
  "/",
  upload.array("files", MaxFileUploadLimit),
  (req, res, next) => {
    if (req.files === undefined || req.files.length == 0) {
      res.status(400).json({
        message: "No file found!",
      });
      return;
    }

    db.serialize(() => {
      const stmt = db.prepare("INSERT INTO files Values (?, ?, ?)");
      for (const file of req.files) {
        stmt.run(file.originalname, file.path, file.size);
      }
    });

    res.status(200).json({
      message: "File Uploaded successfully",
    });
  }
);

router.get("/", async (req, res, next) => {
  files = [];

  await db.all("SELECT name, path, size FROM files", (err, rows) => {
    if (err) {
      console.log("Error: ", err.message);
    }

    for (const row of rows) {
      files.push({
        name: row.name,
        path: row.path,
        size: row.size,
      });
    }

    res.status(200).json({
      message: "File fetched successfully",
      totalFiles: files.length,
      files,
    });
  });
});

module.exports = router;
