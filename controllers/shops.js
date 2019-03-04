const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Shop = require('../models/shop');
const fetch  = require('node-fetch');
var shoplat,shoplon;


exports.create_new = (req, res) => {

  Shop.find({name: req.body.name})
  .exec()
  .then(shopResults => {
    if (shopResults.length >= 1) {
        return res.status(409).json({
            message: 'Shop exists'
        });
    }else{ 
    var shopadr = req.body.address;
    var adr = shopadr.replace(/ /g, "%20");
    var api = 'https://us1.locationiq.com/v1/search.php?key=5f56374211cc54&q=' + adr + '&format=json';
    fetch(api).then(function (response) {
        console.log('hello  you api');
        return response.json();
    }).then(function (json) {
        //products = json;
        shoplat = json[0].lat;
        shoplon = json[0].lon;
        const shop = new Shop({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            address: req.body.address,
            lat: shoplat,
            lng: shoplon
        });
        shop
        .save()
        .then(shop => {
            res.redirect('/observatory/api/insert');
            console.log(shop);
        //     res.status(201).json({
        //         message: 'Shop created'
        //     });
         })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
        }).catch(function (err) {
            console.log('Fetch problem: ' + err.message);
        });
    }
})    
      
}

exports.list_them_all = function (req, res) {
    /* Shop.find({}, function(err, data){
      if (err) throw err;
      for (var i=0; i< data.length; i++){
           console.log(data.name);
       }
         res.render('listshops', {shops: data}); 
     }); */

    Shop.find({})
        .exec()
        .then(shop => {
            res.render('listshops', { shops: shop });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}

exports.shop_info = function (req, res) {
    var shopid = req.params.shopid;

    Shop.find({ _id: shopid })
        .exec()
        .then(shop => {
            res.render('shopinfo', { shop: shop });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })

}

exports.delete_shop = function (req, res) {
    var shopid = req.params.shopid;
    console.log(shopid);
    Shop.remove({ _id: shopid })
        .exec()
        .then(result => {
            res.render('listshops');
            res.status(200).json({
                message: "Shop deleted"
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
