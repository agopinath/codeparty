var roomID = "";
var initGameData;
var socket;
var codeArea = document.getElementById("codeArea");
function createGame() {
	$.ajax({
		type: "GET",
		url: "http://5d9ca87.ngrok.com/game/create",
		success:function(data) {
			console.log(data);
			initGameData = data;
			init(data);
		},
		xhrFields: {withCredentials: true},
		error:function(){
			console.log("ERROR");
		}
	});
}

function init(info) {
	//sockIOInit();
    console.log("Team 1 pts: " + info.Team[0].Points);
    console.log("Team 2 pts: " + info.Team[1].Points);
    console.log("Team 2 person 2 name : " + info.Team[1].Member[1].Name);
    console.log("Team 1 person 1 name : " + info.Team[0].Member[0].Name);

    var table = document.getElementById("table-one");
    console.log("tblrlen: " + table.rows.length);

    table.innerHTML = "";
    table.rows[0].innerHTML = "<td class='username-cell' id='t1_username1'>" + info.Team[0].Member[0].Name + "</td>";
    table.rows[1].innerHTML = "<td class='username-cell' id='t1_username2'>" + info.Team[0].Member[1].Name + "</td>";
    table.rows[2].innerHTML = "<td class='username-cell' id='t2_username1'>" + info.Team[1].Member[0].Name + "</td>";
    table.rows[3].innerHTML = "<td class='username-cell' id='t2_username1'>" + info.Team[1].Member[1].Name + "</td>";

    codeArea = document.getElementById("codeArea");

    startNotifsListener();
}

function startNotifsListener() {
    (function showAlert( ) {setTimeout(function() {
    $.ajax({
            type: "GET",
            url: "http://5d9ca87.ngrok.com/game/notifs",
            success:function(data) {
                console.log("getting notifs...");
                console.log(data);
                
            },
            xhrFields: {withCredentials: true},
            error:function(){
                console.log("ERROR");
            }
        });
    }, 2000)})();
}

/*function sockIOInit() {
	socket = io.connect("http://3d495ff8.ngrok.com/game/create");
	socket.on("roomid", function(data) {
		console.log(data);
	});
}*/

function submitCode() {
    console.log("submitCode()");
    var code = codeArea.value;
    $.ajax({
        type: "POST",
        url: "http://5d9ca87.ngrok.com/game/submitcode",
        data: {
            text: code
        },
        success:function(data) {console.log("submitcode sucess");},
        xhrFields: {withCredentials: true},
        error:function(){
            console.log("ERROR");
        }
    });
}

function localEval() {
    console.log("localEval()");
    var code = codeArea.value;
    try {
        eval(code); 
    } catch (e) {
        if (e instanceof SyntaxError) {
            alert("Syntax error: " + e.message);
        } else {
            alert("Code valid! Nice!"); 
        }
    }
}

function handleCodeType(evt) {
    if (evt.which == 13 || evt.keyCode == 13) {
        console.log("enter pressed!");
        updateCode(codeArea.value);
        changeTurn();
    }
}

function updateCode(codeText) {
    var ctext = codeText;
    $.ajax({
        type: "POST",
        url: "http://5d9ca87.ngrok.com/game/updatecode",
        data: {
            text: ctext
        },
        ssuccess:function(data) {console.log("updatecode sucess");},
        xhrFields: {withCredentials: true},
        error:function(){
            console.log("ERROR");
        }
    });
}

function changeTurn() {
    $.ajax({
        type: "POST",
        url: "http://5d9ca87.ngrok.com/game/changeturn",
        data: {
            
        },
        success:function(data) {console.log("changeturn sucess");},
        xhrFields: {withCredentials: true},
        error:function(){
            console.log("ERROR");
        }
    });
}

function selectTextareaLine(tarea,lineNum) {
    lineNum--; // array starts at 0
    var lines = tarea.value.split("\n");

    // calculate start/end
    var startPos = 0, endPos = tarea.value.length;
    for(var x = 0; x < lines.length; x++) {
        if(x == lineNum) {
            break;
        }
        startPos += (lines[x].length+1);

    }

    var endPos = lines[lineNum].length+startPos;

    // do selection
    // Chrome / Firefox

    if(typeof(tarea.selectionStart) != "undefined") {
        tarea.focus();
        tarea.selectionStart = startPos;
        tarea.selectionEnd = endPos;
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) {
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}