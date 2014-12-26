// when DOM is ready
$(document).ready(function() {
	 $('#loginBtn').on('click', tryLogin);
});

function tryLogin(event) {
	event.preventDefault();
	var usernameText = $("#username").val();
	var passText = $("#password").val();
	console.log("trying login! with " + usernameText + ", pass: " + passText);

	var creds = {
		"username": usernameText,
		"password": passText
	};

	$.ajax({
    type: 'POST',
    data: creds,
    url: '/users/login',
    dataType: 'JSON'
	}).done(function(response) {
		console.log("GOT RESPONSE!");
	});
}