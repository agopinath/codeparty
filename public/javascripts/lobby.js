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
	
}