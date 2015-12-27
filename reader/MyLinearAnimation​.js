function MyLinearAnimation(scene, span, controlPoints, rotation) {
    MyAnimation.call(this,scene,span);
	
	
	

    this.controlPoints = controlPoints;
	this.velocity = 0;
	this.distance = 0;
	this.currentDistance = 0;
	this.distanceList = {};
	this.currentTranslation = vec3.create(controlPoints[0]);
	this.currentRotation = 0;
	this.currentJ = 0;
	if(rotation == null)
	this.rotation = 0;
	else this.rotation = rotation*Math.PI*2/360;
	this.initBuffers();
}
//LAIGPROB2_fim

MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.reset = function() {
this.currentDistance = 0;
this.finished = false;
this.initBuffers();
}

MyLinearAnimation.prototype.initBuffers = function() {

var tempVec = vec3.create();

for(var i = 0; i < this.controlPoints.length - 1;i++){

vec3.sub(tempVec,this.controlPoints[i+1], this.controlPoints[i]);
this.distance += Math.abs(vec3.length(tempVec));
this.distanceList[i] = (this.distance);
}
this.rotationByTick = this.rotation/(this.span*1000);
if(this.controlPoints.length > 1){
		var direction = vec3.create();
		vec3.sub(direction,this.controlPoints[1], this.controlPoints[0]);

		if(vec3.length(vec3.fromValues(direction[0],0,direction[2])) != 0)
		this.currentRotation = Math.atan2(direction[0], direction[2]);
}
this.velocity = this.distance/(this.span*1000);
}

MyLinearAnimation.prototype.getMatrix = function(delta) {
	this.currentDistance += delta*this.velocity;
	
	var tempMatrix = mat4.create();
	
	mat4.identity(tempMatrix);
	
	var i,j = 0,tempCurrentPoint = 0;
//LAIGPROB2_inicio
	for(i in this.distanceList){
		tempCurrentPoint = j+1;
			if(this.distanceList[i] >= this.currentDistance)
			break;
		j++;
	}
	if(j != this.controlPoints.length-1){
	
	var direction = vec3.create();	
	vec3.sub(direction,this.controlPoints[j+1],this.controlPoints[j]);	
	
	var percent;	
	if(i > 0)
		percent = delta*this.velocity/(this.distanceList[i]-this.distanceList[i-1]);
	else percent = delta*this.velocity/this.distanceList[i];
	
	var percentDirection = vec3.create();
	
	vec3.scale(percentDirection,direction,percent);
	
	vec3.add(this.currentTranslation,this.currentTranslation,percentDirection);	
	if(this.currentJ != j){
		this.currentJ = j;
		}
	this.currentRotation += delta*this.rotationByTick;
			//LAIGPROB2_fim
	} else this.finished = true;
	
	mat4.translate(tempMatrix,tempMatrix,this.currentTranslation);
	

	mat4.rotateY(tempMatrix,tempMatrix,this.currentRotation);
	

	return tempMatrix;
}