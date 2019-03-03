const express = require('express');
const router = express.Router();
const mongoose =  require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { check, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');
var secret = 'super secret';
var  ejwt           = require('express-jwt');

      passport   = require("passport");

exports.user_signup = (req, res, next) => {
    
    const username = req.body.username;
    const password = req.body.password;
    // const dateOfBirth = req.body.dateOfBirth;
    const email = req.body.email;
   
    
    // const password2 = req.body.password2;
  
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    // req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  
    // let errors = req.validationErrors();
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });

   
    //   }
    // if(errors){
    //   res.render('/signup', {
    //     errors:errors
    //   });
}else {
      let newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username:username,
        password:password,
        // dateOfBirth:dateOfBirth,
        email:email
      });
  
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          newUser.password = hash;
          newUser.save(function(err){
            if(err){
              console.log(err);
              return;
            } else {
              // req.flash('success','You are now registered and can log in');
              res.redirect('/observatory/api');
              // res.redirect(redirectTo);
              // res.redirect('back');
            }
          });
        });
      });
    }
  }


exports.user_login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
          req.flash("error", "Invalid username or password");
          // console.log("not user");
          return res.redirect('/observatory/api/login');
        }
        req.logIn(user, err => {
          if (err) { return next(err); }
          let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/observatory/api';
          delete req.session.redirectTo;
          req.flash("success", "Good to see you again, " + user.username);
          res.redirect(redirectTo);
        });
      })(req, res, next);
}
// First login to receive a token
// exports.user_login = (req, res, next) =>{
//   passport.authenticate('local', function(err, user, info) {
//     if (err) return next(err);
//     if (!user) {
//       return res.status(401).json({ status: 'error', code: 'unauthorized' });
//     } else {
//       return res.json({ token: jwt.sign({id: user.id}, secret) });
//     }
//   })(req, res, next);
// }

// // Load the user from "database" if token found
// app.use(function(req, res, next) {
//   if (req.tokenPayload) {
//     req.user = users[req.tokenPayload.id];
//   }
//   if (req.user) {
//     return next();
//   } else {
//     return res.status(401).json({ status: 'error', code: 'unauthorized' });
//   }
// });

// // Then set that token in the headers to access routes requiring authorization:
// // Authorization: Bearer <token here>
// app.get('/message', function(req, res) {
//   return res.json({
//     status: 'ok',
//     message: 'Congratulations ' + req.user.username + '. You have a token.'
//   });
// });

// // Error handler middleware
// app.use(function(err, req, res, next) {
//   console.error(err);
//   return res.status(500).json({ status: 'error', code: 'unauthorized' });
// });


exports.userId_delete = (req, res, next) => {   
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
