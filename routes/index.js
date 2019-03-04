const express = require('express');
const router = express.Router();
middleware = require("../middleware"); // automatically looks for index.js

// const checkAuth = require('../middleware/check-auth');
const UsersController = require('../controllers/users');

router.get('/', function(req, res){
    res.render('index',{page: "index"});
});
router.get('/map', function(req, res){
  res.render('maps');
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
