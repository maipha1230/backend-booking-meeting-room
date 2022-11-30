const multer = require('multer')
const sharp = require('sharp')
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadFiles = upload.array("gallery", 3);

const uploadImages = (req, res, next) => {
    uploadFiles(req, res, err => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.send("Too many files to upload.");
        }
      } else if (err) {
        return res.send(err);
      }
      next();
    });
  };

const resizeImagesMeetingRoom = async (req, res, next) => {
    if (!req.files) return next();
    req.body.gallery = [];
    // console.log(req.files);
    await Promise.all(
      req.files.map(async file => {
        const newFilename = Date.now()+ Math.round(Math.random() * 1000) + ".jpg"; 
        await sharp(file.buffer)
          .resize(600, 400) // 3/2 aspect ration
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`public/image/meeting-room/${newFilename}`);
        req.body.gallery.push(newFilename);
      })
    );
    next();
  };

const resizeImagesUser = async (req, res, next) => {
    if (!req.files) return next();
    req.body.gallery = [];
    // console.log(req.files);
    await Promise.all(
      req.files.map(async file => {
        const newFilename = Date.now()+ Math.round(Math.random() * 1000) + ".jpg"; 
        await sharp(file.buffer)
          .resize(500, 500) // 3/2 aspect ration
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`public/image/profile/${newFilename}`);
        req.body.gallery.push(newFilename);
      })
    );
    next();
  };


  const getResult = async (req, res, next) => {
    if (!req.body.gallery) {
      return res.send(`You must select at least 1 image.`);
    }
    const images = req.body.gallery
      .map(image => "" + image + "")
      .join("");
    next();
  };


  module.exports = {
    uploadImages: uploadImages,
    resizeImagesMeetingRoom:resizeImagesMeetingRoom,
    resizeImagesUser: resizeImagesUser,
    getResult: getResult
  };