/**
 * Board
 * @constructor
 */
function Board(scene) {
	CGFobject.call(this,scene);	

    this.scene = scene;
	
	this.Player1Name = "Player 1";
	this.Player2Name = "Player 2";
	
	//texturas dos quadrados
	this.choice = new CGFtexture(this.scene, "textures/selected.png");
	this.selection = new CGFtexture(this.scene, "textures/choice.png");
 	this.selected = new CGFtexture(this.scene, "textures/selection.png");
	
	this.matrix;
	this.letter = new emptySpace(this.scene);
	
	//Box
	this.player1Box = new MyBox(scene,0);
	this.player2Box = new MyBox(scene,1);
	
	this.Color = "#FF0000";
	
	//play
	this.currentPlayer = 0;
	this.time_left = 30;
	this.currentCostLeft = 2;
	this.currentIDFromList = -1;
	
	this.prevMatrixs = [];
	this.prevCosts = [];
	this.prevPlayer = [];
	this.gameOver = false;
	
	//Marcador
	
	this.player1Points = 0;
	this.player2Points = 0;
	
	//ListPieces
	
	this.listPieces = [];
	this.deletedPieces = [];
	
	//selection
	this.selectedID = -1;
	this.listSelected = [];
}

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.defineSelection = function(ID,list) {

	this.selectedID = ID;
	this.listSelected = list;

}

Board.prototype.resetSelection = function() {

	this.scene.state = "IDLE";
	this.selectedID = -1;
	this.listSelected = [];
	this.currentIDFromList = -1;

}

Board.prototype.findDiferenceMatrix = function(matrix,newMatrix) {

	var initRow,initCol,finalRow,finalCol;

	for (var row = 0; row < this.nRow; ++row) {
			for (var col = 0; col < this.nCol; ++col) {
			
			if(matrix[row][col] != 0 && newMatrix[row][col] == 0){
			
				initCol = col;
				initRow = row;
				
				}
			else if(matrix[row][col] == 0 && newMatrix[row][col] != 0)
				{
				finalCol = col;
				finalRow = row;
			
			}else if(matrix[row][col] != newMatrix[row][col])
			{
				finalCol = col;
				finalRow = row;
			}
		}
	}
		return new Array(initRow,initCol,finalRow,finalCol);

}

Board.prototype.findDiferenceMatrixUndo = function(matrix,newMatrix) {
	var initRow,initCol,finalRow,finalCol;

	for (var row = 0; row < this.nRow; ++row) {
			for (var col = 0; col < this.nCol; ++col) {
			if(matrix[row][col] != 0 && newMatrix[row][col] == 0){
			
				initCol = col;
				initRow = row;
				
				}
			else if((matrix[row][col] != newMatrix[row][col]) && matrix[row][col] != 0 && newMatrix[row][col] != 0)
			{
				initCol = col;
				initRow = row;
			}
			else if(matrix[row][col] == 0 && newMatrix[row][col] != 0)
				{
				finalCol = col;
				finalRow = row;
			
			}else if(matrix[row][col] != newMatrix[row][col])
			{
				finalCol = col;
				finalRow = row;
			}
		}
	}
		return new Array(initRow,initCol,finalRow,finalCol);

}

Board.prototype.init = function(matrix) {
    this.matrix = matrix;
    this.nRow = matrix.length;
    this.nCol = matrix[0].length;
	this.piecesLocation = [];
	this.destLocation = [];
	this.costMove = [];
	this.listPieces= [];
	
	var i = 0;

for (var row = 0; row < this.nRow; ++row) {
        for (var col = 0; col < this.nCol; ++col) {
			this.scene.board[i] = new emptySpace(this.scene);
			
			//create piecesLocation
			
				switch(this.matrix[row][col]){
				case 1:
					this.listPieces.push(new Piece(this.scene,1,row,col));
					//define other stuff
				break;
				case 2:
					this.listPieces.push(new Piece(this.scene,2,row,col));
					//define other stuff
				break;
				case 5:
					this.listPieces.push(new Piece(this.scene,5,row,col));
					//define other stuff
				break;
			}
			this.scene.registerForPick(i+1,this.scene.board[i]);
			i++;
		}
	}
}

Board.prototype.findPiece = function(row,col,flag) {

	for(id in this.listPieces)
		{
			if(this.listPieces[id].x == row && this.listPieces[id].y == col){
				if(flag)
					{
						if(this.listPieces[id].inBoard)
							return this.listPieces[id];
					}
				else return this.listPieces[id];
				}
		}
	return null;

}

Board.prototype.eatenPiece = function(matrix,newMatrix) {

var numberM = 0;
var numberNewM = 0;

for (var row = 0; row < this.nRow; ++row) {
        for (var col = 0; col < this.nCol; ++col) {
		
		if(matrix[row][col] != 0)
			numberM++;
		if(newMatrix[row][col] != 0)
			numberNewM++;
		}
	}
	
	return numberM != numberNewM;
}

Board.prototype.UNDO = function() {
console.log(this.scene.state);
if(this.scene.state != "ANIMATION" && this.scene.state != "PROCESSING")
	if(this.prevMatrixs.length != 0)
		{
			var id = this.prevMatrixs.length - 1;
			var newMatrix = this.popUntilIndex(id,this.prevMatrixs);
			var newCost = this.popUntilIndex(id,this.prevCosts);
			var newPlayer = this.popUntilIndex(id,this.prevPlayer);
			console.log(id);
			console.log(newMatrix);
			console.log(newCost);
			console.log(newPlayer);
			
			var movement = this.findDiferenceMatrixUndo(this.matrix,newMatrix);
				
			var	initRow = movement[0];
			var initCol = movement[1];
			
			var pieceToMove = this.findPiece(initRow,initCol,true);
			
			this.time_left = 30;
			
			this.makeAnimation(movement,true);
			
			var deletedPiece;
			if(this.eatenPiece(this.matrix,newMatrix)){
				deletedPiece = this.deletedPieces.pop();
				
				//make delete animation
				deletedPiece.inBoard = true;
				
				//
				
					var variationToCorner;
					if(deletedPiece.player == 2)
						variationToCorner = vec3.fromValues(((deletedPiece.y-1)*1.1+0.5)+5.8,0,((deletedPiece.x-1)*1.1+1.5)-6.7);
					else if(deletedPiece.player == 1) variationToCorner = vec3.fromValues(((deletedPiece.y-1)*1.1+0.5)-1.1*this.nCol-3.2,0,((deletedPiece.x-1)*1.1+1.5)-6.7);
					//ta bugado, nao sei desbugar fds, que cancro fodido TODO	
					
					var number = this.howManyDefeated(deletedPiece.player)-1;

					var variationOnBox = vec3.fromValues(-(Math.floor(number/4))*1.1,0,-(number % 4)*1.1);
					
					var translation2Vec = vec3.create();
					vec3.add(translation2Vec,variationOnBox,variationToCorner);
				
				//
				
				deletedPiece.undoDeleteAnimation1 = new MyLinearAnimation(this.scene, 1, [vec3.fromValues(0,0,0),vec3.fromValues(0,5,0)],360); // levitação
				deletedPiece.undoDeleteAnimation2 = new MyLinearAnimation(this.scene, 3, [vec3.fromValues(0,0,0),translation2Vec]);;
				deletedPiece.undoDeleteAnimation3 = new MyLinearAnimation(this.scene, 1, [vec3.fromValues(0,0,0),vec3.fromValues(0,-5,0)],360);
				
				if(this.currentPlayer == 0)
					this.player2Points -=2;
				else this.player1Points -=2;
			}
		
			this.matrix = newMatrix;
			this.currentPlayer = newPlayer;
			this.currentCostLeft = newCost;
			var self = this.scene;
			this.scene.getPlays(this,function(listPlays) {
					self.Board.parsingPlays(listPlays);
					//self.state = "IDLE"; // para tirar quando fizer o undo
			});
			this.prevMatrixs.shift();
			this.prevPlayer.shift();
			this.prevCosts.shift();
			this.resetSelection();
			this.scene.state = "ANIMATION";
			if(this.gameOver)
				this.gameOver = false;
		}
}

Board.prototype.howManyDefeated = function(player) {
var number = 0;

for(id in this.deletedPieces)
	if(this.deletedPieces[id].player == player)
		number++;
return number;
}

Board.prototype.defineDefeatAnimation = function(piece) {
	var variationToCorner;
	if(piece.player == 2)
		variationToCorner = vec3.fromValues((-piece.y*1.1-0.5)-5.8,0,(-piece.x*1.1-1.5)+6.7);
	else if(piece.player == 1 || piece.player == 5) variationToCorner = vec3.fromValues((-piece.y*1.1-0.5)+1.1*this.nCol+3.2,0,(-piece.x*1.1-1.5)+6.7);
	//ta bugado, nao sei desbugar fds, que cancro fodido TODO	
	
	var number = this.howManyDefeated(piece.player)-1;

	var variationOnBox = vec3.fromValues((Math.floor(number/4))*1.1,0,(number % 4)*1.1);

	piece.deathAnimationPart1 = new MyLinearAnimation(this.scene, 1, [vec3.fromValues(0,0,0),vec3.fromValues(0,5,0)],360); // levitação

	piece.translation1 = vec3.fromValues(0,5,0);

	piece.deathAnimationPart3 = new MyLinearAnimation(this.scene, 1, [vec3.fromValues(0,0,0),vec3.fromValues(0,-5,0)],360); // levitação

	var translation2Vec = vec3.create();
	vec3.add(translation2Vec,variationOnBox,variationToCorner);

	piece.translation2 = vec3.create();

	vec3.add(piece.translation2,piece.translation1,translation2Vec); // second translation

	piece.deathAnimationPart2 = new MyLinearAnimation(this.scene, 3, [vec3.fromValues(0,0,0),translation2Vec]);
	//calcular a animacao de guardar

}

Board.prototype.makeAnimation = function(movement,undo) {

	var initRow = movement[0];
	var initCol = movement[1];
	var finalRow = movement[2];
	var finalCol = movement[3];
	
	var pieceThatMoves = this.findPiece(initRow,initCol,true);
	
	var destSpace = this.findPiece(finalRow,finalCol,true);
	
	pieceThatMoves.defineAnimation(finalRow,finalCol);
	
	if(!undo)
		if(destSpace != null){
			//destSpace.inBoard = false;
			this.deletedPieces.push(destSpace);
			
			this.defineDefeatAnimation(destSpace);
			
			//updatePoints
			
			switch(destSpace.player){
				case 1: //atacante
					if(this.currentPlayer == 0)
						this.player1Points += 2;
				break;
				case 2: // defensor
					if(this.currentPlayer == 1)
						this.player2Points += 2;
				break;
				case 5: //mothership
					if(this.currentPlayer == 1)
						this.player2Points += 50;
				break;
			}
			
		}
	

}

Board.prototype.newMatrix = function(newMatrix) {

	var movement = this.findDiferenceMatrix(this.matrix,newMatrix);
	
	this.time_left = 30;
	
	this.scene.state = "ANIMATION";
	this.makeAnimation(movement,false);

	this.prevMatrixs.unshift(this.matrix);
	this.matrix = newMatrix;
	
}

Board.prototype.updateCostLeft = function(NewCostLeft) {


this.prevPlayer.unshift(this.currentPlayer);
this.prevCosts.unshift(this.currentCostLeft);
this.currentCostLeft = NewCostLeft;

}

Board.prototype.updateBoard = function() {
	
	if(this.currentCostLeft == 0){
		if(this.currentPlayer == 0)
			this.currentPlayer = 1;
		else this.currentPlayer = 0;
		this.currentCostLeft = 2;
		
		this.time_left = 30;
	}
}

Board.prototype.parsingPlays = function(playList) {

var temp = listToMatrix(playList);

this.piecesLocation = temp[0];
this.destLocation = temp[1];
this.costMove = temp[2];

}

Board.prototype.getCoordArray = function(Char){

	switch(Char){
	
	case 'A':
		return new Array(1,4);
		break;
	case 'B':
		return new Array(2,4);
		break;
	case 'C':
		return new Array(3,4);
		break;
	case 'D':
		return new Array(4,4);
		break;
	case 'E':
		return new Array(5,4);
		break;
	case 'F':
		return new Array(6,4);
		break;
	case 'G':
		return new Array(7,4);
		break;
	case 'H':
		return new Array(8,4);
		break;
	case 'I':
		return new Array(9,4);
		break;
	case 'J':
		return new Array(10,4);
		break;
	case 'K':
		return new Array(11,4);
		break;
	case 'L':
		return new Array(12,4);
		break;
	case 'M':
		return new Array(13,4);
		break;
	case 'N':
		return new Array(14,4);
		break;
	case 'O':
		return new Array(15,4);
		break;
	case 'P':
		return new Array(0,5);
		break;
	case 'K':
		return new Array(1,5);
		break;
	case 'R':
		return new Array(2,5);
		break;
	case 'S':
		return new Array(3,5);
		break;
	case 'T':
		return new Array(4,5);
		break;
	case 'U':
		return new Array(5,5);
		break;
	case 'V':
		return new Array(6,5);
		break;
	case 'W':
		return new Array(7,5);
		break;
	case 'X':
		return new Array(8,5);
		break;
	case 'Y':
		return new Array(9,5);
		break;
	case 'Z':
		return new Array(10,5);
		break;
	case '0':
		return new Array(0,3);
		break;
	case '1':
		return new Array(1,3);
		break;
	case '2':
		return new Array(2,3);
		break;
	case '3':
		return new Array(3,3);
		break;
	case '4':
		return new Array(4,3);
		break;
	case '5':
		return new Array(5,3);
		break;
	case '6':
		return new Array(6,3);
		break;
	case '7':
		return new Array(7,3);
		break;
	case '8':
		return new Array(8,3);
		break;
	case '9':
		return new Array(9,3);
		break;
	case ' ':
		return new Array(0,2);
		break;
	case ':':
		return new Array(10,3);
		break;	
	}


}


//funcoes para dar parsing ao rgb em hex
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

Board.prototype.displaySetence = function(string){

	var translateRight = string.length/2;

	this.scene.translate(-translateRight,0,0);

	for(var i = 0; i < string.length;i++)
	{
		var letter = string.charAt(i);

		
		var coord = this.getCoordArray(letter);
		
		this.scene.activeShader.setUniformsValues({'charCoords': coord});
		this.scene.activeShader.setUniformsValues({'color': vec4.fromValues(hexToR(this.Color) / 255,hexToG(this.Color) / 255,hexToB(this.Color) / 255,1.0)});
		this.letter.display();
		this.scene.translate(1,0,0);
	}

}

Board.prototype.displayPlayer1Points = function() {

	this.scene.pushMatrix();
	
	var diff = -this.nRow*1.1/2 + 0.5;
	
	
    this.scene.translate(0, 0, diff); // adicionar largura do emptyspace
	
	this.scene.translate(-10,0,0);
	
	this.scene.pushMatrix();
	this.displaySetence(this.Player1Name.toUpperCase());
	this.scene.popMatrix();
	
	this.scene.translate(0,0,1.5);
	
	this.scene.pushMatrix();
	this.displaySetence("POINTS:"+ this.player1Points);
	this.scene.popMatrix();
	
	this.scene.popMatrix();
	
	

}

Board.prototype.displayPlayer2Points = function() {

	this.scene.pushMatrix();
	
	var diff = -this.nRow*1.1/2 + 0.5;
	
	
    this.scene.translate(0, 0, diff); // adicionar largura do emptyspace
	
	this.scene.translate(12,0,0);
	
	this.scene.pushMatrix();
	this.displaySetence(this.Player2Name.toUpperCase());
	this.scene.popMatrix();
	
	this.scene.translate(0,0,1.5);
	
	this.scene.pushMatrix();
	this.displaySetence("POINTS:"+ this.player2Points);
	this.scene.popMatrix();
	
	this.scene.popMatrix();

}

Board.prototype.displayTurn = function() {

	this.displayPlayer1Points();
	
	
	this.displayPlayer2Points();
	
	// BOX

	this.scene.pushMatrix();
	
	var diff = -this.nRow*1.1/2 + 0.5;
	
	
    this.scene.translate(0, 0, diff); // adicionar largura do emptyspace
	
	
	
	this.scene.translate(0,0,-3);
	
	if(!this.gameOver){
		if(this.scene.replayMode){
			this.scene.pushMatrix();
			this.displaySetence(this.Player1Name.toUpperCase());
			this.scene.popMatrix();
			this.scene.translate(0,0,1.5);
			this.scene.pushMatrix();
			this.displaySetence("REPLAY MODE");
			this.scene.popMatrix();
		}
		else if(this.currentPlayer == 0){
			this.scene.pushMatrix();
			this.displaySetence(this.Player1Name.toUpperCase());
			this.scene.popMatrix();
			this.scene.translate(0,0,1.5);
			this.scene.pushMatrix();
			this.displaySetence("TURN + " + Math.round(this.time_left));
			this.scene.popMatrix();

		}
		else if(this.currentPlayer == 1){
			this.scene.pushMatrix();
			this.displaySetence(this.Player2Name.toUpperCase());
			this.scene.popMatrix();
			this.scene.translate(0,0,1.5);
			this.scene.pushMatrix();
			this.displaySetence("TURN + " + Math.round(this.time_left));
			this.scene.popMatrix();
		}
	}
	else {
		if(this.currentPlayer == 0){
			this.scene.pushMatrix();
			this.displaySetence(this.Player1Name.toUpperCase());
			this.scene.popMatrix();
			this.scene.translate(0,0,1.5);
			this.scene.pushMatrix();
			this.displaySetence("WON");
			this.scene.popMatrix();
		}
		else if(this.currentPlayer == 1){
			this.scene.pushMatrix();
			this.displaySetence(this.Player2Name.toUpperCase());
			this.scene.popMatrix();
			this.scene.translate(0,0,1.5);
			this.scene.pushMatrix();
			this.displaySetence("WON");
			this.scene.popMatrix();
		}
	}
	
	this.scene.popMatrix();
}

Board.prototype.displayBoxes = function() {
	this.scene.pushMatrix();
	
	var diff = -this.nRow*1.1/2 + 0.5;
	
	
    this.scene.translate(0, 0, diff); // adicionar largura do emptyspace
	
	this.scene.translate(-12,0,5);
	
	this.player1Box.display();
	
	
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
	
	var diff = -this.nRow*1.1/2 + 0.5;
	
	
    this.scene.translate(0, 0, diff); // adicionar largura do emptyspace
	
	this.scene.translate(9,0,5);
	
	this.player2Box.display();
	
	
	this.scene.popMatrix();


}

Board.prototype.display = function() {

	this.updateCronometer();

	this.scene.setActiveShader(this.scene.textShader);
	
	this.scene.appearance.apply();
	
	this.displayTurn();
	
	this.scene.setDefaultAppearance();
	
	this.scene.setActiveShader(this.scene.defaultShader);
	
	this.displayBoxes();

    this.scene.pushMatrix();
    this.scene.translate(-this.nCol*1.1/2 + 0.5, 0.01, -this.nRow*1.1/2 + 0.5); // adicionar largura do emptyspace

	var i = 0;
	
    for (var row = 0; row < this.nRow; ++row) {
        for (var col = 0; col < this.nCol; ++col) {
			this.scene.registerForPick(i+1,this.scene.board[i]);
			var flag = false;
			
			for(id in this.listSelected)
				{
					var index = this.listSelected[id];
					var coord = this.destLocation[index];
					var coordTemp = this.scene.pickToCoord(i);
					if(coordTemp.toString() == coord.toString())
						flag = true;
				}
			
			if(this.selectedID == i) 
				this.selected.bind();
			else if(this.selectedID != -1 && flag)
				this.selection.bind();
			else this.choice.bind();
			this.scene.board[i].display();
			this.scene.pushMatrix();
			
			
			this.scene.translate(0.5,0,0.5);			
			for(id in this.listPieces)
			{
				if(this.listPieces[id].x == row && this.listPieces[id].y == col)
					//if(this.listPieces[id].inBoard)
						this.listPieces[id].display();
			}
				
			
			if(this.selectedID == i)
				this.selected.unbind();
			else if(this.selectedID != -1 && flag)
				this.selection.unbind();
			else this.choice.unbind();
			this.scene.popMatrix();
            this.scene.translate(1.1,0,0);
			i++;
        }
        this.scene.translate(-this.nCol*1.1, 0, 1.1);
    }

    this.scene.popMatrix();
}
 
 Board.prototype.updateCronometer = function() {
 	if(this.time_left <= 0 && !this.gameOver)
		{
			if(this.scene.state != "ANIMATION")
			{
			this.scene.makeEasyPlay(this.scene,this.scene.putBoardAndGetPlays);
			this.time_left = 30;
			}
		}
	
	this.time_left -= this.delta/1000;

}

Board.prototype.reset = function() {

this.currentPlayer = 0;
this.time_left = 30;
this.currentCostLeft = 2;
this.currentIDFromList = -1;

this.player1Points = 0;
this.player2Points = 0;

this.gameOver = false;

}

Board.prototype.popUntilIndex = function(index,matrix) {
var tempM = [];

for(var tempIndex = index;tempIndex > 0; tempIndex--)
{
	tempM.push(matrix.pop());
}
var returnValue = matrix.pop();

//returning matrix to normal

matrix.push(returnValue);

while(tempM.length != 0)
	matrix.push(tempM.pop());

return returnValue;
}

Board.prototype.playReplay = function(replayCounter) {

var newMatrix = this.popUntilIndex(replayCounter,this.prevMatrixs);
var newCost = this.popUntilIndex(replayCounter,this.prevCosts);
var newPlayer = this.popUntilIndex(replayCounter,this.prevPlayer);

var movement = this.findDiferenceMatrix(this.matrix,newMatrix);

console.log(this.matrix);
console.log(newMatrix);
console.log(movement);

this.scene.state = "ANIMATION";
this.makeAnimation(movement,false);

this.matrix = newMatrix;
this.currentCostLeft = newCost;
this.currentPlayer = newPlayer;
}