const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const saltRounds = 10

const DB = require('../models/DB_config')
const Users = DB.ref('/User')

exports.auth = function (req, res) {
    res.render('auth/index')
};

exports.login = function (req, res) {
    let { email, password } = req.body

    Users
        .orderByChild('email')
        .equalTo(email)
        .limitToFirst(1)
        .once('value', async snapshot => {
            let userInfo = {}
            snapshot.forEach(child => userInfo = child.val())

            if (!userInfo.email) res.render('auth/index')

            let passwordCompare = await bcrypt.compare(password, userInfo.password)
            if (!passwordCompare) res.render('auth/index')

            res.send(req.body)
        }) 
};

exports.test = function (req, res) {
    res.render('test')
};




// add User

// bcrypt.hash('futura996', saltRounds, function (err, hash) {
//     Users.push({
//       name: 'Jack',
//       email: 'iamjack996@gmail.com',
//       birthday: '1996/03/07',
//       password: hash,
//       created_time: Date.now(),
//       updated_time: Date.now()
//     })
// });