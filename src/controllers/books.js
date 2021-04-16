const express = require('express');
const moment = require ('moment')
//const cloudinary = require('cloudinary');
//const multer = require('multer');
const dotenv = require('dotenv');
const upload = require('./multer')
const cloudinary = require('./cloudinary')
//const fs = require('fs');

const fs = require('fs')
const router = express.Router();
const db = require('../dbs/index');

dotenv.config();

/*
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
*/

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
router.get('/:id', async (req, res) => {
    const text = 'SELECT * FROM books WHERE id = $1';
    // console.log(req.params.id);
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(rows);
    } catch (error) {
      return res.status(400).send(error);
    }
  });

  router.get('/author/:id', async (req, res) => {
    const text = 'SELECT * FROM books WHERE author_id = $1';
    // console.log(req.params.id);
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(rows);
    } catch (error) {
      return res.status(400).send(error);
    }
  });
  router.get('/category/:id', async (req, res) => {
    const text = 'SELECT * FROM books WHERE category_id = $1';
    // console.log(req.params.id);
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(rows);
    } catch (error) {
      return res.status(400).send(error);
    }
  });



 /* app.use('/upload-images', upload.array('image'), async (req, res) => {

    const uploader = async (path) => await cloudinary.uploads(path, 'Images');
  
    if (req.method === 'POST') {
      const urls = []
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
      }
  
      res.status(200).json({
        message: 'images uploaded successfully',
        data: urls[0]
      })
  
    } else {
      res.status(405).json({
        err: `${req.method} method not allowed`
      })
    }
  })

  */

  router.post('/a', upload.array("image" ),  async(req, res) => {



    const uploader = async (path) => await cloudinary.uploads(path, 'Images');
  
    if (req.method === 'POST') {
      const urls = []
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
      }
  
      res.status(200).json({
        message: 'images uploaded successfully',
        data: urls
      })
  
    } else {
      res.status(405).json({
        err: `${req.method} method not allowed`
      })
    }
  });
 
  /*
router.post('/', upload.single('image'),  (req, res) => {
    cloudinary.uploader.upload(req.file.path, async (result)=> {
    
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
 
*/
module.exports = router;
