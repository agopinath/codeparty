var express = require('express');
var router = express.Router();

router.get('/', showLobby);
router.get('/join', handleJoin);

// to store list of members in room
var roomMembers = {};
// list of rooms (currently just one, need to add dynamic creation later)
var rooms = ['Lobby'];

function showLobby(req, res) {
	res.render('lobby');
}

function handleJoin(req, res) {
	var io = req.io;
	console.log("got join lobby req");
	var userdata = req.session.userdata;
	// CODE FOR LOBBY FUNCTIONALITY ADAPTED FROM http://stackoverflow.com/a/19158647
	io.sockets.on('connection', function(socket) {
		console.log("Got lobby connection!");
		socket.on('adduser', function() {
			// have socket join room
			socket.join('Lobby');
			// store userinfo in room's memberlist
			var username = userdata['username'];
			roomMembers[username] = {
				'username': username,
				'fullname': userdata['fullname'],
				'location': userdata['location']
			};

			// send list of ppl in room to everyone in room to update lobby table
			io.to('Lobby').emit('updateusers', roomMembers);
		});

		/*socket.on('create', function(room) {
			rooms.push(room);
			socket.emit('updaterooms', rooms, socket.room);
		});

		socket.on('sendchat', function(data) {
			io.sockets["in"](socket.room).emit('updatechat', socket.username, data);
		});

		socket.on('switchRoom', function(newroom) {
			var oldroom;
			oldroom = socket.room;
			socket.leave(socket.room);
			socket.join(newroom);
			socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
			socket.broadcast.to(oldroom).emit('updatechat', 'SERVER', socket.username + ' has left this room');
			socket.room = newroom;
			socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + ' has joined this room');
			socket.emit('updaterooms', rooms, newroom);
		});*/
		
		// remove member from room, and notify of update to member list
		socket.on('disconnect', function() {
			delete roomMembers[socket.username];
			io.sockets.emit('updateusers', roomMembers);
			socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
			socket.leave(socket.room);
		});
 	});

	res.send("");
}

module.exports = router;
