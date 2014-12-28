var express = require('express');
var router = express.Router();

router.get('/', showDashboard);

function showDashboard(req, res) {
	var userdata = req.session.userdata;
	//var firstName = userdata.fullname.split(' ')[0];

	// render dashboard according to user info
	res.render('dashboard', 
		{'userdata': {
			'username': userdata.username,
			'fullname': userdata.fullname
		}
	});
}

module.exports = router;
