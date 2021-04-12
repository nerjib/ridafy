const express=require('express')
const http = require('http')

const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const cloudinary = require('cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
const Users = require('./src/controllers/users')


const app=express();
http.createServer(app)
app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());

const storage = multer.diskStorage({
  distination: function (req, file, cb) {
    cb(null, './src');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(new Error('image is not gif'), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
});

app.get('/',(req,res)=>{
    res.json({
        h:'hi'
    })
})

app.use('users', Users)


module.exports = app;
