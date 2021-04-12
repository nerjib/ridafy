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

// Parsers for POST data
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));


app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.headers('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
      return res.status(200).json({});
    }
    next();
  });


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
app.use('/api/v1/users', Users)

app.post('/hhh',(req,res)=>{
    res.json({
        h:req.body.name
    })
})

app.get('/',(req,res)=>{
    res.json({
        h:'hi'
    })
})



module.exports = app;
