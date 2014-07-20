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




app.get('/create', function(req ,res ){ 
	gameCol.findOne({'_id' : req.session.GameID}, function (err, gameset) {
		if (req.session.userid == gameset.Lobby[0]) {
			var team1 = {
				Points: 40,
				Code: [],
				isFinished: false,
				Turn: 0,
				Member: [{ID: gameset.Lobby[0]}, {ID: gameset.Lobby[1]}]
			};
			var team2 = {
				Points: 40,
				Code: [],
				isFinished: false,
				Turn: 0,
				Member: [{ID: gameset.Lobby[2]}, {ID: gameset.Lobby[3]}]
			};
			removePoints(gameset);
		}
		res.send(gameset._id);


		io.on('connection', function (socket) {
  			socket.emit('code', { data: 'world' });
		});
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