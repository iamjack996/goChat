const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
// const { cookieSecret } = require('./../config/config')

const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gochat-c297e.firebaseio.com/"
});

const DB = admin.database()



module.exports = (app) => {

  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    // .use(cookieParser(cookieSecret))
    .use('/chat', require('./chatRouter'))
    .use('/auth', require('./authRouter'))


    // Adminator
}