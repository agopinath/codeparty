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
	userCol.findOne({'Username' : req.body.Username}, function (err, user) {
		if (user == null) 
			res.send("false");
		else if (user != null) {
			req.session.userid = user._id;
			res.send("true");
		}
	});
});



module.exports = app;
