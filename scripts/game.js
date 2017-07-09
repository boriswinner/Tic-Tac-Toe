"use strict"
var gCanvas = document.getElementById('cgame');
var gContext = gCanvas.getContext('2d');
var gLog = document.getElementById('log');
gLog.innerHTML = 'Loading...';
var gameStatus = [[0,0,0],[0,0,0],[0,0,0]];
var cross;
var dot;
var win = 0;
var after_erase = 0;

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function loadGame(){
	cross = document.getElementById('cross');
	cross.onload = function(){
		dot = document.getElementById('dot');
		dot.onload = function(){
			gLog.innerHTML = 'Loaded!';
		}
	}	
	createOnClickListener();
}

function eraseGame(){
	gameStatus = [[0,0,0],[0,0,0],[0,0,0]];
	win = 0;
	after_erase = 1;
}

var reDraw = function(){
	gContext.fillStyle = 'rgb(255,153,102)';
	gContext.fillRect(0,0,gCanvas.width,gCanvas.height);
	gContext.beginPath();
	for (var j = 0; j < 129*3; j += 129	){
		for (var i = 0; i < 129*3; i += 129){
			gContext.moveTo(129+i, 0+j);
			gContext.lineTo(129+i, 129+j);
			gContext.lineTo(0+i, 129+j);
		}		
	}
	gContext.strokeStyle = '#000000';
	gContext.stroke();
	for (var x in gameStatus){
		for (var y in gameStatus[x]){
			if (gameStatus[x][y] === 1){
				gContext.drawImage(cross,129*x,129*y);
			} else if (gameStatus[x][y] === 2){
				gContext.drawImage(dot,129*x,129*y);
			}
		}
	}
	if (win > 0){
		gContext.font = "30px Arial";
		gContext.fillStyle = 'rgb(255, 128, 0)';
		gContext.fillRect(0,0,387,100);		
		if (win === 1){
			gContext.strokeText("You win!",10,50); 
		} else if (win === 2){
			gContext.strokeText("Computer Wins!",10,50); 			
		} else {
			gContext.strokeText("Draw!",10,50); 
		}
		eraseGame();
	}	
}

var createOnClickListener = function(){
	gCanvas.addEventListener('click', function(event) {
			if (after_erase){
				after_erase = 0;
				reDraw();
				return;
			}		
			var x = event.pageX - this.offsetLeft;
			var y = event.pageY- this.offsetTop;
			if (gameStatus[Math.floor(x / 129)][Math.floor(y / 129)] === 0){
				gameStatus[Math.floor(x / 129)][Math.floor(y / 129)] = 1;
			} else {
				gContext.font = "30px Arial";
				gContext.fillStyle = 'rgb(255, 128, 0)';
				gContext.fillRect(0,0,387,100);		
				gContext.strokeText("You are doing it wrong!",10,50); 
				return;
			}
			reDraw();
			win = checkWin();
			if (!win) moveAI();
			reDraw();
		}, false);	
}

var checkWin = function(){
	var win = 0;
	var freeCnt = 0;
	for (var x = 0; x < 3; ++x){
		if ((gameStatus[x][0] === gameStatus[x][1]) && (gameStatus[x][1] === gameStatus[x][2])){
			 if (gameStatus[x][0] != 0) win = gameStatus[x][0];
		}
	}	
	for (var y = 0; y < 3; ++y){
		if ((gameStatus[0][y] === gameStatus[1][y]) && (gameStatus[1][y] === gameStatus[2][y])){
			 if (gameStatus[0][y] != 0) win = gameStatus[0][y];
		}		
	}
	if ((gameStatus[0][0] == gameStatus[1][1]) && (gameStatus[1][1] == gameStatus[2][2])){
		if (gameStatus[0][0] != 0) win = gameStatus[0][0];
	}
	if ((gameStatus[0][2] == gameStatus[1][1]) && (gameStatus[1][1] == gameStatus[2][0])){
		if (gameStatus[0][2] != 0) win = gameStatus[0][2];
	}	
	for (var x in gameStatus){
		for (var y in gameStatus[x]){
			if (gameStatus[x][y] === 0) freeCnt++;
		}
	}
	if (freeCnt === 0) win = 3;
	return win;
}

var moveAI = function(){
	var freeCnt = 0;
	for (var x in gameStatus){
		for (var y in gameStatus[x]){
			if (gameStatus[x][y] === 0) freeCnt++;
		}
	}
	if (freeCnt === 0) return;
	var p;
	do {p = randomInteger(0,8);} while (gameStatus[Math.floor(p/3)][Math.floor(p%3)] > 0);	
	gameStatus[Math.floor(p/3)][Math.floor(p%3)] = 2;
	reDraw;
	win = checkWin();
}

loadGame();
reDraw();
