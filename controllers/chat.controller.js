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
    // Users
    //     .once('value', async snapshot => {
    //         snapshot.forEach(user => {
    //             console.log(user.val())
    //         })
    // })

    Users
        .orderByChild("email")
        .equalTo(loginUser.email)
        .limitToFirst(1)
        .once('value', async snapshot => {
            consola.success(snapshot.val())
            consola.success(Object.keys(snapshot.val())[0])

            Users.ref('/'+Object.keys(snapshot.val())[0]).push({
                email: 'test1234@gmail.com',
            })

            // snapshot.child(Object.keys(snapshot.val())[0]).push({
            //     email: 'test1234@gmail.com',
            // })

        })

    res.render('chat/index', { loginUser });
}

exports.getLoginUser = function (req, res) {
    const loginUser = req.session.loginUser
    res.json({ loginUser })
}

exports.addFriend = function (req, res) {
    const loginUser = req.session.loginUser

    // Users
    //     .orderByChild('email')
    //     .equalTo(loginUser.email)
    //     .limitToFirst(1)
    //     .once('value', async snapshot => {
    //         snapshot.forEach(data => {
    //             consola.success(data.val())
    //         })
    //     })


    // Users.push({
    //     name: 'Jack',
    //     email: 'iamjack996@gmail.com',
    //     birthday: '1996/03/07',
    //     password: hash,
    //     created_time: Date.now(),
    //     updated_time: Date.now()
    // })

    res.redirect('back')
}
