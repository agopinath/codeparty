
// We need this in app.js i think

express = require('express'),
MemoryStore = express.session.MemoryStore,
app = express.createServer(),
sessionStore = new MemoryStore();

app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.session({store: sessionStore
                             , secret: 'secret'
                             , key: 'express.sid'}));
    app.use(function (req, res) {
        res.end('<h2>Hello, your session id is ' + req.sessionID + '</h2>');
    });
});

var Session = require('connect').middleware.session.Session;
io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['express.sid'];
        // save the session store to the data object 
        // (as required by the Session constructor)
        data.sessionStore = sessionStore;
        sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) {
                accept('Error', false);
            } else {
                // create a session object, passing data as request and our
                // just acquired session data
                data.session = new Session(data, session);
                accept(null, true);
            }
        });
    } else {
        return accept('No cookie transmitted.', false);
    }
});



//----------------------------------------------------------------------------------------------------------------


// Done with session stuff, this was copied and pasted from a blog. No idea if it works.

io.on('connection', function(socket) {
    var hs = socket.handshake;
    socket.on('linechange', function(err, data) {
        gameCol.findOne({'_id' : hs.session.gameid}, function(err, game) {
            //  IDK how to do update
	    userCol.update({'_id' : game._id}, {$inc: {Teams[hs.session.teamNumber].Points: -2}}  );
            io.emit('linechange', {
                userid: hs.session.userid,
                line: data,
                teamnumber: hs.session.teamNumber,
                points: game.Teams[hs.session.teamNumber].Points - 2
            });
        });
    });
    socket.on('submitline', function(err, data) {
        gameCol.findOne({'_id' : hs.session.gameid}, function(err, game) {
            if (data.lineNumber >= game.Teams[hs.session.teamNumber]) {
                // Do append to code array
                userCol.update({'_id' : game._id}, {$push: {Teams[hs.session.teamNumber].Code: data.code}});
            } else {
                // Do update value in code array
            }
            io.emit('submitline', {
                nextuser: // Not sure whether to put member number or user id here
                teamnumber: hs.session.teamNumber,
                linenumber: data.lineNumber,
                code: data.code
            });
        });
    });
    socket.on('submitprogram', function(err, data) {
        // Loop through each line in the Code array for the team, and append it to a String.
        var vm = require('vm');
        vm.runInThisContext(setupCode); // Run code to setup problem
        result = vm.runInThisContext(theirCode); // Run their code
        // On exception, subtract points
        // On success, add points
        io.emit('coderesult', {
            teamnumber: hs.session.teamNumber,
            result: // Success, syntax error, exception, etc.
            points: // new number of points for team
        });
    });
});



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

        for (var i = 0; i < gameset.Teams.length; i++) {
            for (var j = 0; j < gameset.Teams[i].Members.length; j++) {
                if (gameset.Teams[i].Members[j] == req.session.userid) {
                    req.session.teamNumber = i;
                    req.session.memberNumber = j;
                }
            }
        }

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
