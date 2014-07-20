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

var message = "";
var compilation = "";

//----------------------------------------------------------------------------------------------------------------
/*game = new Schema ({
  Lobby: [],
  NameLobby: [],
  Teams: [{
    Points: Number,
    Code: String,
    isFinished: Boolean,
    Turn: Number,
    Members: [{
      ID: String,
      Name: String
    }]
  }],
  MatchOver: Boolean
});*/
app.post('/updatecode', function(req,res) {
	console.log(req.session.GameID);
	gameCol.findOne({'_id' : req.session.GameID}, function(err, game) {
		console.log(game);
		var x = game.Teams;
		console.log(x);
		console.log(req.session.TeamNumber);
		console.log(x[req.session.TeamNumber].Code);
		 //= req.body.Code;
		gameCol.update({'_id' : req.session.GameID}, {$set : {'Teams' : x}});
	});
});

app.post('/changeturn' , function(req,res) {
	gameCol.findOne({'_id': req.session.GameID}, function(err, game) {
		var x = game.Teams;
		if (x[req.session.TeamNumber].Turn = 0)
			x[req.session.TeamNumber] = 1;
		else
			x[req.session.TeamNumber] = 0;
		gameCol.update({'_id' : req.session.GameID}, {$set: {'Teams' : x}});
	});
});

app.post('/removepoints', function(req,res) {
	message = req.body.Message;
	gameCol.findOne({'_id' : req.session.GameID}, function(req,res) {
		var x = games.Teams;
		x[req.session.TeamNumber].Points= x[req.session.TeamNumber].Points - req.body.PointsRemove;
		gameCol.update({'_id' : req.session.GameID}, {$set: {'Teams' : x}});
	});
});
app.get('/notifs', function (req,res) {
	gameCol.findOne({'_id' : req.session.GameID}, function (err, game) {
		if (game == null)
			res.send("Invalid game..???");
		else {
			console.log(game);
			console.log(req.session.TeamNumber);
			var isTurn = false;
			var code = game.Teams[req.session.TeamNumber].Code;
			var points = game.Teams[req.session.TeamNumber].Points;
			var text = message;
			message = "";
			if (req.session.TeamNumber == 1)
				var otherteamdone = game.Team[0].isFinished;
			else if (req.session.TeamNumber == 0)
				var otherteamdone = game.Team[1].isFinished;
			var errorsorsuccess = compilation;

			var membernumber = -1;
			for (var x = 0; x < game.Teams[req.session.TeamNumber]; x++) {
				if (game.Teams[req.session.TeamNumber].Members[x] == req.session.userid)
					membernumber = x;
			} 
			var turn  =  game.Teams[req.session.TeamNumber].Turn;
			if (turn != membernumber)
				isTurn = false;
			else
				isTurn = true;

			var jsonsend = {};
			jsonsend['isTurn'] = isTurn;
			jsonsend['code'] = code;
			jsonsend['points'] = points;
			jsonsend['whypointschanged'] = whypointschanged;
			jsonsend['otherteamdone'] = otherteamdone;
			jsonsend['compilationresults'] = errorsorsuccess;
			res.send(jsonsend);
		}
	});
});



app.get('/zav' , function(req,res ) {
	res.send("HEY");
});
app.get('/create', function(req ,res ){ 
	console.log("GAME ID IS BEFORE");
	console.log(req.session.GameID);
	gameCol.findOne({'_id' : req.session.GameID}, function (err, gameset) {
		if (gameset.Teams.length == 0) {
			var team1 = {
				Points: 40,
				Code: "",
				isFinished: false,
				Turn: 0,
				Member: [{ID: gameset.Lobby[0], Name: gameset.NameLobby[0]}, {ID: gameset.Lobby[1], Name: gameset.NameLobby[1]}]
			};
			var team2 = {
				Points: 40,
				Code: [],
				isFinished: false,
				Turn: 0,
				Member: [{ID: gameset.Lobby[2], Name: gameset.NameLobby[2]}, {ID: gameset.Lobby[3], Name: gameset.NameLobby[3]}]
			};
			removePoints(gameset);
		}
		res.send(gameset);

		/*io.on('connection', function (socket) {
  			socket.emit(req.session.GameID, { data: 'world' });
		});*/
	});
});


function removePoints (gameset) {
	for (var x = 0; x < gameset.Teams.length; x++) {
		for (var y =0; y < gameset.Teams[x].Member.length; y++ ) {
			userCol.update({'_id' : gameset.Teams[x].Member[y]}, {$inc: {Points: -20}}  );
		}
	}
}

module.exports = app;