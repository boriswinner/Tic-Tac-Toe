"use strict"
var gCanvas;
var gContext;
var gLog;
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
	gCanvas = document.getElementById('cgame');
	gLog = document.getElementById('log');
	gLog.innerHTML = 'Loading...';	
	var pCanvas = document.getElementById('gParent');
	var pCanvas2 = document.getElementById('gParent2');
	var pCanvas3 = document.getElementById('gParent3');
	var h = window.innerHeight - pCanvas3.offsetHeight - pCanvas2.offsetHeight - 100;
	var size = Math.floor(Math.min(h,screen.width - 50));
	gCanvas.style.width  = size+'px';
	gCanvas.style.height = size+'px';	
	gContext = gCanvas.getContext('2d');	
	cross = new Image();
	cross.src = "img/cross.png";
	cross.onload = function(){
		dot = new Image();
		dot.src = "img/dot.png"
		dot.onload = function(){
			gLog.innerHTML = 'Loaded!';
			createOnClickListener();
			reDraw();			
		}
	}	
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
			var rect = gCanvas.getBoundingClientRect();
			var x = (event.clientX-rect.left)/(rect.right-rect.left)*gCanvas.width;
			var y = (event.clientY-rect.top)/(rect.bottom-rect.top)*gCanvas.height;
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
			 return win;
		}
	}	
	for (var y = 0; y < 3; ++y){
		if ((gameStatus[0][y] === gameStatus[1][y]) && (gameStatus[1][y] === gameStatus[2][y])){
			 if (gameStatus[0][y] != 0) win = gameStatus[0][y];
			 return win;
		}		
	}
	if ((gameStatus[0][0] == gameStatus[1][1]) && (gameStatus[1][1] == gameStatus[2][2])){
		if (gameStatus[0][0] != 0) win = gameStatus[0][0];
		return win;
	}
	if ((gameStatus[0][2] == gameStatus[1][1]) && (gameStatus[1][1] == gameStatus[2][0])){
		if (gameStatus[0][2] != 0) win = gameStatus[0][2];
		return win;
	}	
	for (var x in gameStatus){
		for (var y in gameStatus[x]){
			if (gameStatus[x][y] === 0) freeCnt++;
		}
	}
	if (freeCnt === 0) win = 3;
	return win;
}

var goodMove = function(){
	for (var i in gameStatus){
		var cnt = 0;
		var move = [-1,-1];
		var tmove =  [-1,-1];
		for (var j in gameStatus[i]){
			if (gameStatus[i][j] === 1) cnt++;
			if ((gameStatus[i][j] === 0)) tmove = [i,j];
		}
		if (move[0] != -1) continue;
		if (cnt === 2) move = tmove;
		if ((cnt === 2) && (move[0] != -1) && (gameStatus[move[0]][move[1]] === 0))   return move;
	}	
	for (var i in gameStatus){
		var cnt = 0;
		var move = [-1,-1];
		var tmove =  [-1,-1];
		for (var j in gameStatus[i]){
			if (gameStatus[j][i] === 1) cnt++;
			if ((gameStatus[j][i] === 0)) tmove = [j,i];
		}
		if (move[0] != -1) continue;
		if (cnt === 2) move = tmove;
		if ((cnt === 2) && (move[0] != -1) && (gameStatus[move[0]][move[1]] === 0))   return move;
	}
	
	var move = [-1,-1];
	var cnt = 0;
	for (var i = 0; i < 3; ++i){
		if (gameStatus[i][i] === 1) cnt++;
		if (gameStatus[i][i] === 0) move = [i,i];
	}
	if ((cnt === 2) && (move[0] != -1) && (gameStatus[move[0]][move[1]] === 0))   return move;

	var move = [-1,-1];
	var cnt = 0;
	for (var i = 0; i < 3; ++i){
		if (gameStatus[2-i][i] === 1) cnt++;
		if (gameStatus[2-i][i] === 0) move = [2-i,i];
	}
	if ((cnt === 2) && (move[0] != -1) && (gameStatus[move[0]][move[1]] === 0))   return move;
	
	var p;
	do {p = randomInteger(0,8);} while (gameStatus[Math.floor(p/3)][Math.floor(p%3)] > 0);	
	move = [Math.floor(p/3),Math.floor(p%3)];
	return move;
}

var moveAI = function(){
	var freeCnt = 0;
	for (var x in gameStatus){
		for (var y in gameStatus[x]){
			if (gameStatus[x][y] === 0) freeCnt++;
		}
	}
	if (freeCnt === 0) return;
	/*var p;
	do {p = randomInteger(0,8);} while (gameStatus[Math.floor(p/3)][Math.floor(p%3)] > 0);	
	gameStatus[Math.floor(p/3)][Math.floor(p%3)] = 2;*/
	var pos = goodMove();
	gameStatus[pos[0]][pos[1]] = 2;
	reDraw;
	win = checkWin();
}
