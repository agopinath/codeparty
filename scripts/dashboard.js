function joinLobby() {
	$.ajax({
		type: "POST",
		url: "http://5d9ca87.ngrok.com/lobby/join",
		success:function(data) {
			console.log(data);
			location.href = "./lobby.html";
		},
		xhrFields: {withCredentials: true},
		error:function(){
			console.log("ERROR");
		}
	});
}