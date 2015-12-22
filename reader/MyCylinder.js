function MyCylinder(scene, heigth, botRadius, topRadius, stacks, slices) {
    CGFobject.call(this, scene);


    this.height = heigth;
    this.stacks = stacks;
    this.slices = slices;
    this.botRadius = botRadius;
    this.topRadius = topRadius;

    this.nextitBuffers(); 
}

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.nextitBuffers = function () {
    var stackWidth = 1/this.stacks,
        diffRadius = (this.botRadius - this.topRadius) / this.stacks,
        teta = (2 * Math.PI) / this.slices;

    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.indices = [];

    for (var i = 0; i < this.slices + 1; i++) {
        for (var j = 0; j < this.stacks + 1; j++) {
            var radius = this.botRadius - diffRadius * j;

            this.vertices.push(
                radius * Math.cos(teta * i),
                radius * Math.sin(teta * i),
                (j * stackWidth) * this.height
            );

            this.normals.push(
                radius * Math.cos(teta * i),
                radius * Math.sin(teta * i),
                0
            );

            this.texCoords.push(
                1 - i / this.slices,
                1 - j / this.stacks
            );
        }
    }

    for (i = 0; i < this.slices; i++) {
        for(j = 0; j < this.stacks; j++){
            var next = (this.stacks + 1) * i;
            this.indices.push(
                j + next,
                j + next + this.stacks + 1,
                j + next + 1
            );
            this.indices.push(
                j + next + 1 ,
                j + next + this.stacks + 1,
                j + next + this.stacks + 2
            );
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyCylinder.prototype.applyAmplifFactors = function(amplif_factorS,amplif_factorT) {
  	this.updateTexCoordsGLBuffers();
  }