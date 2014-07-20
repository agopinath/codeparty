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




//----------------------------------------------------------------------------------------------------------------


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
  socket.emit('p1', {bob: 'prithvi'});
});

module.exports = app;
