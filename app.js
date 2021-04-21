require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
cloudinary.config({
  cloud_name: "darkmancer",
  api_key: "111775957868488",
  api_secret: "lLvvfpZzG44eKd-n1mxBPGXRIN8",
});

const { Product, sequelize } = require("./models");
const multer = require("multer");
const app = express();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + file.mimetype.split("/")[1]);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.split("/")[1] == "jpeg" ||
      file.mimetype.split("/")[1] == "png"
    )
      cb(null, true);
    else {
      cb(new Error("this file is not a photo"));
    }
  },
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/", upload.single("image"), async (req, res, next) => {
  console.log(req.file);
  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    if (err) return next(err);
    console.log(result);
    const product = await Product.create({
      name: req.body.name,
      imgUrl: result.secure_url,
    });
    console.log(product);
    fs.unlinkSync(req.file.path);
    res.status(200).json({ product });
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "path not found on this server" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});

//sequelize.sync({ force: true }).then(() => console.log("DB Sync"));

const port = process.env.PORT || 8005;
app.listen(port, () => console.log(`server running on port ${port}`));
