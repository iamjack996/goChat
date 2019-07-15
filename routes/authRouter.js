const express = require('express')
const router = express.Router()
module.exports = router

const authController = require('../controllers/auth.controller')

router.get('/', authController.auth)
router.post('/login', authController.login)

router.get('/test', authController.test)
