function Plane(scene, parts) {
	CGFobject.call(this,scene);
    this.parts = parts;
	this.scene = scene;	
	
   	var nurbsSurface = new CGFnurbsSurface(1, 1, [0, 0, 1, 1], [0, 0, 1, 1], [
		[
			[-0.5, 0.0, 0.5, 1 ], 
			[-0.5, 0.0, -0.5, 1 ]
		], 
		[
			[ 0.5, 0.0,  0.5, 1 ], 
			[ 0.5, 0.0, -0.5, 1 ]
		]
	]);
					
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.parts, this.parts);
}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.display = function () {

		this.scene.pushMatrix();
		this.obj.display();
		this.scene.popMatrix();
	
}