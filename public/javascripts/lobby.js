$(document).ready(function() {
	//joinLobby();
	joinLobbyRoom();
});

/*function joinLobby() {
	$.ajax({
		type: 'GET',
		url: '/lobby/join',
	}).done(function(response) {
		console.log('@@@@ SENDING REQ');
		joinLobbyRoom();
	});
}
window.onbeforeunload = function () {
	socket.disconnect();
  return 'Your content has not been properly saved yet!';
};*/
function joinLobbyRoom() {
	console.log("joining lobby room");
	var socket = io.connect('http://localhost', {'forceNew':true });
	socket.on('connect', function() {
		socket.on('updateusers', function(memberlist) {
		  console.log('received room memberlist:');
		  console.log(memberlist);
		  updateLobbyTable(memberlist);
		});
		
		console.log('adding myself to users');
		socket.emit('adduser');
	});
}

function updateLobbyTable(memberlist) {
	$("#lobbyTable tbody tr").remove();
	var ctr = 1;
	// populate all current members in room
	for(var username in memberlist) {
			var userinfo = memberlist[username];
			$("#lobbyTable").append(
				"<tr><td>" + ctr + "</td><td>" + userinfo.fullname +
			  "</td><td>" + userinfo.username +"</td><td>" + userinfo.location + "</td></tr>");
			ctr++;
	}

	// add in empty rows as placeholders for members yet to join
	for(var i = ctr; i <= 4; i++)
			$("#lobbyTable").append("<tr><td>" + i + "</td><td>---</td><td>---</td><td>---</td></tr>");
}