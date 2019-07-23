const express = require('express')
const consola = require('consola')
const bcrypt = require('bcrypt')
const saltRounds = 10
const app = express()
const Web3 = require('web3')

const ethereumUri = "https://mainnet.infura.io/v3/355a5c47df7d4c2ba45a63fe6e271562";



const DB = require('../models/DB_config')
const Users = DB.ref('/User')

exports.auth = async function (req, res) {

    var a = 1

    let tt = async () => {
        await setTimeout(() => {
            a += 33
            return a
            // console.log(a)
        }, 3000)
    }

    tt()

    console.log(a)


    // let a = 1

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


    // let a = 1

    // async function echo() {
    //     setTimeout(() => {
    //         a += 49
    //     }, 3000)
    //     return await a
    //     // console.log(await a)
    // }

    // echo().then((data) => {
    //     console.log(data)
    // })



    // function resolveAfter2Seconds(x) {
    //     return new Promise(resolve => {
    //         setTimeout(() => {
    //             resolve(x+=100);
    //             // x+=100
    //         }, 2000);
    //         // return x
    //     });
    // }

    // async function add1(x) {
    //     const a = await resolveAfter2Seconds(20);
    //     const b = await resolveAfter2Seconds(30);
    //     return x + a + b;
    // }

    // add1(10).then(v => {
    //     console.log(v);  // prints 60 after 4 seconds.
    // });



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
            snapshot.forEach(child => {
                userInfo = child.val()
                userInfo.userKey = child.key
            })

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
                    // consola.success(req.session.loginUser)
                    res.redirect('/chat')
                }
            } catch (e) {
                console.log(e)
            }
        })
};

exports.test = async function (req, res) {
    var _web3 = new Web3.providers.HttpProvider(ethereumUri); // 引入web3
    var web3 = new Web3(_web3);

    var gasPrice = await web3.eth.getGasPrice()
    // 1000000000~5000000000 (3~5Gwei)

    var hexGasPrice = await web3.utils.numberToHex(parseInt(parseInt(gasPrice)))
    res.send(gasPrice + '/' + hexGasPrice)
    // res.render('test')
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