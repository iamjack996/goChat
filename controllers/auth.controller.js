const express = require('express');
const app = express();

exports.auth = function (req, res) {
    res.render('index');
};

exports.test = function (req, res) {
    res.render('test');
};