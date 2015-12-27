	/**
	 * MyUnitCubeQuad
	 * @param gl {WebGLRenderingContext}
	 * @constructor
	 */
	function MyUnitCubeQuad(scene) {
		CGFobject.call(this,scene);

	 	//vehicle parts
		this.quad = new MyQuad(this.scene, -0.5, 0.5, 0.5, -0.5);
		this.quad.applyAmplifFactors(1,1);

	}
	

	MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
	MyUnitCubeQuad.prototype.constructor=MyUnitCubeQuad;


	MyUnitCubeQuad.prototype.display = function (){
		this.scene.pushMatrix();

			
			this.scene.pushMatrix();
			this.scene.translate(0, 0, 0.5);
			this.quad.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
			this.scene.rotate(Math.PI, 0, 1, 0);
			this.scene.translate(0, 0, 0.5);
			this.quad.display();
			this.scene.popMatrix();
			
			this.scene.pushMatrix();
			this.scene.rotate(Math.PI/2, 0, 1, 0);
			this.scene.translate(0, 0, 0.5);
			this.quad.display();
			this.scene.popMatrix();
			
			this.scene.pushMatrix();
			this.scene.rotate(-Math.PI/2, 0, 1, 0);
			this.scene.translate(0, 0, 0.5);
			this.quad.display();
			this.scene.popMatrix();
			
			this.scene.pushMatrix();
			this.scene.rotate(Math.PI/2, 1, 0, 0);
			this.scene.translate(0, 0, 0.5);
			this.quad.display();
			this.scene.popMatrix();
			
			this.scene.pushMatrix();
			this.scene.rotate(-Math.PI/2, 1, 0, 0);
			this.scene.translate(0, 0, 0.5);
			this.quad.display();
			this.scene.popMatrix();

		this.scene.popMatrix();
	};
