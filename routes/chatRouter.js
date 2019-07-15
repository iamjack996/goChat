const express = require('express')
const router = express.Router()
module.exports = router

const chatController = require('../controllers/chat.controller')

function checkUserAuth(req, res, next) {
    const logingUser = req.session.loginUser
    if (!logingUser) { res.redirect('../auth') }
    next()
}

router.use(checkUserAuth)

router.get('/', chatController.index)
router.get('/:id', chatController.chat);
router.get('/getLoginUser', chatController.getLoginUser)

router.post('/addFriend', chatController.addFriend)