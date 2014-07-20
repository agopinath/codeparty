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

function createMeFunction(name) {
    app.get('/' + name, function(req, res) {
        userCol.findOne({'_id' : req.body.UserID}, function(err, user) {
            if (user == null) {
                res.send("GG Account doesn't exist");
            } else {
                res.send(user[name]);
            }
        });
    });
}

createMeFunction('Name');
createMeFunction('Username');
createMeFunction('LinesWritten');
createMeFunction('PeopleICodeWith');
createMeFunction('Points');
createMeFunction('AverageLineTime');
createMeFunction('AverageEditTime');
createMeFunction('Age');
createMeFunction('Bio');
createMeFunction('Location');

/*
app.get('/lineswritten', function(req, res) {
    userCol.findOne({'_id' : req.session.userid}, function(err, user) {
        if (user == null) {
            res.send("GG Account doesn't exist");
        } else {
            res.send(user.LinesWritten);
        }
    });
});*/


module.exports = app;
