const express = require('express');
const moment = require('moment');
const nodemailer = require("nodemailer");

const Helper = require('../helpers/helper');

const router = express.Router();
const db = require('../dbs/index');

//const mailgun = require('mailgun-js')({apiKey: 'fa6e84b7-f495cfc6', domain: 'smtp.mailgun.org'});
const mailgun = require("mailgun-js");
  const DOMAIN = 'YOUR_DOMAIN_NAME';
  const mg = mailgun({apiKey: 'c61d9a936ea916295abdfa6d126e7d60-1d8af1f4-2691f78c', domain: 'sandbox00493eebad864db4a7f50119f990bab9.mailgun.org'});
  const data = {
    from: 'Ridafy App <verify@ridafy.com>',
    to: 'kabirnajib0@gmail.com, najib@kadruwassa.ng',
    subject: 'Hello',
    text: `Testing some Mailgun awesomness!`,
    html: `<b>Hello world? <a href='m.me'> click here</a></b>`

  };
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
       // return res.send({ message: 'User with that username already exist' });
        const data = {
          from: 'Ridafy App <me@samples.mailgun.org>',
          to: 'kabirnajib0@gmail.com, bar@example.com',
          subject: 'Hello',
          text: 'Testing some Mailgun awesomeness!',
          html: `<b>Hello world? <a href='m.me'> click here</a></b>`
        };
        
        mailgun.messages().send(data, (error, body) => {
          console.log(body);
          return res.send(JSON.stringify(body))
        });
        

            })



           router.get('/kk', async (req, res) => {
          await   main('kabirnajib0@gmail.com')


            });
            
            router.get('/authmail/:id', async (req, res) => {
       const email = await      Helper.decodedEmail(req.params.id)
             // await   main('kabirnajib0@gmail.com')
    return res.send(email)
    
                });

async function main(kk) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'ridafyinfp@gmail.com',
           pass: 'ridafyapp2020'
       }
   });
   var hashEmail = await Helper.emailToken(kk);

      let message = {
        from: 'Ridafy App <verify@ridafyapp.ng>',
        to: `${kk} <${kk}>`,
        subject: 'Account Verification',
        html: `Thanks for signing up to Ridafy! 
        <p>We want to make sure that we got your email right. Verifying your email will enable you to access  our content. Please verify your email by clicking the link below.
        </p>
        <p><b>Complete Verification<b/></p>        
        <p>If you cannot click on the link, copy and paste the following URL into a new tab in your browser:<p>
        <p><b>https://ridafyapp.herokuapp.com/api/v1/auth/signup/authmail/${hashEmail}</b></p>`,

    };

    await transporter.sendMail(message, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
   });

 }




router.get('/maill',async(req,res)=>{
  
  mg.messages().send(data, function (error, body) {
    console.log(body);
    return res.send('sent');

  });
})


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
