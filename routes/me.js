var express = require('express');
var app = express();
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',      req.headers.origin);
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
var allowCrossDomain = function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
};
var mongoose = require('mongoose');
	mongoose.connect('mongodb://127.0.0.1:27017/mydb');
var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {});
var Schema = mongoose.Schema;

var cookieParser = require('cookie-parser');
app.use(express.cookieParser());
app.use(express.session({secret: "This is a secret"}));



var person = new Schema ({
	Name: String,
	Username: String,
	LinesWritten: Number,
	PeopleICodeWith: [],
	Points: Number,
	AverageLineTime: Number,
	AverageEditTime: Number,
	Age: Number,
	Bio: String,
	Location: String
});
var userCol = mongoose.model('angelaccs', person);
mongoose.connect('mongodb://127.0.0.1:27017/mydb');




module.exports = app;
