var express = require('express');
var router = express.Router();

router.get('/', showLobby);
router.get('/join', handleJoin);

function showLobby(req, res) {
	//var userdata = req.session.userdata;
	res.render('lobby');
}

function handleJoin(req, res) {
	console.log("got join lobby req");
	res.send("You're in!");
}

module.exports = router;
