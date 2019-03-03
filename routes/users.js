const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');

router.delete("/:userId", UsersController.userId_delete);

module.exports = router; 