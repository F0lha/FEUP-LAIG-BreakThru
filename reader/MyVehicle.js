 function MyVehicle(scene) {
 	CGFobject.call(this,scene);

 	//materials
 	this.red_hair = new CGFtexture(this.scene, "textures/red_hair.jpg");
 	this.white_hair = new CGFtexture(this.scene, "textures/white_hair.jpg");
 	this.blue_hair = new CGFtexture(this.scene, "textures/blue_hair.jpg");
 	this.fire = new CGFtexture(this.scene, "textures/fire.jpg");
 	this.head_texture = new CGFtexture(this.scene, "textures/head.jpg");

 	//vehicle parts
 	this.head = new MySphere(scene, 1, 20, 50);
 	this.asa1 = new MyPatch(scene, 3, 20, 20, [
			[3, 0, 0, 1], 
			[3, 0, 0, 1],
			[3, 0, 0, 1],
			[3, 0, 0, 1],		
	
			[2, 1, -2, 1], 
			[2, 2, -1.5, 1],
			[2, 2, 1.5, 1],
			[2, 1, 2, 1],

			[1, 1, -3, 1], 
			[1, 1, -2.5, 1],
			[1, 1, 0, 1],
			[1, 1, 0.5, 1],

			[1, 0.8, -1, 1], 
			[1, 0.8, -1, 1],
			[1, 0.8, -1, 1],
			[1, 0.8, -1, 1]]);
 	this.asa2 = new MyPatch(scene, 3, 20, 20, [
			[3, 0, 0, 1], 
			[3, 0, 0, 1],
			[3, 0, 0, 1],
			[3, 0, 0, 1],		
	
			[2, 1, -2, 1], 
			[2, 2, -1.5, 1],
			[2, 2, 1.5, 1],
			[2, 1, 2, 1],

			[1, 1, -0.5, 1], 
			[1, 1, 0, 1], 
			[1, 1, 1.5, 1],  
			[1, 1, 3, 1], 

			[1, 0.8, 1, 1], 
			[1, 0.8, 1, 1],
			[1, 0.8, 1, 1],
			[1, 0.8, 1, 1]]);
 	this.body = new MyCylinder(scene, 7, 1, 0.4, 30, 30);
 	this.bottom = new MyCylinder(scene, 0, 1, 0, 30, 30);
 };

 MyVehicle.prototype = Object.create(CGFobject.prototype);
 MyVehicle.prototype.constructor = MyVehicle;

 MyVehicle.prototype.display = function() {
 	this.scene.pushMatrix();
	this.scene.translate(0,0,-2);
 		this.scene.pushMatrix();
 			this.white_hair.bind();
 			this.scene.scale(0.5,0.5,0.5);
			this.body.display();
			this.white_hair.unbind();
		this.scene.popMatrix();

 		this.scene.pushMatrix();
 			this.head_texture.bind();
 			this.scene.translate(0,0,3.5);
 			this.scene.rotate(-Math.PI/2, 0, 0, 1);
 			this.scene.scale(0.5,0.5,0.75);
			this.head.display();
			this.head_texture.unbind();
		this.scene.popMatrix();
 		
 		this.scene.pushMatrix();
 			this.fire.bind();
 			this.scene.rotate(Math.PI, 0, 1, 0);	
 			this.scene.scale(0.5,0.5,0.5);
			this.bottom.display();
			this.fire.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.blue_hair.bind();
			this.scene.translate(-3,0,2);
			this.asa1.display();
			this.blue_hair.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.red_hair.bind();
			this.scene.translate(3,0,2);
			this.scene.rotate(Math.PI, 0, 1, 0);			
			this.asa2.display();
			this.red_hair.unbind();
		this.scene.popMatrix();
	this.scene.popMatrix();
 };
