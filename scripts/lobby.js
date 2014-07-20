

function joinLobby() {
	$.ajax({
		type: "POST",
		url: "http://5d9ca87.ngrok.com/lobby/join",
		success:function(data) {
			if(data == "true") {
				console.log("Logged in successfully!!");
				location.href = "./dashboard.html";
			}
			else {
				alert('Wrong username');
			}
		},
		error:function(){
			console.log("ERROR");
		}
	});
}