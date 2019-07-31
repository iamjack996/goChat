const express = require('express')
const app = express()
const uuidv1 = require('uuid/v1')

const DB = require('../models/DB_config')
const Users = DB.ref('/User')
const ChatRoom = DB.ref('/ChatRoom')

// const bcrypt = require('bcrypt')
// const saltRounds = 10


exports.index = function (req, res) {
    const loginUser = req.session.loginUser
    console.log(loginUser)
    res.render('chat/index', { friendInfo: '', roomKey: '' })
}

exports.chat = async function (req, res) {
    const loginUser = await req.session.loginUser
    const roomKey = req.params.id

    await Users
        .child(loginUser.userKey)
        .child("/friendList")
        .orderByChild("roomKey")
        .equalTo(roomKey)
        .limitToFirst(1)
        .once('value', snapshot => {
            if (!snapshot.val()) {
                res.redirect('../auth')
            }
            snapshot.forEach(async friend => {
                // console.log(friend.val())
                friendInfo = friend.val()
            })
        })

    await ChatRoom
        .orderByChild("key")
        .equalTo(roomKey)
        .once('value', async snapshot => {
            // consola.success(snapshot.val())

            if (!snapshot.val()) {
                ChatRoom.push({
                    key: roomKey,
                    memberA: loginUser.email,
                    memberB: friendInfo.email,
                    msg: ''
                })
            }
        })

    await Users
        .orderByChild("email")
        .equalTo(loginUser.email)
        .limitToFirst(1)
        .once('value', snapshot => {
            snapshot.forEach(async loginUser => {
                // console.log(loginUser.child('friendList').val())
                let friendList = await loginUser.child('friendList').val()
                friendList = Object.values(friendList)
                return res.render('chat/index', { friendInfo, roomKey })
            })
        })
}

exports.getLoginUserAndFriendList = function (req, res) {
    const loginUser = req.session.loginUser

    // Users
    //     .orderByChild("email")
    //     .equalTo(loginUser.email)
    //     .limitToFirst(1)
    //     .once('value', snapshot => {
    //         snapshot.forEach(async loginUser => {
    //             let friendList = loginUser.child('friendList').val()

    //             friendList = await Object.values(friendList)
    //             res.json({ loginUser, friendList })
    //         })
    //     })


    Users
        .orderByChild("email")
        .equalTo(loginUser.email)
        .limitToFirst(1)
        .once('value', snapshot => {
            snapshot.forEach(async loginUserData => {
                let friendList = loginUserData.child('friendList').val()
                friendList = await Object.values(friendList)

                friendList.map(async friend => {
                    // console.log(111)

                    ChatRoom
                        .orderByChild("key")
                        .equalTo(friend.roomKey)
                        .limitToFirst(1)
                        .once('value', async snapshot => {
                            // console.log(222)
                            let id = Object.keys(snapshot.val())[0]
                            // console.log(id)

                            ChatRoom
                                .child(id)
                                .child('/msg')
                                .limitToLast(1)
                                .once('value', snapshot => {
                                    console.log(333)
                                    snapshot.forEach(friendMsg => {
                                        // console.log(friendMsg.val().content)
                                        console.log(444)
                                        friend.msg = friendMsg.val().content
                                    })
                                })
                        })
                })

                var sleep = function (time) {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            console.log(555)
                            // console.log(loginUser)
                            res.json({ loginUser, friendList })
                            // res.render('chat/index', { friendInfo: '', roomKey: '' })
                        }, time)
                    })
                }
                await sleep(800)
            })
        })
}

exports.getChatRecord = function (req, res) {
    const roomKey = req.query.key
    // console.log(req.query)
    ChatRoom
        .orderByChild("key")
        .equalTo(roomKey)
        .once('value', snapshot => {
            // consola.success(snapshot.val())
            snapshot.forEach(async room => {
                msgRecord = await Object.values(room.val().msg)
                // console.log(room.val())
                await res.json({ msgRecord })
            })
        })
}


exports.addFriend = function (req, res) {
    let { email } = req.body
    const roomKey = uuidv1()
    // console.log(req.body)
    const loginUser = req.session.loginUser

    if (email == loginUser.email) {
        req.flash('error', '不可以加自己為好友')
        return res.redirect('back')
    }
    let test = 0

    try {
        Users
            .orderByChild("email")
            .equalTo(email)
            .limitToFirst(1)
            .once('value', async snapshot => {

                if (snapshot.val()) {
                    await snapshot.forEach(async child => {
                        userInfo = child.val()
                        userInfo.userKey = await child.key
                    })
                    consola.success(userInfo)

                    await Users.child(loginUser.userKey)
                        .child('/friendList')
                        .orderByChild("email")
                        .equalTo(email)
                        .once('value', async snapshot => {
                            consola.success(snapshot.numChildren())
                            if (snapshot.numChildren() < 1) {
                                console.log('新增好友成功')
                                await Users.child(loginUser.userKey)
                                    .child('/friendList')
                                    .push({
                                        email: userInfo.email,
                                        name: userInfo.name,
                                        roomKey,
                                        kind: 'A'
                                    })

                                await Users.child(userInfo.userKey)
                                    .child('/friendList')
                                    .push({
                                        email: loginUser.email,
                                        name: loginUser.name,
                                        roomKey,
                                        kind: 'B'
                                    })
                                test = 2
                                req.flash('success', '新增好友成功')
                            } else {
                                console.log('此帳號已在好友名單')
                                test = 3
                                req.flash('error', '此帳號已在好友名單')
                            }
                        })
                    console.log('test => ' + test)
                    return res.redirect('back')
                } else {
                    console.log('無此好友帳號')
                    test = 1
                    req.flash('error', '無此好友帳號')

                    console.log('test => ' + test)
                    return res.redirect('back')
                }
            })

    } catch (e) {
        console.log(e)
    }
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


// 註冊

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



// 訊息留言msg

// ChatRoom
//         .orderByChild("key")
//         .equalTo('1234567')
//         .limitToFirst(1)
//         .once('value', snapshot => {
//             let id = Object.keys(snapshot.val())[0]
//             ChatRoom.child(id).child('/msg').push({
//                 created_at: '1233943021321',
//                 content: 'Sure',
//                 name: 'Jack'
//             })
//         })