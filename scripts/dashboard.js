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

window.onload = function() {
    var ctx = $("#ratingChart").get(0).getContext("2d");
    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                fillColor: "rgba(225,53,9,1)",
                strokeColor: "rgba(220,220,220,0)",
                pointColor: "rgba(220,220,220,0)",
                pointStrokeColor: "rgba(220,220,220,0)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,0)",
                data: []
            },
            {
                label: "Ranking",
                fillColor: "rgba(225,53,9,0.0)",
                strokeColor: "rgba(255,255,255,1)",
                pointColor: "rgba(255,255,255,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            }
        ]
    }
    var oldLen = data.labels.length;
    for (var i = 0; i < oldLen; i++) {
        data.labels.splice(i * 2 + 1, 0, "");
    }
    var lastVal = 1000;
    for (var i = 0; i < data.labels.length; i++) {
        var d = Math.floor((Math.random() * 100) - 20);
        lastVal += d;
        data.datasets[1].data.push(lastVal);
    }
    for (var i = 0; i < data.labels.length; i++) {
        data.datasets[0].data.push(1600);
    }
    document.getElementById("rank").innerHTML = "RANK<br>" + lastVal;
    var chart = new Chart(ctx).Line(data, {
        showTooltips: false
    });
};