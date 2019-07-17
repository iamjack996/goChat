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

router.get('/getChatRecord', chatController.getChatRecord)
router.get('/getLoginUserAndFriendList', chatController.getLoginUserAndFriendList)
router.post('/addFriend', chatController.addFriend)

router.get('/', chatController.index)
router.get('/:id', chatController.chat);
