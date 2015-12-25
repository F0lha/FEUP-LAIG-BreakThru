
function Piece(scene,player,row,col) {
	CGFobject.call(this,scene);	
	
	this.scene = scene;
	
	this.primitive = null;
	this.inBoard = true;
	this.player = player;
	this.x = row;
	this.y = col;
	this.angle = 0;
	
	this.movingAnimation = null;
	this.rotationAnimation = null;
	
	switch(player){
	
	case 1: //atacante
		this.primitive = new MyPlant(scene,player);
		break;
	case 2: // defensor
		this.primitive = new MyPlant(scene,player);
		break;
	case 5: //mothership
		this.primitive = new MyPlant(scene,player);
		break;
	}
	
}

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.getNewRotation = function(direction){

	return Math.atan2(direction[0], direction[2]);

}

Piece.prototype.defineAnimation = function(finalRow,finalCol){

	this.scene.state = "ANIMATION";

	var controlPoint = vec3.fromValues((finalCol-this.y)*1.1,0, (finalRow-this.x)*1.1);
	
	var direction = vec3.create();
	vec3.normalize(direction,controlPoint);
	
	var newAngle = this.getNewRotation(direction);
	
	if(this.angle != newAngle)
	{
		var diffRot;
		if((this.angle - newAngle) <= Math.PI)
			diffRot = newAngle - this.angle;
		else diffRot = this.angle - newAngle;
		
		console.log(diffRot);
		
		this.rotationAnimation = new MyRotation(this.scene, 1, diffRot);
		this.rotationAnimation.currentRot = this.angle;
		this.angle = newAngle;
	}

	this.movingAnimation = new MyLinearAnimation(this.scene, Math.abs((finalCol-this.y)+(finalRow-this.x)), [vec3.fromValues(0,0,0),controlPoint]);
}

Piece.prototype.display = function(){

	var tempMatrix = mat4.create();
	
	mat4.identity(tempMatrix);
	
	if(this.rotationAnimation != null)
	{
		
		
		if(this.scene.Board.delta < 100)// smooth
			var Matrix = this.rotationAnimation.getMatrix(this.scene.Board.delta);
		else var Matrix = this.rotationAnimation.getMatrix(50);
		
		mat4.multiply(tempMatrix, tempMatrix, Matrix);
		
		
		if(this.rotationAnimation.finished == true)
		{
			this.rotationAnimation = null;
		}
	}
	else if(this.movingAnimation != null) // smooth
	{
		if(this.scene.Board.delta < 100)// smooth
			var Matrix = this.movingAnimation.getMatrix(this.scene.Board.delta);
		else var Matrix = this.movingAnimation.getMatrix(50);
		
		mat4.multiply(tempMatrix, tempMatrix, Matrix);

		if(this.movingAnimation.finished == true){
			this.setCoord(Math.round((this.movingAnimation.controlPoints[1][2])/1.1)+this.x,Math.round((this.movingAnimation.controlPoints[1][0])/1.1)+this.y);
			this.movingAnimation = null;
			this.scene.Board.resetSelection();
			}
	}
	else 
	{ // mantain rotation
		mat4.rotateY(tempMatrix,tempMatrix,this.angle);
	}
	
	this.scene.multMatrix(tempMatrix);
	this.primitive.display();
}

Piece.prototype.setCoord = function(x,y){
	this.x = x;
	this.y = y;
}