const express=require('express')
const http = require('http')

const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const cloudinary = require('cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
const Users = require('./src/controllers/users')
const Books = require('./src/controllers/books')
const AuthUsers = require('./src/auth/authUsers')
const AuthSignIn = require('./src/auth/authSignIn')
const Auth = require('./src/auth/auth')
const Authors = require('./src/controllers/authors')
const Chapters = require('./src/controllers/chapter')
const AddChapters = require('./src/controllers/addChapter')
const Payments = require('./src/controllers/payments')
const Carts = require('./src/controllers/carts')
const Category = require('./src/controllers/categories')
const WishLists = require('./src/controllers/whishlists')
const Ratings = require('./src/controllers/ratings')
const Reciters = require('./src/controllers/reciters')
const Reviews = require('./src/controllers/reviews')
//const upload = require('./src/controllers/multer')
//const cloudinary = require('./src/controllers/cloudinary')
//const fs = require('fs');

const methods = require('./methods')








dotenv.config();



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

  const token = 'abc12345'
  const bot = new methods('EAAWple2KZBnUBAEtZCedD5FyVgbV9TYZCTC0qWZCbh4Jo9SCDFvOrcWGZCKNN65y12eEXawpdUpG8BsEgwWtft0or1OJdHfmEkaTGhlXzUFffhAXGppBajjCJhTEdkhcyhlrHsAbUVIRbw2L1VCehbzXTzl7QRuvV7WS1WZAaqroFvMHQryFtE')
  app.post('/wit',  async (req, res,next) => {
  ///  res.send('{done:}')
    const response = req.body 
    if(response.object ==="page"){
      const messageObj = bot.getMessageObjects(response)
      bot.sendText(`you said: ${messageObj.message }`,messageObj.id)
    }
    res.send(200)
    //Recipe.postRecipe(req, res);
  });
  app.get('/wit', async (req, res, next) => {
    if(req.query['hub.mode']== 'subscribe' && req.query['hub.verify_token']==token){
    res.end(req.query['hub.challenge'])
    //Recipe.getAll(req, res);
    }else{
      next()
    }
  }  
  );
  

app.use('/api/v1/users',Auth.verifyToken, Users)
app.use('/api/v1/auth/signin', AuthSignIn)
app.use('/api/v1/auth/signup', AuthUsers)
app.use('/api/v1/books', Auth.verifyToken,Books)
app.use('/api/v1/authors',Auth.verifyToken, Authors)
app.use('/api/v1/chapters',Auth.verifyToken, Chapters)
app.use('/api/v1/payments',Auth.verifyToken, Payments)
app.use('/api/v1/carts', Auth.verifyToken,Carts)
app.use('/api/v1/category',Auth.verifyToken, Category)
app.use('/api/v1/wishlists',Auth.verifyToken, WishLists)
app.use('/api/v1/ratings', Auth.verifyToken,Ratings)
app.use('/api/v1/reciters',Auth.verifyToken, Reciters)
app.use('/api/v1/reviews', Auth.verifyToken,Reviews)






app.post('/api/v1/addchapter', upload.single('image'), (req, res) => {
    // console.log(req.body)
      cloudinary.uploader.upload(req.file.path, function (result) {
         console.log(result.secure_url)
        // res.send({imgurl:result.secure_url})
        AddChapters.createChapter(req,res,result.secure_url);
       },{ resource_type: "auto", public_id: `ridafychapters/${req.body.chapter_title}-${req.body.book_id}` });
     });


app.post('/hhh',(req,res)=>{
    res.json({
        h:req.body.name
    })
})

app.get('/',(req,res)=>{
    res.send('welcome to ridafy')
})



/*

app.use('/upload-images', upload.array('image'), async (req, res) => {

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

module.exports = app;
