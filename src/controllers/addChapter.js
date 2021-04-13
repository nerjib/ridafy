/* eslint-disable no-console */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
const express = require('express');
const moment = require('moment');
const dotenv = require('dotenv');

const router = express.Router();


const db = require('../dbs/index');


async function createChapter(req, res, audioUrl) {
    const createUser = `INSERT INTO
    chapters (chapter_title,audio_location,book_id,created_at)
    VALUES ($1, $2,$3,$4,$5,$6) RETURNING *`;  
  const values = [
  req.body.chapter_title,
  audioUrl,
  req.body.book_id,
  moment(new Date())
  ];
  try {
  const { rows } = await db.query(createUser, values);
  // console.log(rows);
  const data = {
    status: 'success',
    data: {
      message: 'Chapter added successfully​',
      Name: rows[0].chapter_title,
      Email: rows[0].audio_location,
    },
  };
  return res.status(201).send(data);
  } catch (error) {
  return res.status(400).send(error);
  }
}


dotenv.config();

module.exports = {
  createChapter,
  
};
