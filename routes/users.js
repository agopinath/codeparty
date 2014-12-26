var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/login', function(req, res) {
	var credentials = req.body;
	console.log("@@@Trying login w/ username: " + credentials.username);
});

module.exports = router;
