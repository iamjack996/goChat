const express = require('express');
const app = express();

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
    res.render('index/index');
};

