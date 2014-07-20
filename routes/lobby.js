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

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(55512);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});



//----------------------------------------------------------------------------------------------------------------


app.get('/getlist', function (req, res) { 
	gameCol.findOne({'_id' : req.session.GameID}, function (err, game) {
		if (game == null) 
			res.send("Invalid session");
		else
			res.send(game.Lobby)
	});
});
app.post ('/join', function(req,res) {
	gameCol.findOne({'Lobby' : {$exists:true}, $where:'this.Lobby.length < 4'}, function (err, user) {
		console.log(user);
		if (user == null) 
			createNewGame(req, res);
		else if (user != null) {
			addToGame(user, req, res);
			req.session.GameID = user._id;
		}
	});
});

function addToGame (user, req, res) {
	gameCol.update({ '_id': user._id}, { $push: { 'Lobby': req.session.userid} }, function (err, user) {
		console.log(user);
		res.send("User added to game");
		/*io.on('connect', function (socket) {
			socket.emit('lobbyUpdate', { data: user.Lobby, gameid: user._id});
			console.log("This is a message from socket to an old game" + user.Lobby);
		});*/
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
		/*io.on('connect', function (socket) {
			socket.emit('lobbyUpdate', { data: user.Lobby, gameid: user._id});
					console.log("This is a message from socket to an new game" + user.Lobby);
		});*/
	});
}




module.exports = app;
