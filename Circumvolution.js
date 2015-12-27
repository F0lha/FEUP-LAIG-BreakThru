/**
 * Circumvolution
 * @constructor
 */
 //LAIGPROB1_inicio
 function Circumvolution(scene, slices, R1, R2, R3, R4, R5, R6, R7, R8) {
 	CGFobject.call(this,scene);
	
	this.scene = scene;
	
	this.slices = slices;
	this.radiuses = [R1, R2, R3, R4, R5, R6, R7, R8];
	
	this.heightStep = 1/8;
	this.stepAng = 2*Math.PI/this.slices;
	
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.indices = [];
	
	this.initBuffers();
 };

 Circumvolution.prototype = Object.create(CGFobject.prototype);
 Circumvolution.prototype.constructor = Circumvolution;

 Circumvolution.prototype.initBuffers = function() {
	 

	 
	for(var j = 0; j < 8; j++)
		for(var i = 0; i < this.slices; i++)
		{
			 this.vertices.push(this.radiuses[j]*Math.cos(this.stepAng*i),this.radiuses[j]*Math.sin(this.stepAng*i),this.heightStep*j);
			 this.vertices.push(this.radiuses[j]*Math.cos(this.stepAng*(i+1)),this.radiuses[j]*Math.sin(this.stepAng*(i+1)),this.heightStep*j);
			 this.vertices.push(this.radiuses[j+1]*Math.cos(this.stepAng*i),this.radiuses[j+1]*Math.sin(this.stepAng*i),this.heightStep*(j+1));
			 this.vertices.push(this.radiuses[j+1]*Math.cos(this.stepAng*(i+1)),this.radiuses[j+1]*Math.sin(this.stepAng*(i+1)),this.heightStep*(j+1));
			 
			 this.indices.push(0+i*4 +j*this.slices*4,1+i*4 +j*this.slices*4,2+i*4 +j*this.slices*4,3+i*4 +j*this.slices*4,2+i*4 +j*this.slices*4,1+i*4 +j*this.slices*4)
			 
				var p1 = vec3.fromValues(this.radiuses[j]*Math.cos(this.stepAng*i),this.radiuses[j]*Math.sin(this.stepAng*i),this.heightStep*j);
				var p2 = vec3.fromValues(this.radiuses[j+1]*Math.cos(this.stepAng*i),this.radiuses[j+1]*Math.sin(this.stepAng*i),this.heightStep*(j+1));
				var p3 = vec3.fromValues(this.radiuses[j+1]*Math.cos(this.stepAng*(i+1)),this.radiuses[j+1]*Math.sin(this.stepAng*(i+1)),this.heightStep*(j+1));
			 
			 	var U = vec3.create();
				var V = vec3.create();
				vec3.sub(U,p2,p1);
				vec3.sub(V,p3,p1);
	
				var temp = vec3.create();
				vec3.cross(temp,V,U);
				
				this.normals.push(
				temp[0],temp[1],temp[2],
				temp[0],temp[1],temp[2],
				temp[0],temp[1],temp[2],
				temp[0],temp[1],temp[2]
				)
		}
		
		
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();

 }
 //LAIGPROB1_fim