const express = require('express');
const moment = require('moment');
const nodemailer = require("nodemailer");

const Helper = require('../helpers/helper');

const router = express.Router();
const db = require('../dbs/index');



/*    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
       // secure: false,
        auth: {
            user: 'nicolas.berge@ethereal.email',
            pass: 'smHU47bW6R5JgbdKPN'
        }
    });

// verify connection configuration


    
    
      // send mail with defined transport object
    const info = await   transporter.sendMail({
        from: '"Ridafy " <nicolas.berge@ethereal.email>', // sender address
        to: 'kabirnajib0@gmail.com, najib@kadruwassa.ng', // list of receivers
        subject: "Hello ", // Subject line
        text: "Hello world" // plain text body       
         });
         */

    router.get('/maila', async (res,req)=>{
        return res.send({ message: 'User with that username already exist' });


            })



            router.get('/kk', async (req, res) => {
/*
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                   // secure: false,
                    auth: {
                        user: 'nicolas.berge@ethereal.email',
                        pass: 'smHU47bW6R5JgbdKPN'
                    }
                });
*/
                const transporter = nodemailer.createTransport({
                    host: 'mail.nklere.com.ng',
                    port: 587,
                   // secure: false,
                    auth: {
                        user: 'test@nklere.com.ng',
                        pass: '23188695.Abc'
                    }
                });
                
                const info = await   transporter.sendMail({
                    from: '"Ridafy " <nicolas.berge@ethereal.email>', // sender address
                    to: 'kabirnajib0@gmail.com, najib@kadruwassa.ng', // list of receivers
                    subject: "Hello ", // Subject line
                    text: "Hello world" // plain text body       
                     });

                return res.status(201).send('info.messageId');
/*
                const getAllQ = 'SELECT * FROM users';
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
                */
            });


router.post('/', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(402).send({ message: 'Some values are missing' });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res.status(401).send({ message: 'Please enter a valid email address' });
  }
  const hashPassword = Helper.hashPassword(req.body.password);
  const createQuery = `INSERT INTO
    users(name,  email, password, gender, created_at, phone_no,user_access,account_role,remember_token,current_team_id,updated_at,profile_photo_path,email_verified_at)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`;
  const values = [
    req.body.name,
    req.body.email,
    hashPassword,
    req.body.gender,
    moment(new Date()),
    req.body.phone_no,
        1,
    'user',
    null,
    null,
    null,
    null,
    null
  ];

  try {
    const { rows } = await db.query(createQuery, values);
    const token = Helper.generateToken(rows[0].id,'user');
    // console.log(`this is the token ${token}`);
/*
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "mail.nklere.com.ng",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'test@nklere.com.ng', // generated ethereal user
          pass: '23188695.Abc', // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Ridafy 👻" <test@nklere.com.ng>', // sender address
        to: "kabirnajib0@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?"+{token}, // plain text body
        html: "<b>Hello world?</b>", // html body
      });
*/
    const response = {
      status: 'success',
      data: {
        message: 'User account successfully created waiting for email cofirmation',
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
