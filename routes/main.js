const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
// const { cookieSecret } = require('./../config/config')

module.exports = (app) => {

  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    // .use(cookieParser(cookieSecret))
    .use('/chat', require('./chatRouter'))
    .use('/auth', require('./authRouter'))


    // Adminator
}