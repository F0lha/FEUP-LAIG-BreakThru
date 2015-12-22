function MyCircularAnimation(scene, span, center,radius,startangle,rotangle) {
    MyAnimation.call(this,scene, span);
    this.center = center;
    this.current = (startangle*2*Math.PI)/360 + Math.PI/2;
    this.toRotate = Math.abs(rotangle*2*Math.PI/360);
    this.radius = radius;
	this.angPerTick = (rotangle*2*Math.PI/360)/(span*1000);
	this.rotAngle = rotangle;
}

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.init = function() {


}

MyCircularAnimation.prototype.getMatrix = function(delta) {
	if(this.toRotate > 0){
		this.current += this.angPerTick*delta;
		this.toRotate -= Math.abs(this.angPerTick*delta);
	}else this.finished = true;
	matrix = mat4.create();
	mat4.identity(matrix);
	mat4.translate(matrix,matrix,this.center);
	mat4.rotateY(matrix,matrix,this.current);
	mat4.translate(matrix,matrix,vec3.fromValues(0, 0, this.radius));
	if(this.rotAngle >= 0)
		mat4.rotateY(matrix, matrix,Math.PI / 2);
	else mat4.rotateY(matrix, matrix,-Math.PI / 2);

	return matrix;
}