// when DOM is ready
$(document).ready(function() {
	 $('#loginBtn').on('click', tryLogin);
});

function tryLogin(event) {
	event.preventDefault();
	var usernameText = $('#username').val();
	if(usernameText.trim() === '') {
		alert('Please enter a username!');
		return;
	}

	var passText = $('#password').val();
	console.log('trying login! with ' + usernameText + ', pass: ' + passText);

	var creds = {
		'username': usernameText,
		'password': passText
	};

	$.ajax({
    type: 'POST',
    data: creds,
    url: '/users/login',
    dataType: 'JSON'
	}).done(function(response) {
		if(response.msg === '') {
			alert('login success!');
			window.location.href = '/dashboard';
			/*$.ajax({
		    type: 'GET',
		    url: '/dashboard',
		    dataType: 'JSON'
			});*/
		} else {
			alert('login failed: ' + response.msg);
		}
	});
}