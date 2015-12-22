
 function MySphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.radius = radius;
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {

	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	
	var stackStep = Math.PI / this.stacks;
	var sliceStep = 2 * Math.PI / this.slices;

    for (var currStack = 0; currStack <= this.stacks; currStack++) {
      for (var currSlice = 0; currSlice <= this.slices; currSlice++) {
	  
	    var sinT = Math.sin(currStack * stackStep);
		var cosT = Math.cos(currStack * stackStep);
        var sinP = Math.sin(currSlice * sliceStep);
        var cosP = Math.cos(currSlice * sliceStep);
		
		this.vertices.push(this.radius*cosP*sinT,this.radius*sinP*sinT,this.radius*cosT);
        this.normals.push(cosP*sinT,sinP*sinT,cosT);
        this.texCoords.push(currSlice / this.slices,currStack / this.stacks);
        
      }
    }

    for (var currStack = 0; currStack < this.stacks; currStack++) {
      for (var currSlice = 0; currSlice < this.slices; currSlice++) {
        
		this.indices.push(currStack*(this.slices+1)+currSlice,((currStack+1)*(this.slices+1))+currSlice,((currStack+1)*(this.slices+1))+(currSlice+1));
		
		this.indices.push(currStack*(this.slices+1)+currSlice,((currStack+1)*(this.slices+1))+(currSlice+1),(currStack*(this.slices+1))+(currSlice+1));
      }
    }

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
 };

   MySphere.prototype.applyAmplifFactors = function(amplif_factorS,amplif_factorT) {
  	this.updateTexCoordsGLBuffers();
  }