const express = require('express');
const router = express.Router();
module.exports = router;

const chatController = require('../controllers/chat.controller');

router.get('/', chatController.index);
