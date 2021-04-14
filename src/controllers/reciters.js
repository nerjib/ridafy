const express = require('express');
const moment = require ('moment')

const router = express.Router();
const db = require('../dbs/index');

router.get('/', async (req, res) => {
  const getAllQ = 'SELECT * FROM reciters';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ);
    return res.status(201).send(rows);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ message: 'User with that EMAIL already exist' });
    }
    return res.status(400).send(`${error} jsh`);
  }
});

router.get('/:id', async (req, res) => {
  const text = 'SELECT * FROM reciters WHERE id = $1';
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



    
router.post('/', async (req, res) => {
    
    const createUser = `INSERT INTO
    reciters (reciter_name,created_at)
    VALUES ($1,$2) RETURNING *`;  
  const values = [
  req.body.reciter_name,
  moment(new Date())
  ];
  try {
  const { rows } = await db.query(createUser, values);
  // console.log(rows);
  const data = {
    status: 'success',
    data: {
      message: 'Reciter added successfully​',
      Reciter_name: rows[0].reciter_name,
    },
  };
  return res.status(201).send(data);
  } catch (error) {
  return res.status(400).send(error);
  }
  
  });
 

module.exports = router;
