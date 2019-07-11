const express = require('express')
const bcrypt = require('bcrypt')
const consola = require('consola')
const saltRounds = 10
const app = express();

const DB = require('../models/DB_config')
const Users = DB.ref('/User')

exports.auth = function (req, res) {
    res.render('auth/index') //, { error: req.flash('error') }
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

            try {
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

                    delete userInfo.password
                    req.session.loginUser = userInfo
                    if (req.session.loginUser) {
                        consola.success(req.session.loginUser)
                    }

                    res.redirect('/chat')
                }
            } catch (e) {
                console.log(e)
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