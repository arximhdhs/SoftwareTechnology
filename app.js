const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const indexRoutes = require ('./routes/index');
const productRoutes =  require('./routes/products');
const shopRoutes = require('./routes/shops');
//const priceRoutes = require('./routes/prices');
var path = require('path');
var  ejwt           = require('express-jwt');
var expressValidator = require('express-validator');
var moment = require('moment'),
flash          = require("connect-flash"),
// passport = require('passport-strategy'),
passport       = require("passport");
const config = require('./config/database');
var secret = 'super secret';

mongoose.connect(config.database);
  let db = mongoose.connection;
  
  // Check connection
  db.once('open', function(){
    console.log('Connected to MongoDB');
  });
  
  // Check for DB errors
  db.on('error', function(err){
    console.log(err);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressValidator())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./public'));
// app.use(session());
app.use(flash());


// app.use(ejwt({secret: secret, userProperty: 'tokenPayload'}).unless({path: ['/login']}));
// app.use(express.static('./views'));
app.locals.moment = moment; // create local variable available for the application

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });
  app.use((req, res, next) => {
    res.locals.currentUser = req.user; // req.user is an authenticated user
    next();
  });
//Routes which should handle requests

app.use('/observatory/api', indexRoutes);
app.use('/observatory/api/products', productRoutes);
app.use('/observatory/api/shops', shopRoutes);
//app.use('/observatory/api/prices', priceRoutes); 

//If U reach here..
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status(404);
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;
