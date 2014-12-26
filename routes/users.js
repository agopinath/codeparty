var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/login', function(req, res) {
	var credentials = req.body;
	console.log("User: " + credentials.username + ", Pass: " + credentials.password);
});

module.exports = router;
