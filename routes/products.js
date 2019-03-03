const express = require('express');
const router = express.Router();
// const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');
middleware = require("../middleware"); // automatically looks for index.js


router.get("/", ProductsController.products_get_all);
  
router.post("/",middleware.isLoggedIn, ProductsController.products_post); 

router.post("/searchresults", ProductsController.products_get_results);

router.get("/:productId", ProductsController.productId_get);

router.put("/:productId",ProductsController.productId_patch)
  
router.patch("/:productId", ProductsController.productId_patch);
  
router.delete("/:productId", ProductsController.productId_delete);

//router.post("/delete/:productId",ProductsController.productId_delete);
  
module.exports = router;
