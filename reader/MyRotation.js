function MyRotation(scene, span, diffRot) {
    MyAnimation.call(this,scene,span);

	this.span = span;
	
	this.velocity = diffRot/(this.span*1000);
	
	this.currentRot = 0;
	
	this.absDiffRot = Math.abs(diffRot);
}

MyRotation.prototype = Object.create(MyAnimation.prototype);
MyRotation.prototype.constructor = MyRotation;

MyRotation.prototype.getMatrix = function(delta) {
	this.absDiffRot -= Math.abs(delta*this.velocity);
	
	if(this.absDiffRot <= 0)
		this.finished = true;
	else this.currentRot -= delta*this.velocity;

	var tempMatrix = mat4.create();
	
	mat4.identity(tempMatrix);
	
	mat4.rotateY(tempMatrix,tempMatrix,this.currentRot);
	
	return tempMatrix;
}