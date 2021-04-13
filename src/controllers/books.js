var multer  = require('multer');
const express = require('express');
const moment = require ('moment')

const router = express.Router();
const db = require('../dbs/index');


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


router.post('/', async (req, res) => {
    
    const createUser = `INSERT INTO
    users (title,author_id,description,sample_location,chapters_count,category_id,cover_location,reciter_id,price,created_at)
    VALUES ($1, $2,$3,$4,$5,$6) RETURNING *`;  
  const values = [
  req.body.title,
  req.body.author_id,
  req.body.description,
  req.body.sample_location,
  req.body.chapters_count,
  req.body.category_id,
  req.body.cover_location,
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
