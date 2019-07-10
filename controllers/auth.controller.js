const express = require('express')
const bcrypt = require('bcrypt')
const saltRounds = 10

var cookieParser = require('cookie-parser')
var session = require('express-session')
var flash = require('connect-flash');
var app = express();

app.use(cookieParser('keyboard cat'))
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }
}))

// app.use(function (req, res, next) {
//     // res.locals.user = req.session.user
//     // res.locals.success = req.flash('success').toString()
//     res.locals.msg = req.flash('msg').toString()
//     next()
// })
app.use(flash())

const DB = require('../models/DB_config')
const Users = DB.ref('/User')

exports.auth = function (req, res) {
    res.render('auth/index', { messages: req.flash('error') })
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

            if (!userInfo.email) {
                req.flash('error', '無此帳號')
                // res.render('auth/index', { msg: '無此帳號' })
                res.redirect('back')
            } else {
                let passwordCompare = await bcrypt.compareSync(password, userInfo.password)
                if (!passwordCompare) {
                    req.flash('error', '密碼錯誤')
                    // res.render('auth/index', { msg: '密碼錯誤' })
                    res.redirect('back')
                }
                res.redirect('/chat')
            }
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