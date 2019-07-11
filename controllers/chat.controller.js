const express = require('express');
const app = express();

const DB = require('../models/DB_config')
const Users = DB.ref('/User')

// const admin = require("firebase-admin");
// const serviceAccount = require("../config/serviceAccountKey.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://chat-demo-5a060.firebaseio.com"
// });

// const DB = admin.database()
// const Users = DB.ref('/User')

// const ChatRoom = DB.ref('/ChatRoom')



exports.index = function (req, res) {
    const loginUser = req.session.loginUser

    Users
        .once('value', async snapshot => {
            snapshot.forEach(user => {
                console.log(user.val())
            })
    })
    res.render('chat/index', { loginUser });
};

exports.getLoginUser = function (req, res) {
    const loginUser = req.session.loginUser
    res.json({ loginUser })
};

