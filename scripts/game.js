"use strict"
var gCanvas = document.getElementById('cgame');
var gContext = gCanvas.getContext('2d');
var gLog = document.getElementById('log');
gLog.innerHTML = 'Loading...';
var gameStatus = [[0,0,0],[0,0,0],[0,0,0]];


var cross = document.getElementById('cross');
cross.onload = function(){
	//gContext.drawImage(cross,0,0);
	var dot = document.getElementById('dot');
	dot.onload = function(){
		//gContext.drawImage(dot,0,0);	
		gLog.innerHTML = 'Loaded!';
	}
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
			}
		}
	}
}

reDraw();

gCanvas.addEventListener('click', function(event) {
	var x = event.pageX - this.offsetLeft;
	var y = event.pageY- this.offsetTop;
	if (gameStatus[Math.floor(x / 129)][Math.floor(y / 129)] === 0){
		gameStatus[Math.floor(x / 129)][Math.floor(y / 129)] = 1;
	}
	reDraw();
	}, false);