var express = require('express');
var router = express.Router();

router.get('/', showLobby);
router.get('/join', handleJoin);

function showLobby(req, res) {
	//var userdata = req.session.userdata;
	res.render('lobby');
}

function handleJoin(req, res) {
	var io = req.io;
	console.log("got join lobby req");
	io.on('connection', function (socket) {
		console.log("Got socket connection!");
	  io.emit('status', { status: "rekt" });
	});
	res.send("");
}

module.exports = router;
