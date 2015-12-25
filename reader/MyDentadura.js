 function MyDentadura(scene, type) {
 	CGFobject.call(this,scene);

 	//materials
 	switch(type){
 		case 1:
			this.teeth_texture = new CGFtexture(this.scene, "textures/teethtexture1.png");
 			break; 	
 		case 2:
			this.teeth_texture = new CGFtexture(this.scene, "textures/teethtexture2.png");
 			break;
 		case 5:
			this.teeth_texture = new CGFtexture(this.scene, "textures/teethtexture2.png");
 			break;
 		default :
			this.teeth_texture = new CGFtexture(this.scene, "textures/teethtexture.png");
 			break;
 	}
 

 	//vehicle parts
 	this.dente = new MyCylinder(scene, 0.2, 0.1, 0, 50, 50);
 };

 MyDentadura.prototype = Object.create(CGFobject.prototype);
 MyDentadura.prototype.constructor = MyDentadura;

 MyDentadura.prototype.display = function() {
 	var degToRad = Math.PI / 180.0;
 	this.scene.pushMatrix();

		this.scene.pushMatrix();
 			this.teeth_texture.bind();
 			this.scene.translate(0.38, 0.05, 0.2);
 			this.scene.scale(0.5,0.5,0.5);
 			this.scene.rotate(-110*degToRad, 1, 0, 0);
			this.dente.display();
			this.teeth_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.teeth_texture.bind();
 			this.scene.translate(0.305, 0.085, 0.29);
 			this.scene.scale(0.5,0.5,0.5);
 			this.scene.rotate(-110*degToRad, 1, 0, 0);
			this.dente.display();
			this.teeth_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.teeth_texture.bind();
 			this.scene.translate(0.21, 0.11, 0.36);
 			this.scene.scale(0.5,0.5,0.5);
 			this.scene.rotate(-110*degToRad, 1, 0, 0);
			this.dente.display();
			this.teeth_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.teeth_texture.bind();
 			this.scene.translate(0.1, 0.12, 0.4);
 			this.scene.scale(0.5,0.5,0.5);
 			this.scene.rotate(-110*degToRad, 1, 0, 0);
			this.dente.display();
			this.teeth_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.teeth_texture.bind();
 			this.scene.translate(-0.01, 0.13, 0.42);
 			this.scene.scale(0.5,0.5,0.5);
 			this.scene.rotate(-110*degToRad, 1, 0, 0);
			this.dente.display();
			this.teeth_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.teeth_texture.bind();
 			this.scene.translate(-0.13, 0.12, 0.4);
 			this.scene.scale(0.5,0.5,0.5);
 			this.scene.rotate(-110*degToRad, 1, 0, 0);
			this.dente.display();
			this.teeth_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.teeth_texture.bind();
 			this.scene.translate(-0.24, 0.1, 0.35);
 			this.scene.scale(0.5,0.5,0.5);
 			this.scene.rotate(-110*degToRad, 1, 0, 0);
			this.dente.display();
			this.teeth_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.teeth_texture.bind();
 			this.scene.translate(-0.325, 0.07, 0.28);
 			this.scene.scale(0.5,0.5,0.5);
 			this.scene.rotate(-110*degToRad, 1, 0, 0);
			this.dente.display();
			this.teeth_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.teeth_texture.bind();
 			this.scene.translate(-0.38, 0.03, 0.18);
 			this.scene.scale(0.5,0.5,0.5);
 			this.scene.rotate(-110*degToRad, 1, 0, 0);
			this.dente.display();
			this.teeth_texture.unbind();
		this.scene.popMatrix();

	this.scene.popMatrix(); 	
 };
