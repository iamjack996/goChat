const express = require('express');
const app = express();
const path = require('path');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// For Form Request Use BodyParser
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static('public')); // 依賴資源檔

app.listen(3000, () => { // 掛上3000 port
    console.log("Server Started. http://localhost:3000");
});

// Route
const router = require('./routes/main')
router(app)

// For Form Request Use BodyParser
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));