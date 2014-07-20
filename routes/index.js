var express = require('express');
var app = express();
var mongoose = require('mongoose');
	mongoose.connect('mongodb://127.0.0.1:27017/inqora');
var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {});
var Schema = mongoose.Schema;
var email = require('emailjs');

var cookieParser = require('cookie-parser');
app.use(express.cookieParser());
app.use(express.session({secret: "This is a secret"}));



var person = new Schema ({
	Type: String,
	Lol: String
});
var userCol = mongoose.model('accs', person);
mongoose.connect('mongodb://127.0.0.1:27017/inqora');




app.get('/zav/:omg', function(req, res) {
  res.send("HEY " + req.params.omg)
});

app.get('/name/:name', function(req, res){
    req.session.value = req.params.name;
    res.send("<a href='/name'>GO</a>");
});
app.get('/name', function(req, res){
    res.send(req.session.value);
});
app.get('/logout', function(req,res ) {
	req.session.destroy();
	res.send("Session destroyed");
});

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(12312);

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.emit('p1', 'pritasasdashvi');
});


module.exports = app;
