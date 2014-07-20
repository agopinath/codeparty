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


app.get('/getlist', function (req, res) { 
	gameCol.findOne({'_id' : req.session.GameID}, function (err, game) {
		if (game == null) 
			res.send("Invalid session");
		else
			res.send(game.NameLobby)
	});
});
app.post ('/join', function(req,res) {
	gameCol.findOne({'Lobby' : {$exists:true}, $where:'this.Lobby.length <= 4'}, function (err, user) {
		console.log(user);
		if (user == null)  {
			createNewGame(req, res);
		}
		else if (user != null) {
			addToGame(user, req, res);
			req.session.GameID = user._id;
		}
	});
});

function addToGame (user, req, res) {
	console.log("IN ADD TO GAME");
	console.log(user);
	var newuser = user;
	gameCol.update({ '_id': newuser._id}, { $push: { 'Lobby': req.session.userid, 'NameLobby' : req.session.nombre} }, function (err, user) {
		console.log(user);
	});
	gameCol.findOne({ '_id': newuser._id}, function (err, newser) {
		console.log(newser);
		res.send("User added to game");
		console.log(newser.Lobby);
		if ((newser.Lobby.indexOf(req.session.userid) + 1) > 2) 
			req.session.TeamNumber = 1;
		else 
			req.session.TeamNumber = 0;
	});
}

function createNewGame (req, res) {
	var newgame = new gameCol ({
		Lobby: [req.session.userid],
		NameLobby: [req.session.nombre],
		Teams: [],
		MatchOver :  false
	});
	newgame.save(function(err, user) {
		req.session.GameID = user._id;
		res.send("New game created.");
		if ((user.Lobby.indexOf(req.session.userid) + 1) > 2) 
			req.session.TeamNumber = 1;
		else 
			req.session.TeamNumber = 0;
		console.log("THIS SHIT IS IN THE LOBBY");
		console.log(req.session.TeamNumber);
	});
}




module.exports = app;
