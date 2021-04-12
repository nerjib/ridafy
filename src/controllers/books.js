var multer  = require('multer');
const express = require('express');
const moment = require ('moment')

const router = express.Router();
const db = require('../dbs/index');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});


router.post('/upload',upload.single('file'),function(req, res, next) {
    console.log(req.file);
    if(!req.file) {
      res.status(500);
      return next(err);
    }
    res.json({ fileUrl: 'https://ridafyapp.herokuapp.com' + req.file.filename });
  })

router.get('/', async (req, res) => {
 
});


router.get('/:id', async (req, res) => {
  const text = 'SELECT * FROM users WHERE id = $1';
  // console.log(req.params.id);
  try {
    const { rows } = await db.query(text, [req.params.id]);
    if (!rows[0]) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send(rows[0]);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post('/', async (req, res) => {
    
    const createUser = `INSERT INTO
    users (name,email,password,phone_no,gender,time)
    VALUES ($1, $2,$3,$4,$5,$6) RETURNING *`;  
  const values = [
  req.body.name,
  req.body.email,
  req.body.password,
  req.body.phone_no,
  req.body.gender,
  moment(new Date()),
  ];
  try {
  const { rows } = await db.query(createUser, values);
  // console.log(rows);
  const data = {
    status: 'success',
    data: {
      message: 'User added successfully​',
      Name: rows[0].name,
      Email: rows[0].email,
      phone: rows[0].phone_no,
    },
  };
  return res.status(201).send(data);
  } catch (error) {
  return res.status(400).send(error);
  }
  
  });
 

module.exports = router;
