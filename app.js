var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// for db
var mongo = require('mongoskin'),
	db = mongo.db('mongodb://localhost:27017/codeparty', {native_parser:true});
// for cookie management
var expressSession = require('express-session'),
	MongoStore = require('connect-mongo')(expressSession);

//setup routes here
var routes = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var lobby = require('./routes/lobby');

var app = express();

// for Socket.IO
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.httpserver = server;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
     secret: 'aasdfasdf23sdff',
     store: new MongoStore({
	   db: 'codeparty',
	   host: 'localhost',
	   port: 27017
	 }),
     resave: false,
     saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	req.db = db;
	req.io = io;
	next();
});
app.use('/', routes);
app.use('/users', users);

app.use('/dashboard', requireAuth, dashboard);
app.use('/lobby', requireAuth, lobby);

function requireAuth(req, res, next) {
	// if req.session.userdata is set (aka user has logged in), then user is authenticated
	// if not, then redirect to login page
	if(req.session.userdata) {
		next();
	} else {
		res.redirect(401, '/');
	}
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
