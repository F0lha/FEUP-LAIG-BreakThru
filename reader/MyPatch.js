function MyPatch(scene, order, partsU, partsV, controlVertex) {
    
    CGFobject.call(this, scene);
    
    this.partsU = partsU;
    this.partsV = partsV;
    this.surfaces;
    
    var knot = [];

    for (var i = -1; i < order; i++) {
        knot.push(0);
    }
    for (var i = -1 ; i < order; i++) {
        knot.push(1);
    }

	var controlvertexes = []; 
    var controlPointVertex = []; 

	var nVertex = 0;

	for(var u = -1; u < order; u++){      
   		for(var v = -1; v < order; v++){
            controlPointVertex.push(controlVertex[nVertex]);
            nVertex++;
    }
       	controlvertexes.push(controlPointVertex);   
       	controlPointVertex = [];     
	}
	
	/*console.log("order = " + order);
	console.log("partsU = " + partsU);
	console.log("partsV = " + partsV);
	console.log("controlvertexes = " + controlvertexes);*/
	
    var nurbsSurface = new CGFnurbsSurface(order, order, knot, knot, controlvertexes);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };
    
    this.surfaces = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.display = function() 
{
    this.scene.pushMatrix();
    this.surfaces.display();
    this.scene.popMatrix();
};

MyPatch.prototype.updateTextCoords = function(s,t){};