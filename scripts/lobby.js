joinLobby();
(function showAlert( ) {setTimeout(function() {
	var lastLen = -1;
	$.ajax({
			type: "GET",
			url: "http://5d9ca87.ngrok.com/lobby/getlist",
			success:function(data) {
				console.log(data);
				dLen = 0;
				for(var jj = 0; jj < data.length; jj++) {
					if(data[jj] != null)
						dLen++;
				}
				console.log(dLen)
				if (dLen >= 4 ) {
					updateLobby(data);
					setTimeout(function(){gameStart();}, 1000);
				} else if(lastLen != data.length) {
					updateLobby(data);
					lastLen = data.length;
				}
				showAlert();
			},
			xhrFields: {withCredentials: true},
			error:function(){
				console.log("ERROR");
			}
		});
}, 2000)})();

var numRows = 4;
function updateLobby(ids) {
	console.log("updating!!: " + ids);

	var table = document.getElementById("lobby-tbl");
	console.log("tblrlen: " + table.rows.length);

	table.innerHTML = "";

	for (var i = 0; i < numRows; i++) {
		var row = table.insertRow(i);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);

		if(i < ids.length) { 
			cell1.innerHTML = ids[i];
			cell2.innerHTML = "<img src=\"./img/checkmark.png\" width='64' height='64'>";
		} else {
			cell1.innerHTML = "---";
			cell2.innerHTML = "<img src=\"./img/loading-wheel.GIF\" width='64' height='64'>";
		}
	}
}

function gameStart() {
	location.href="./game.html";
	/*$.ajax({
		type: "POST",
		url: "http://5d9ca87.ngrok.com/lobby/gameStart",
		success:function(data) {
			console.log("GAME STARTING: " + data);
			location.href="./game.html";
		},
		xhrFields: {withCredentials: true},
		error:function(){
			console.log("ERROR");
		}
	});*/
}

function joinLobby() {
	$.ajax({
		type: "POST",
		url: "http://5d9ca87.ngrok.com/lobby/join",
		success:function(data) {
			console.log(data);
		},
		xhrFields: {withCredentials: true},
		error:function(){
			console.log("ERROR");
		}
	});
}