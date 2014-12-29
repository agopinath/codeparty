var express = require('express');
var router = express.Router();

router.get('/', showLobby);

// to store list of members in room
var roomMembers = {};
// list of rooms (currently just one, need to add dynamic creation later)
var rooms = ['Lobby'];

function showLobby(req, res) {
	handleJoin(req, res);
	res.render('lobby');
}

function handleJoin(req, res) {
	console.log("got join lobby req");
	var io = req.io;
	console.log('$$$$$$$$: ' + req.session.lobbyConnectionInitiated);
	// CODE FOR LOBBY FUNCTIONALITY ADAPTED FROM http://stackoverflow.com/a/19158647
	if(typeof req.session.lobbyConnectionInitiated === 'undefined') {
		io.sockets.on('connection', function(socket) {
			socket.once('adduser', function() {
				var me = req.session.userdata;
				// have socket join room
				socket.join('Lobby');
				socket.room = 'Lobby';
				// store userinfo in room's memberlist
				var username = me['username'];
				socket.username = username;
				roomMembers[username] = {
					'username': username,
					'fullname': me['fullname'],
					'location': me['location']
				};
				console.log("Got lobby connection from: " + socket.username);
				req.session.lobbyConnectionInitiated = [' '];
				console.log('###########: ' + req.session.lobbyConnectionInitiated);
				// send list of ppl in room to everyone in room to update lobby table
				io.to('Lobby').emit('updateusers', roomMembers);
			});
			
			// remove member from room, and notify of update to member list
			socket.on('disconnect', function() {
				delete roomMembers[socket.username];
				io.sockets.emit('updateusers', roomMembers);
				socket.leave(socket.room);
			});
		});
	}
	//res.send("");
}

module.exports = router;
