// Importing packages
const express = require("express");
const multer = require("multer")
const path = require('path')
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. 

// Initialising express through app
const app = express()

const port = 10000;

// GET request for the index.html page
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


// cb: cb stands for callback function it will be automatically called whenever the validation fails and the error message will be returned by multer.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });


const maxSize = 1 * 1024 * 1024; // for 1MB

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
  limits: { fileSize: maxSize },
}).single('file');


// POST request to access the file submitted
app.post("/",(req, res) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.send(err)
        console.log("File type or size not valid!")
      } else if (err) {
        // An unknown error occurred when uploading.
        res.send(err)
      }
      else{
      // Everything went fine.
      console.log(req.file)
      res.send("File Uploaded")
      }
    })
  });


app.listen(port, () => {
    console.log(`Server initiated succesfully at ${port}`);
});