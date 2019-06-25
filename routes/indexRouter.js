const express = require('express');
const router = express.Router();
module.exports = router;

const indexController = require('../controllers/index.controller');

router.get('/', indexController.index);
