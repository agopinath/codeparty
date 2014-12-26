var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/login', tryLogin);

function tryLogin(req, res) {
	var creds = req.body;
	console.log("@@@Trying login w/ username: " + creds.username);

	var db = req.db;
	db.collection('userlist').find({"username": creds.username}, function(err, result) {
		if(err) {
			res.send({msg: err});
			throw err;
		}

		// convert Mongoskin cursor into JS array
		result.toArray(function(err, result) {
	    if (err) {
	    	throw err;
	    	res.send({msg: err});
	    } else {
	    	console.log(result);
	    	// if search for username has at least one result, login is success
				var userExists = (Object.keys(result).length > 0);

				// handle login status
				if(userExists) {
					console.log("@@@ LOGIN SUCCESS!");
					res.send({msg: ""});
				} else {
					console.log("@@@ LOGIN FAILED :(");
					res.send({msg: "invalid credentials"});
				}
	    }
		});
	});
}

module.exports = router;
