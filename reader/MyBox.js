
 function MyBox(scene, type) {
 	CGFobject.call(this,scene);

 	this.type = type;

 	//materials
	this.cubo_texture = new CGFtexture(this.scene, "textures/wood.jpg"); 

	if(this.type == 1)
		this.cubo1_texture = new CGFtexture(this.scene, "textures/wood_red.jpg"); 
	else this.cubo1_texture = new CGFtexture(this.scene, "textures/wood_blue.jpg");

 	//vehicle parts
 	this.cubo = new MyUnitCubeQuad(scene);

 	this.quad = new MyQuad(this.scene, -0.5, 0.5, 0.5, -0.5);
	this.quad.applyAmplifFactors(1,1);

 };

 MyBox.prototype = Object.create(CGFobject.prototype);
 MyBox.prototype.constructor = MyBox;

 MyBox.prototype.display = function() {
 	var degToRad = Math.PI / 180.0;
 	this.scene.pushMatrix();

 		if(this.type == 1){
	 		//box1
	 		this.cubo_texture.bind();
			this.scene.pushMatrix();
				this.scene.translate(0.1, 0.5, 2.3);
	 			this.scene.scale(0.2, 1, 4.6); 			
				this.cubo.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(5.8, 0.5, 2.3);
	 			this.scene.scale(0.2, 1, 4.6);
				this.cubo.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(2.95, 0.5, 0.1);
	 			this.scene.scale(5.5, 1, 0.2);
				this.cubo.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(2.95, 0.5, 4.5);
	 			this.scene.scale(5.5, 1, 0.2);
				this.cubo.display();
			this.scene.popMatrix();
			this.cubo_texture.unbind();

			this.scene.pushMatrix();
				this.scene.translate(2.95, 0, 2.2);
				this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 			this.scene.scale(5.5, 4.5, 1);
	 			this.cubo1_texture.bind();
				this.quad.display();
				this.cubo1_texture.unbind();
			this.scene.popMatrix();
		}

		else {
			//box2
			this.cubo_texture.bind();
			this.scene.pushMatrix();
				this.scene.translate(0.1, 0.5, 2.3);
	 			this.scene.scale(0.2, 1, 4.6); 			
				this.cubo.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(3.3, 0.5, 2.3);
	 			this.scene.scale(0.2, 1, 4.6);
				this.cubo.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(1.6, 0.5, 0.1);
	 			this.scene.scale(3.2, 1, 0.2);
				this.cubo.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(1.6, 0.5, 4.5);
	 			this.scene.scale(3.2, 1, 0.2);
				this.cubo.display();
			this.scene.popMatrix();
			this.cubo_texture.unbind();

			this.scene.pushMatrix();
				this.scene.translate(1.6, 0, 2.2);
				this.scene.rotate(-Math.PI/2, 1, 0, 0);
	 			this.scene.scale(3.2, 4.4, 1);
	 			this.cubo1_texture.bind();
				this.quad.display();
				this.cubo1_texture.unbind();
			this.scene.popMatrix();
		}



		


	this.scene.popMatrix(); 		
 };

