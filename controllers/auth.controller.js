const express = require('express');
const app = express();

exports.auth = function (req, res) {
    res.render('auth/index');
};

exports.login = function (req, res) {
    res.send(req.body);
};

exports.test = function (req, res) {
    res.render('test');
};