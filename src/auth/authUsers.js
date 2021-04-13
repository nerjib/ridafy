const express = require('express');
const moment = require('moment');

const Helper = require('../helpers/helper');

const router = express.Router();
const db = require('../dbs/index');

router.post('/', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(402).send({ message: 'Some values are missing' });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res.status(401).send({ message: 'Please enter a valid email address' });
  }
  const hashPassword = Helper.hashPassword(req.body.password);
  const createQuery = `INSERT INTO
    users(name,  email, password, gender, created_at, phone_no)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *`;
  const values = [
    req.body.name,
    req.body.email,
    hashPassword,
    req.body.gender,
    moment(new Date()),
    req.body.phone_no
  ];

  try {
    const { rows } = await db.query(createQuery, values);
    const token = Helper.generateToken(rows[0].id,'users');
    // console.log(`this is the token ${token}`);
    const response = {
      status: 'success',
      data: {
        message: 'User account successfully created',
        token,
        userId: rows[0].id,
      },
    };
    return res.status(201).send(response);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(404).send({ message: 'User with that username already exist' });
    }
    return res.status(400).send(error);
  }
});

module.exports = router;
