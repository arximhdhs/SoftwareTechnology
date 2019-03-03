const express = require('express');
const router = express.Router();
middleware = require("../middleware"); // automatically looks for index.js

// const checkAuth = require('../middleware/check-auth');
const UsersController = require('../controllers/users');
var products = [
  {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
  {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
  {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
  {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
  {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
  {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
];
router.get('/', function(req, res){
    res.render('index',{page: "index"});
});

router.get("/signup", function(req, res){
    res.render('signup');
});
  router.get("/products1", function(req, res){
    res.render('products1',{product:products});
  });
router.get("/login", function(req, res){
    res.render('login');
});

router.get("/insert",middleware.isLoggedIn, function(req, res){
    res.render('insert',{page: "insert"});
});

router.post("/signup", UsersController.user_signup);

router.post("/login", UsersController.user_login);

router.get("/logout", (req, res) => {
  req.logout();
  // req.flash("success", "Logged out seccessfully. Look forward to seeing you again!");
  res.redirect("/observatory/api");
});

//router.post("/logout",)

module.exports = router;  
