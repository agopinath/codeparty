$(document).ready(function() {
	joinLobby();
});

function joinLobby() {
	console.log('joining');
	$.ajax({
		type: 'GET',
		url: '/lobby/join',
	}).done(function(response) {
		joinLobbyRoom();
	});
}

function joinLobbyRoom() {
	console.log("joining lobby room");
	var socket = io.connect('http://localhost');
	socket.on('connect', function() {
		socket.on('updateusers', function(usernames) {
		  console.log('received users:');
		  console.log(usernames);
		});
		
		console.log('adding myself to users');
		socket.emit('adduser');
	});

}