const express = require('express');
const router = express.Router();

const ShopsController = require('../controllers/shops');
middleware = require("../middleware"); // automatically looks for index.js

router.get("/newshop",middleware.isLoggedIn, function(req, res){
    res.render('newshop');
  });

router.post("/", ShopsController.create_new);

router.get("/list", ShopsController.list_them_all);

router.get("/shopinfo/:shopid", ShopsController.shop_info); // kai xwris shopinfo
//geia
router.post("/deleteshop/:shopid", ShopsController.delete_shop);

module.exports = router; 