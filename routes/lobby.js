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

app.post ('/join', function(req,res) {
	gameCol.findOne({'Lobby' : {$exists:true}, $where:'this.Lobby.length < 4'}, function (err, user) {
		console.log(user);
		if (user == null) 
			createNewGame(req, res);
		else if (user != null) {
			addToGame(user, req, res);
		}
	});
});

function addToGame (user, req, res) {
	gameCol.update({ '_id': user._id}, { $push: { 'Lobby': [req.session.userid]} }, function (err, user) {
		res.send("User added to game");
		req.session.GameID = user._id;
	});
}

function createNewGame (req, res) {
	var newgame = new gameCol ({
		Lobby: [req.session.userid],
		Teams: [],
		MatchOver :  false
	});
	newgame.save(function(err, user) {
		req.session.GameID = user._id;
		res.send("New game created.");
	});
}

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(55512);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connect', function (socket) {
  socket.emit('lopl', { hello: 'worlafd' });
  socket.on('my bob event', function (data) {
    console.log(data);
  });
  socket.emit('p1', {bob: 'pasrithvi'});
});


module.exports = app;
