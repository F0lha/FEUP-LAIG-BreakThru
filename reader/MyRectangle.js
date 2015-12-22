/**
 * MyQuad
 * @constructor
 */
 function MyQuad(scene, X1, Y1, X2, Y2) {
 	CGFobject.call(this,scene);
	
	this.X1 = X1;
	this.X2 = X2;
	this.Y1 = Y1;
	this.Y2 = Y2;
 	
 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];
	
 	this.initBuffers();
 };

 MyQuad.prototype = Object.create(CGFobject.prototype);
 MyQuad.prototype.constructor = MyQuad;

 MyQuad.prototype.initBuffers = function() {
 	this.vertices = [
 	this.X1, this.Y1, 0,
 	this.X2, this.Y1, 0,
 	this.X1, this.Y2, 0,
 	this.X2, this.Y2, 0
 	];

 	this.indices = [
 	2,1,0,
 	2,3,1
 	];

 	this.normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
 	];
	
	this.height = Math.abs(this.Y2 - this.Y1);
	this.width = Math.abs(this.X2 - this.X1);


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
 
  MyQuad.prototype.applyAmplifFactors = function(amplif_factorS,amplif_factorT) {
  
		this.texCoords=[
			0,0,
			this.width/amplif_factorS,0,
			0,this.height/amplif_factorT,
			this.width/amplif_factorS,this.height/amplif_factorT
		];
		
	this.updateTexCoordsGLBuffers();
  };
 