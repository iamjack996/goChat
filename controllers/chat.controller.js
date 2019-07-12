const express = require('express');
const app = express();

const DB = require('../models/DB_config')
const Users = DB.ref('/User')
// const bcrypt = require('bcrypt')
// const saltRounds = 10


exports.index = function (req, res) {
    const loginUser = req.session.loginUser
    // Users
    //     .once('value', async snapshot => {
    //         snapshot.forEach(user => {
    //             console.log(user.val())
    //         })
    // })

    res.render('chat/index', { loginUser });
}

exports.getLoginUser = function (req, res) {
    const loginUser = req.session.loginUser
    res.json({ loginUser })
}

exports.addFriend = async function (req, res) {
    let { email } = req.body
    // console.log(req.body)
    const loginUser = req.session.loginUser

    if (email == loginUser.email) {
        req.flash('error', '不可以加自己為好友')
        res.redirect('back')
    }

    let test = 0

    let findLoginUser = function () {
        Users
            .orderByChild("email")
            .equalTo(loginUser.email)
            .limitToFirst(1)
            .once('value', async snapshot => {
                let uid = await Object.keys(snapshot.val())[0]
                checkFriendList(uid)
                // consola.success(snapshot.val())
                // consola.success(Object.keys(snapshot.val())[0])
            })
    }
    let checkFriendList = function (uid) {
        Users.child(uid)
            .child('/firendList')
            .orderByChild("email")
            .equalTo(email)
            .once('value', async snapshot => {
                consola.success(snapshot.numChildren())
                if (snapshot.numChildren() < 1) {
                    console.log('新增好友成功')
                    Users.child(uid)
                        .child('/firendList')
                        .push({
                            email
                        })
                    test = 2
                    req.flash('success', '新增好友成功')
                } else {
                    console.log('此帳號已在好友名單')
                    test = 3
                    req.flash('error', '此帳號已在好友名單')
                }
            })
    }
    Users
        .orderByChild("email")
        .equalTo(email)
        .limitToFirst(1)
        .once('value', async snapshot => {
            // consola.success(snapshot.val())
            if (snapshot.val()) {
                findLoginUser()
            } else {
                console.log('無此好友帳號')
                test = 1
                req.flash('error', '無此好友帳號')
            }
        }).then(() => {
            console.log('test => ' + test)
            return res.redirect('back')
        })



    // bcrypt.hash('futura996', saltRounds, function (err, hash) {
    //     Users.push({
    //       name: 'Jack',
    //       email: 'iamjack996@gmail.com',
    //       birthday: '1996/03/07',
    //       password: hash,
    //       created_time: Date.now(),
    //       updated_time: Date.now()
    //     })
    // })
}
