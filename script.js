$(document).ready(function(){
	
	//Website Updates Per Second. Usually 60;
	var websiteUPS=60;
	var firstUpdate=false;
	
	var averageResponseRate1=0;
	var averageResponseRateTimes1=0;
	
	var averageResponseRate2=0;
	var averageResponseRateTimes2=0;
	
	var ups=0;
	var canSave = false;
	var canLoad = true;
	
	function player(id, color) {
		this.id = id;
		this.color = color;
		this.x = 0;
		this.y = 0;
	}
	
	var players = [];
	var clientID = -1;
	
	var width = $("#container").width();
	var height = $("#container").height();
	var keys = [];
	
	//JQuery
	$(window).keydown(function(e){
		keys[e.which]=1; 
		//console.log(e.which);
	});
	$(window).keyup(function(e){
		keys[e.which]=0;
	});
	
	/*
	$("#playerCreator").click(function(e){
		createPlayer();
	})/**/
	
	window.onbeforeunload = deletePlayer;
	
	function deletePlayer(){
		var url = "deletePlayer.php";
		var data =
		"id=" + clientID;
		xmlRequestPOST(url, data, false, function(xhttp){console.log(xhttp.responseText);});
		return null;
	}
	
	function updateVars(){
		width = $("#container").width();
		height = $("#container").height();
	}
	
	function createPlayer(){
		var id = 0;
		var passes;
		var done = false;
		for(var i = 0; i <players.length;i++){
			passes = 0;
			for(var j = 0; j <players.length;j++){
				if(players[j].id != i){
					passes++;
				}
			}
			if(passes == players.length){
				id = i;
				done = true;
				break;
			}
		}
		if(!done && players.length !=0){
			id = players.length;
		}
		
		
		clientID = id;
		
		var color1 = randInt(0,255);
		var color2 = randInt(0,255);
		var color3 = randInt(0,255);
		
		var color =  "rgb(" + color1 + "," + color2 + "," + color3 + ")";
		
		var Player = new player(id, color);
		
		players.push(Player);
		
		var playerDiv = document.createElement('div');
		
		playerDiv.className = "box";
		playerDiv.id = id;
		playerDiv.style.backgroundColor = Player.color;
		document.getElementById("container").appendChild(playerDiv);
		
		var url = "createPlayer.php";
		var data = 
		"id=" + Player.id +
		"&color=" + Player.color +
		"&x=" + Player.x +
		"&y=" + Player.y;
		
		xmlRequestPOST(url, data, true, function(xhttp){
			console.log(xhttp.responseText);
			canSave = true;
		});
	}
	
	function addPlayer(id){
		var player;
		for(var i = 0; i < players.length;i++){
			if(players[i].id == id){player = i;}
		}
		var playerDiv = document.createElement('div');
		
		playerDiv.className = "box";
		playerDiv.id = id;
		playerDiv.style.backgroundColor = players[player].color;
		document.getElementById("container").appendChild(playerDiv);
	}
	
	function savePlayer(id){
		canSave = false;
		var url = "savePlayer.php";
		var data = 
		"id=" + id
		+ "&leftArrow=" + keys[37] 
		+ "&upArrow=" + keys[38]
		+ "&rightArrow=" + keys[39] 
		+ "&downArrow=" + keys[40];
		averageResponseRateTimes1++;
		var time= new Date().getTime();
		xmlRequestPOST(url, data, true, function(xhttp){
			averageResponseRate1+=new Date().getTime() - time;
			console.log();
			canSave = true;
		});
	}
	
	function loadPlayers(firstUp){
		canLoad = false;
		var url = "loadPlayers.php";
		averageResponseRateTimes2++;
		var time= new Date().getTime();
		xmlRequestPOST(url, null, firstUp, function(xhttp){
			averageResponseRate2+=new Date().getTime() - time;
			try{
				players = JSON.parse(xhttp.responseText);
				console.log();
			}
			catch(err){
				console.error("Could Not Parse Players Array: " + xhttp.responseText)
			}
			canLoad = true;
			for(var i = 0; i < $("#container").children().length; i++){
				if(players.length == 0){
					document.getElementById("container").childNodes[i].remove();
					continue;
				}
				for(var j=0;j<(players.length);j++){
					if(document.getElementById("container").childNodes[i].id == players[j].id){
						break;
					}
					if(j == players.length-1){
						document.getElementById("container").childNodes[i].remove();
					}
				}
			}
		});
	}
	
	function movePlayers(){
		for(i in players){
			try{
				document.getElementById(players[i].id).style.left = players[i].x;
				document.getElementById(players[i].id).style.top = players[i].y;
				}catch(err){
				addPlayer(players[i].id);
				movePlayers();
			}
			
		}
	}
	
	//AJAX call function
	function xmlRequestPOST(url, data, async, cfunction){
		var xhttp 
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				cfunction(xhttp);
			}
		};
		xhttp.open("POST", url, async);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(data);
		/*if(data!=null){
			xhttp.send(data)
			}else{
			xhttp.send()
		};*/
	}
	
	//Updates the website for javascript functions to work correctly
	function update(){
		ups++;
		updateVars();
		if((keys[37] || keys[38] || keys[39] || keys[40]) && canSave){savePlayer(clientID)};
		if(canLoad){loadPlayers(firstUpdate);}
		if(players != []){movePlayers();}
		
		if(ups%600==0) {
			console.log((Math.floor(averageResponseRate1/averageResponseRateTimes1*1000)/1000) + " | " + (Math.floor(averageResponseRate2/averageResponseRateTimes2*1000)/1000));
			averageResponseRate1=0;
			averageResponseRate2=0;
			averageResponseRateTimes1=0;
			averageResponseRateTimes2=0;
		}
		if(!firstUpdate){createPlayer()};
		firstUpdate=true;
	}
	
	//This function runs the updates, and if needed, renderings in this file.
	//Does not and should not be changed unless a Render(); function is added.
	function run(){
		requestAnimFrame(function(){
			run();
		});
		update();
	}
	run();
});
//Returns a function every x frames per second
//fps depends on computer and browser
//usually 60fps. if not, 30fps.
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback){
		window.setTimeout(callback, 1000 / 60);
		console.log("RequestAnimationFrame: Failed")
	};
})();

function randInt(min, max){
	var int = Math.floor(Math.random() * (max - min + 1)) + min;
	return int;
};				