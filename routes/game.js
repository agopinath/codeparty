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

// Done with session stuff, this was copied and pasted from a blog. No idea if it works.

io.on('connection', function(socket) {
    socket.on('linechange', function(err, data) {
        
    });
});



