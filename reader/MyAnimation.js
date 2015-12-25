function MyAnimation(scene, span) {
    this.scene = scene;
    this.span = span;
	this.finished = false;
	
	this.animMatrix = mat4.create();
	mat4.identity(this.animMatrix);
	
}

MyAnimation.prototype.constructor = MyAnimation;

MyAnimation.prototype.getFinished = function() {
	return this.finished;
}

MyAnimation.prototype.reset = function() {
}