const mongoose =  require('mongoose');
const Product = require('../models/product');
const Shop = require('../models/shop');
const fetch  = require('node-fetch');
var userlat,userlon;

exports.products_get_all = (req, res, next) => {
    Product.find()
      .exec()
      .then(product => {
        res.render('listproducts', {product: product});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });  

  }

  exports.products_get_results = (req, res, next) => {
    var tmpaddress = req.body.address;
    var adr = tmpaddress.replace(/ /g, "%20");
    var api = 'https://us1.locationiq.com/v1/search.php?key=5f56374211cc54&q=' + adr + '&format=json';

    fetch(api).then(function (response) {
        return response.json();
    }).then(function (json) {
        products = json;
        console.log(products);
        userlat = products[0].lat;
        userlon = products[0].lon;
      
      Product.find({category:req.body.category}).sort({price:1})
      .exec()
      .then(product => {
        for(var i=0; i<product.length;i++){
        console.log(i);
        var dist=calcCrow(userlat,userlon,product[i].lat,product[i].lon);
        console.log(calcCrow(userlat,userlon,product[i].lat,product[i].lon));
        console.log(product);
        console.log("hello");
        if (calcCrow(userlat,userlon,product[i].lat,product[i].lon)>3){
            product.splice(i,1);
            dist.splice(i,1)
            i--;
          }
        }
        res.render('listproducts', {product: product});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });  

    });
    
  } 

exports.products_post = (req, res) => {
  const storeName = req.body.store;
    Shop.findOne({name: storeName})
    .exec()
    .then(shop => {
      if (shop) {
        Product.find({store:shop.name, category:req.body.category})
        .exec()
        .then(product1 =>{
          if (product1.length>=1){
            return res.status(409).json({
              message: 'Product exists'
              });
          } else {
              const product = new Product({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.category,
              category: req.body.category,
              price: req.body.price,
              description: req.body.description,
              store: req.body.store,
              lat: shop.lat,
              lon: shop.lng,
              rating :{
                rate:0,
                count:0
              }
            });
            product
            .save()
            .then(result => {
              console.log(result);
             res.redirect('/observatory/api/');
           })
           .catch(err => {
             console.log(err);
              res.status(500).json({
                error: err
            });
           });
          } 
        })             
      }else {
        res
        .status(404)
        .json({ message: "No valid store found" });
      }
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    
  } 
  
exports.productId_get = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
      .exec()
      .then(product => {
        if (product) {
          console.log(product);
          //res.render('productinfo', {product: product});
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }  

exports.productId_patch = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }  

exports.productId_delete = (req, res, next) => {
    var id = req.params.productId;
    console.log(id);
    Product.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }  

  function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);
 
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
 
// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}
