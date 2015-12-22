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
	this.currentPlayer = 0;
	this.prevMatrixs = [];
	this.inAnimation = false;
	this.currentAnimation;
	
	//selection
	this.selectedID = -1;
	this.listSelected = [];
	//this.atackingPiece = new atackingPiece();
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
			i++;
		}
	}
	
}
Board.prototype.newMatrix = function(newMatrix,initCoord,finalCoord) {

if(this.matrix[finalCoord[0]][finalCoord[1]] != 0){
	this.inAnimation = true;
	//Animacao de comer
	}
	else {
	
	this.inAnimation = true;
	//animacao de andar
	}

	this.prevMatrixs.push(this.matrix);
	this.matrix = newMatrix;
}

Board.prototype.parsingPlays = function(playList) {

var temp = listToMatrix(playList);

this.piecesLocation = temp[0];
console.log(this.piecesLocation);
this.destLocation = temp[1];
console.log(this.destLocation);
this.costMove = temp[2];
console.log(this.costMove);

}

Board.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.translate(-this.nCol/2 + 0.5, 0.1, -this.nRow/2 + 0.5); // adicionar largura do emptyspace

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
			
			case 1:	this.scene.translate(0,2,0);		
					//this.atackingPiece.display();
					break;
			case 2: this.scene.translate(0,2,0);		
					//this.defendingPiece.display();
					break;
			case 5: this.scene.translate(0,2,0);		
					//this.motherShip.display();
					break;
			default:
					break;
			}
			if(this.selectedID == i)// TODO alterar esta merda toda
				this.fire.unbind();
			else this.head_texture.unbind();
			this.scene.popMatrix();
            this.scene.translate(1,0,0); // adicionar largura do emptyspace
			i++;
        }
        this.scene.translate(-this.nCol, 0, 1);// adicionar largura do emptyspace
    }

    this.scene.popMatrix();
}