$(document).ready(function(){
	
	var possibleChars = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","K","L","M","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	
	//Website Updates Per Second. Usually 60;
	var websiteUPS=60;
	var firstUpdate=false;
	
	var ups=0;
	var canSave = false;
	var canLoad = true;
	
	/*
	* This is intended to be more of a template than actually used.
	* Helps explain what parts there are to the player and what they hold
	*/
	function player(id, color) {
		this.playerHashID = id; // The Hash always has 10 characters and is generated on the Sever
		this.color = color;
		this.x = 0;
		this.y = 0;
	}
	
	var clientID = -1;
	var clientHash = generateHash(5);
	
	var players = [];
	
	var width = $("#container").width();
	var height = $("#container").height();
	var keys = [];
	
	// Init of keys
	keys[37] = 0
	keys[38] = 0
	keys[39] = 0
	keys[40] = 0

	window.onbeforeunload = deletePlayer;
	
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
	
	function generateHash(length) {
		var result = "";
		for(var i = 0; i < length; i++){
			result += possibleChars[randInt(0,36)];
		}
		return result;
	}	
	
	function deletePlayer(){
		var url = "deletePlayer.php";
		var data = 
		"clientHash=" + clientHash;
		
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
		
		var url = "createPlayer.php";
		var data =
		"clientHash=" + clientHash +
		"&color=" + Player.color +
		"&x=" + Player.x +
		"&y=" + Player.y;
		
		
		xmlRequestPOST(url, data, true, function(xhttp){
			canSave = true;
			console.log(xhttp.responseText);
			loadPlayers(false);
		});
	}
	
	function addPlayer(playerHashID){
		var player;
		for(var i = 0; i < players.length;i++){
			if(players[i].playerHashID == playerHashID){player = i;}
		}
		var playerDiv = document.createElement('div');
		
		playerDiv.className = "box";
		playerDiv.id = playerHashID;
		playerDiv.style.backgroundColor = players[player].color;
		document.getElementById("container").appendChild(playerDiv);
	}
	
	function savePlayer(){
		canSave = false;
		var url = "savePlayer.php";
		var data = 
		"clientHash=" + clientHash
		+ "&leftArrow=" + keys[37] 
		+ "&upArrow=" + keys[38]
		+ "&rightArrow=" + keys[39] 
		+ "&downArrow=" + keys[40];
		xmlRequestPOST(url, data, false, function(xhttp){
			canSave = true;
			console.log(xhttp.responseText);
		});
	}
	
	function loadPlayers(firstUp){
		canLoad = false;
		var url = "loadPlayers.php";
		var time= new Date().getTime();
		xmlRequestPOST(url, null, firstUp, function(xhttp){
			try{
				players = JSON.parse(xhttp.responseText);
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
				for(var j = 0; j < players.length; j++){
					if(document.getElementById("container").childNodes[i].id == players[j].playerHashID){
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
				document.getElementById(players[i].playerHashID).style.left = players[i].x;
				document.getElementById(players[i].playerHashID).style.top = players[i].y;
			}catch(err){
				addPlayer(players[i].playerHashID);
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
		if((keys[37] || keys[38] || keys[39] || keys[40]) && canSave){
			savePlayer();
		};
		if(canLoad){
			loadPlayers(firstUpdate);
			movePlayers();
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