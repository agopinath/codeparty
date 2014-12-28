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
	socket.on('status', function(data) {
		console.log("Got status: " + data.status);
	});
}