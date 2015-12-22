/**
 * emptySpace
 * @constructor
 */
 function emptySpace(scene) {
	CGFobject.call(this,scene);
	
	this.rect = new MyQuad(scene,0,0,1,1);
	this.rect.applyAmplifFactors(1,1);
 }
 
 emptySpace.prototype = Object.create(CGFobject.prototype);
 emptySpace.prototype.constructor = emptySpace;

 emptySpace.prototype.display = function() {
	this.scene.pushMatrix();
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.rect.display(); 
	this.scene.popMatrix();
 }