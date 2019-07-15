const express = require('express');
const app = express();
const path = require('path');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static('public')); // 依賴資源檔

// app.listen(3000, () => { // 掛上3000 port
//     console.log("Server Started. http://localhost:3000");
// });

// session
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const session = require('express-session')
app.use(cookieParser())
app.use(flash())
// const MemoryStore = session.MemoryStore;
app.use(session({
    secret: 'recommand128BytesRandomStringrecommand128BytesRandomStringrecommand', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 60 * 1000 * 60 },
    resave: false,
    saveUninitialized: true,
    // store: new MemoryStore()
}))

app.use(function (req, res, next) {
    res.locals.loginUser = req.session.loginUser
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
})

// Route
const router = require('./routes/main')
router(app)

// For Form Request Use BodyParser
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

const chat = io.of('/chat');
chat.on('connection', function (socket) {
    console.log('Socket Connected!')
    socket.on('join-self', function (user) {
        let { email } = user
        console.log(email)
        socket.join(email, () => {
            // console.log(socket.rooms)
        })
        console.log(email + ' >>> join self.')
    })

    

})





server.listen(3000, () => { // 掛上3000 port
    console.log("Server Started. http://localhost:3000");
});