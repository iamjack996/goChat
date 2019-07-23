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

    Users
        .orderByChild("email")
        .equalTo(loginUser.email)
        .limitToFirst(1)
        .once('value', snapshot => {
            snapshot.forEach(async loginUser => {       // 寫成功移到 getLoginUserAndFriendList
                // console.log(loginUser.child('friendList').val())
                async function wait() {
                    return new Promise(async function (resolve, reject) {
                        let friendList = loginUser.child('friendList').val()
                        friendListNew = await Object.values(friendList)
                        await friendListNew.map(async friend => {
                            console.log(111)
                            await ChatRoom
                                .orderByChild("key")
                                .equalTo(friend.roomKey)
                                .limitToFirst(1)
                                .once('value', async snapshot => {
                                    console.log(222)
                                    let id = Object.keys(snapshot.val())[0]
                                    console.log(id)
                                    await ChatRoom
                                        .child(id)
                                        .child('/msg')
                                        .limitToLast(1)
                                        .once('value', async snapshot => {
                                            console.log(333)
                                            snapshot.forEach(async friendMsg => {
                                                // console.log(friendMsg.val().content)
                                                console.log(444)
                                                friend.msg = await friendMsg.val().content
                                            })
                                        })
                                    await resolve(friend)
                                })
                        })
                    })
                }

                wait().then(() => {
                    console.log(555)
                    console.log(friendListNew)
                    res.render('chat/index', { friendInfo: '', roomKey: '' })
                })
                // return new Promise(function (resolve, reject) {
                //     setTimeout(() => {
                //         resolve(val)
                //     }, 1000)
                // })


            })
        })
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




    ///////////

    // const friendMail = req.params.id
    // let haveRoom = false

    // ChatRoom
    //     .orderByChild("memberA")
    //     .equalTo(loginUser.email)
    //     .once('value', async snapshot => {
    //         // consola.success(snapshot.val())
    //         if (!snapshot.val()) {
    //             await ChatRoom
    //                 .orderByChild("memberA")
    //                 .equalTo(friendMail)
    //                 .once('value', async snapshot => {
    //                     await snapshot.forEach(room => {
    //                         if (room.val().memberB == loginUser.email) {
    //                             haveRoom = true
    //                             roomKey = room.val().key
    //                         }
    //                     })
    //                 })
    //         } else {
    //             await snapshot.forEach(room => {
    //                 if (room.val().memberB == friendMail) {
    //                     haveRoom = true
    //                     roomKey = room.val().key
    //                 }
    //             })
    //         }
    //     })

    // if (!haveRoom) {
    //     roomKey = uuidv1()
    //     console.log(roomKey)
    //     await ChatRoom.push({
    //         key: roomKey,
    //         memberA: loginUser.email,
    //         memberB: friendMail,
    //         msg: ''
    //     })

    //     await Users
    //         .orderByChild("email")
    //         .equalTo(loginUser.email)
    //         .limitToFirst(1)
    //         .once('value', async snapshot => {
    //             let id = Object.keys(snapshot.val())[0]
    //             await Users.child(id).child('/friendList')
    //                 .orderByChild('email')
    //                 .equalTo(friendMail)
    //                 .limitToFirst(1)
    //                 .once('value', snapshot => {
    //                     let fid = Object.keys(snapshot.val())[0]
    //                     Users.child(id).child('/friendList').child(fid).update({
    //                         roomKey,
    //                         kind: 'A'
    //                     })
    //                 })
    //         })

    //     await Users
    //         .orderByChild("email")
    //         .equalTo(friendMail)
    //         .limitToFirst(1)
    //         .once('value', async snapshot => {
    //             let id = Object.keys(snapshot.val())[0]
    //             await Users.child(id).child('/friendList')
    //                 .orderByChild('email')
    //                 .equalTo(loginUser.email)
    //                 .limitToFirst(1)
    //                 .once('value', snapshot => {
    //                     let fid = Object.keys(snapshot.val())[0]
    //                     Users.child(id).child('/friendList').child(fid).update({
    //                         roomKey,
    //                         kind: 'B'
    //                     })
    //                 })
    //         })
    // }
    // console.log('haveRoom => ' + haveRoom)
}

exports.getLoginUserAndFriendList = function (req, res) {
    const loginUser = req.session.loginUser

    Users
        .orderByChild("email")
        .equalTo(loginUser.email)
        .limitToFirst(1)
        .once('value', snapshot => {
            snapshot.forEach(async loginUser => {
                let friendList = loginUser.child('friendList').val()

                friendList = await Object.values(friendList)
                res.json({ loginUser, friendList })
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