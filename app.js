express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , me = require('./routes/me')
  , lobby = require('./routes/lobby')
  , you = require('./routes/you')
  , game = require ('./routes/game')
  , cors = require('cors')
  , http = require('http')
  , path = require('path');
var session = require('express-session');
var path = require('path');
var email = require('emailjs');
var favicon = require('static-favicon');
var logger = require('morgan');
cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app = express();


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(cors());
app.use(express.cookieParser());
app.use(express.session({secret: "This is a secret"}));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',      req.headers.origin);
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });






 mongoose = require('mongoose');
	mongoose.connect('mongodb://127.0.0.1:27017/mydb');
 db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {});
 Schema = mongoose.Schema;
 person = new Schema ({
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
  userCol = mongoose.model('angelhacksaccounts', person);

game = new Schema ({
  Lobby: [],
  NameLobby: [],
  Teams: [{
    Points: Number,
    Code: [],
    isFinished: Boolean,
    Turn: Number,
    Members: [{
      ID: String,
      Name: String
    }]
  }],
  MatchOver: Boolean
});
gameCol = mongoose.model('angelhacksgame', game);


mongoose.connect('mongodb://127.0.0.1:27017/mydb');


router = express();




app.configure('development', function(){
  app.use(express.errorHandler());
});

app.use('/', routes);
app.use('/user', user);
app.use('/me', me);
app.use('/lobby', lobby);
app.use('/you', you);
app.use('/game', game);
//app.get('/users', user.list);
allowCrossDomain = function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
};

//...
// The session "visitCount"
app.get('/zavala/style', function(req, res, next) {
		res.header('Access-Control-Allow-Credentials', 'true');
        req.session.visitCount = req.session.visitCount ? req.session.visitCount + 1 : 1;
        res.send('You have visited this page ' + req.session.visitCount + ' times');
          req.session.save()
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
