const express = require('express');
const moment = require ('moment')
const cloudinary = require('cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

const router = express.Router();
const db = require('../dbs/index');

dotenv.config();

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
    if (file.mimetype === 'image/gif'||'image/png') {
      cb(null, true);
    } else {
      cb(new Error('image is not gif'), false);
    }
  };
  
  const upload = multer({
    storage,
    fileFilter,
  });


router.get('/', async (req, res) => {
    const getAllQ = 'SELECT * FROM books';
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getAllQ);
      return res.status(201).send(rows);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ message: 'books not available' });
      }
      return res.status(400).send(`${error} jsh`);
    }
  });

/*
  app.post('/api/v1/addchapter', upload.single('image'), (req, res) => {
    // console.log(req.body)
      cloudinary.uploader.upload(req.file.path, function (result) {
         console.log(result.secure_url)
        // res.send({imgurl:result.secure_url})
        AddChapters.createChapter(req,res,result.secure_url);
       },{ resource_type: "auto", public_id: `ridafychapters/${req.body.chapter_title}-${req.body.book_id}` });
     });
*/
router.post('/', upload.single('image'), async (req, res) => {
    cloudinary.uploader.upload(req.file.path, function (result) {
    
    const createUser = `INSERT INTO
    books(title,author_id,description,sample_location,chapters_count,category_id,cover_location,reciter_id,price,created_at)
    VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;  
  const values = [
  req.body.title,
  req.body.author_id,
  req.body.description,
  req.body.sample_location,
  req.body.chapters_count,
  req.body.category_id,
  result.secure_url,
  req.body.reciter_id,
  req.body.price,
  moment(new Date())
  ];
  try {
  const { rows } = await db.query(createUser, values);
  // console.log(rows);
  const data = {
    status: 'success',
    data: {
      message: 'book added successfully​',
      Name: rows[0].name,
      Email: rows[0].email,
      phone: rows[0].phone_no,
    },
  };
  return res.status(201).send(data);
  } catch (error) {
  return res.status(400).send(error);
  }
  
    },{ resource_type: "auto", public_id: `ridafycovers/${req.body.title}` })

  });
 

module.exports = router;
