/**
 * MyTriangle
 * @constructor
 */
 function MyTriangle(scene, X1, Y1, Z1, X2, Y2, Z2, X3, Y3, Z3) {
 	CGFobject.call(this,scene);
	
	this.p1 = vec3.fromValues(X1,Y1,Z1);
	this.p2 = vec3.fromValues(X2,Y2,Z2);
	this.p3 = vec3.fromValues(X3,Y3,Z3);
 	
 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];
	
	this.initBuffers();
 };

 MyTriangle.prototype = Object.create(CGFobject.prototype);
 MyTriangle.prototype.constructor = MyTriangle;

 MyTriangle.prototype.initBuffers = function() {
 	
	this.vertices = [
 	this.p1[0], this.p1[1], this.p1[2],
 	this.p2[0], this.p2[1], this.p2[2],
 	this.p3[0], this.p3[1], this.p3[2]
 	];

 	this.indices = [
 	0,1,2
 	];
	
	var U = vec3.create();
	var V = vec3.create();
	vec3.sub(U,this.p2,this.p1);
	vec3.sub(V,this.p3,this.p1);
	
	var temp = vec3.create();
	vec3.cross(temp,U,V);
	
	this.normals = [
	temp[0],temp[1],temp[2],
	temp[0],temp[1],temp[2],
	temp[0],temp[1],temp[2]];
	
	
	this.a = vec3.distance(this.p2,this.p3);
	this.b = vec3.distance(this.p1,this.p3);
	this.c = vec3.distance(this.p2,this.p1);
	
	this.cosB = (Math.pow(this.a,2)-Math.pow(this.b,2) + Math.pow(this.c,2))/(2*this.a*this.c);
	this.angB = Math.acos(this.cosB);
	this.sinB = Math.sin(this.angB);

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
 
 MyTriangle.prototype.applyAmplifFactors = function(amplif_factorS,amplif_factorT) {
   	this.texCoords = [
      0,0,
      this.c/amplif_factorS,0,
      (this.c-this.a*this.cosB)/amplif_factorS,(this.a*this.sinB)/amplif_factorT
	];
	this.updateTexCoordsGLBuffers();
  }
  