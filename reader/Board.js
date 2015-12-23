/**
 * Board
 * @constructor
 */

function Board(scene) {
	CGFobject.call(this,scene);	

    this.scene = scene;
	
	//o maia é burro depois é perciso mudar
	
	this.head_texture = new CGFtexture(this.scene, "textures/head.jpg");
	this.fire = new CGFtexture(this.scene, "textures/fire.jpg");
	
	this.matrix;
	this.letter = new emptySpace(this.scene);
	
	//play
	this.currentPlayer = 0;
	this.currentCostLeft = 2;
	this.currentIDFromList = -1;
	
	this.prevMatrixs = [];
	this.inAnimation = false;
	this.currentAnimation;
	
	//selection
	this.selectedID = -1;
	this.listSelected = [];
	this.atackingPiece = new MyPlant(scene);
	//this.defendingPiece = new defendingPiece();
	//this.motherShip = new motherShip();
}

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.defineSelection = function(ID,list) {

	this.selectedID = ID;
	this.listSelected = list;

}

Board.prototype.resetSelection = function() {

	this.selectedID = -1;
	this.listSelected = [];
	this.currentIDFromList = -1;

}

Board.prototype.init = function(matrix) {
    this.matrix = matrix;
    this.nRow = matrix.length;
    this.nCol = matrix[0].length;
	this.piecesLocation = [];
	this.destLocation = [];
	this.costMove = [];
	
	var i = 0;

for (var row = 0; row < this.nRow; ++row) {
        for (var col = 0; col < this.nCol; ++col) {
			this.scene.board[i] = new emptySpace(this.scene);
			this.scene.registerForPick(i+1,this.scene.board[i]);
			i++;
		}
	}
	
}

Board.prototype.newMatrix = function(newMatrix) {


	//TODO make animation

	this.prevMatrixs.push(this.matrix);
	this.matrix = newMatrix;
}

Board.prototype.updateCostLeft = function(NewCostLeft) {

this.currentCostLeft = NewCostLeft;

}

Board.prototype.updateBoard = function() {
	
	if(this.currentCostLeft == 0){
		if(this.currentPlayer == 0)
			this.currentPlayer = 1;
		else this.currentPlayer = 0;
		this.currentCostLeft = 2;
	}
	this.resetSelection();
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
	
	}


}

Board.prototype.displaySetence = function(string){

var translateRight = string.length/2;

console.log("Translate Right = " + translateRight);

this.scene.translate(-translateRight,0,0);

for(var i = 0; i < string.length;i++)
{
	var letter = string.charAt(i);

	
	var coord = this.getCoordArray(letter);
	
	this.scene.activeShader.setUniformsValues({'charCoords': coord});
	this.letter.display();
	this.scene.translate(1,0,0);
}

}

Board.prototype.displayTurn = function() {

	this.scene.pushMatrix();
	
	var diff = -this.nRow*1.1/2 + 0.5;
	
	
    this.scene.translate(0, 0, diff); // adicionar largura do emptyspace
	
	
	
	this.scene.translate(0,0,-3);
	
	if(this.scene.state != "GAMEOVER"){
		if(this.currentPlayer == 0){
			this.scene.pushMatrix();
			this.displaySetence("PLAYER 1");
			this.scene.popMatrix();
			this.scene.translate(0,0,1.5);
			this.scene.pushMatrix();
			this.displaySetence("TURN");
			this.scene.popMatrix();

		}
		else if(this.currentPlayer == 1){
			this.scene.pushMatrix();
			this.displaySetence("PLAYER 2");
			this.scene.popMatrix();
			this.scene.translate(0,0,1.5);
			this.scene.pushMatrix();
			this.displaySetence("TURN");
			this.scene.popMatrix();
		}
	}
	else {
		if(this.currentPlayer == 0){
			this.scene.pushMatrix();
			this.displaySetence("PLAYER 1");
			this.scene.popMatrix();
			this.scene.translate(0,0,1.5);
			this.scene.pushMatrix();
			this.displaySetence("WON");
			this.scene.popMatrix();
		}
		else if(this.currentPlayer == 1){
			this.scene.pushMatrix();
			this.displaySetence("PLAYER 2");
			this.scene.popMatrix();
			this.scene.translate(0,0,1.5);
			this.scene.pushMatrix();
			this.displaySetence("WON");
			this.scene.popMatrix();
		}
	}
	
	this.scene.popMatrix();
}

Board.prototype.display = function() {

	this.scene.setActiveShaderSimple(this.scene.textShader);
	
	this.scene.appearance.apply();
	
	this.displayTurn();
	
	this.scene.setDefaultAppearance();
	
	this.scene.setActiveShaderSimple(this.scene.defaultShader);

    this.scene.pushMatrix();
    this.scene.translate(-this.nCol*1.1/2 + 0.5, 0.01, -this.nRow*1.1/2 + 0.5); // adicionar largura do emptyspace

	var i = 0;
	
    for (var row = 0; row < this.nRow; ++row) {
        for (var col = 0; col < this.nCol; ++col) {
			this.scene.registerForPick(i+1,this.scene.board[i]);
			if(this.selectedID == i) // TODO alterar esta merda toda
			this.fire.bind();
			else this.head_texture.bind();
			this.scene.board[i].display();
			this.scene.pushMatrix();
			switch(this.matrix[row][col]){
			
			case 1:	this.scene.translate(0.5,0,0.5);			
					this.atackingPiece.display();
					break;
			case 2: this.scene.translate(0.5,0,0.5);			
					this.atackingPiece.display();
					break;
			case 5: this.scene.translate(0.5,0,0.5);			
					this.atackingPiece.display();
					break;
			default:
					break;
			}
			if(this.selectedID == i)// TODO alterar esta merda toda
				this.fire.unbind();
			else this.head_texture.unbind();
			this.scene.popMatrix();
            this.scene.translate(1.1,0,0); // adicionar largura do emptyspace
			i++;
        }
        this.scene.translate(-this.nCol*1.1, 0, 1.1);// adicionar largura do emptyspace
    }

    this.scene.popMatrix();
}