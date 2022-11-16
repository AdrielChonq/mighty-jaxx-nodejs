const multer = require("multer");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: process.env.DB_URI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "image",
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const store = multer({
  storage,
  limits: { fileSize: 2097152 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb("filetype");
}

const uploadMiddleware = async (req, res, next) => {
  const upload = store.single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          return res
            .status(400)
            .send(`Exceed file size. Maximum 2MB file size is allowed.`);
        case "LIMIT_UNEXPECTED_FILE":
          return res.status(400).send(`File key incorrect.`);
        default:
          return res.status(400).send(err.message);
      }
    } else if (err) {
      if (err === "filetype") {
        return res
          .status(400)
          .send("Image files only. Only access jpeg, jpg and png.");
      }

      return res.status(400).send(err.message);
    }
    next();
  });
};

module.exports = uploadMiddleware;
