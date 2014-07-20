var app = express();
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',      req.headers.origin);
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });

app.use(express.cookieParser());
app.use(express.session({secret: "This is a secret"}));


//----------------------------------------------------------------------------------------------------------------


app.get('/logoff', function(req,res) {
	req.session.destroy();
	res.send("Log off");
});	



app.get('/logout', function(req,res ) {
	req.session.destroy();
	res.send("Session destroyed");
});



app.get('/zav/:omg', function(req, res) {
  res.send("HEY " + req.params.omg)
});

app.get('/name/:name', function(req, res){
		res.header('Access-Control-Allow-Credentials', 'true');
    req.session.value = req.params.name;
    res.send("<a href='/name'>GO</a>");
});
app.get('/name', function(req, res){
    res.send(req.session.value);
   });
 app.get('/name/:add', function(req,res) {
	req.session.name = req.params.add;
	res.send(req.session.name);
});

app.get('/findmyname', function(req,res) {
	res.send(req.session.name);
});
//----------------------------------------------------------------------------------------------------------------


var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(12312);


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.emit('p1', {bob: 'prithvi'});
});

module.exports = app;
