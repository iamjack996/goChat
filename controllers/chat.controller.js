const express = require('express')
const app = express()

const DB = require('../models/DB_config')
const Users = DB.ref('/User')
// const bcrypt = require('bcrypt')
// const saltRounds = 10


exports.index = function (req, res) {
    const loginUser = req.session.loginUser

    Users
        .orderByChild("email")
        .equalTo(loginUser.email)
        .limitToFirst(1)
        .once('value', snapshot => {
            snapshot.forEach(loginUser => {
                // console.log(loginUser.child('friendList').val())
                let friendList = loginUser.child('friendList').val()
                // Object.values(friendList).map(user => {
                //     console.log(user)
                // })
                res.render('chat/index', { loginUser, friendList })
            })
        })
}

exports.chat = function (req, res) {
    const loginUser = req.session.loginUser

    const friendMail = req.params.id
    // res.send(req.params.id)

    Users
        .orderByChild("email")
        .equalTo(loginUser.email)
        .limitToFirst(1)
        .once('value', snapshot => {
            snapshot.forEach(loginUser => {
                // console.log(loginUser.child('friendList').val())
                let friendList = loginUser.child('friendList').val()
                
                res.render('chat/index', { loginUser, friendList })
            })
        })
}

exports.getLoginUser = function (req, res) {
    const loginUser = req.session.loginUser
    res.json({ loginUser })
}

exports.addFriend = function (req, res) {
    let { email } = req.body
    // console.log(req.body)
    const loginUser = req.session.loginUser

    if (email == loginUser.email) {
        req.flash('error', '不可以加自己為好友')
        return res.redirect('back')
    }

    let test = 0

    Users
        .orderByChild("email")
        .equalTo(email)
        .limitToFirst(1)
        .once('value', async snapshot => {
            console.log(1111111)
            await snapshot.forEach(child => {
                userInfo = child.val()
                userInfo.userId = child.key
            })
            consola.success(userInfo)
            if (snapshot.val()) {
                await Users
                    .orderByChild("email")
                    .equalTo(loginUser.email)
                    .limitToFirst(1)
                    .once('value', async snapshot => {
                        console.log(22222222)
                        let uid = Object.keys(snapshot.val())[0]
                        await Users.child(uid)
                            .child('/friendList')
                            .orderByChild("email")
                            .equalTo(email)
                            .once('value', async snapshot => {
                                console.log(33333333)
                                consola.success(snapshot.numChildren())
                                if (snapshot.numChildren() < 1) {
                                    console.log('新增好友成功')
                                    await Users.child(uid)
                                        .child('/friendList')
                                        .push({
                                            email: userInfo.email,
                                            name: userInfo.name
                                        })
                                    test = 2
                                    req.flash('success', '新增好友成功')
                                } else {
                                    console.log('此帳號已在好友名單')
                                    test = 3
                                    req.flash('error', '此帳號已在好友名單')
                                }
                            })

                        console.log(44444444)
                        // consola.success(snapshot.val())
                        // consola.success(Object.keys(snapshot.val())[0])

                        console.log('test => ' + test)
                        return res.redirect('back')
                    })
            } else {
                console.log('無此好友帳號')
                test = 1
                req.flash('error', '無此好友帳號')

                console.log('test => ' + test)
                return res.redirect('back')
            }

            console.log(5555555)

        })


    // function echo() {
    //     return new Promise(resolve => {
    //         setTimeout(() => {
    //             a += 49
    //             resolve(a)
    //         }, 3000)
    //     });
    // }
    // echo().then(function (data) {
    //     console.log(data)
    // })

}


// bcrypt.hash('futura996', saltRounds, function (err, hash) {
//         Users.push({
//           name: 'Jack',
//           email: 'iamjack996@gmail.com',
//           birthday: '1996/03/07',
//           password: hash,
//           created_time: Date.now(),
//           updated_time: Date.now()
//         })
//     })