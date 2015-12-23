 function MyPlant(scene) {
 	CGFobject.call(this,scene);

 	//materials
 	this.red_hair = new CGFtexture(this.scene, "textures/red_hair.jpg");
 	this.white_hair = new CGFtexture(this.scene, "textures/white_hair.jpg");
 	this.blue_hair = new CGFtexture(this.scene, "textures/blue_hair.jpg");
 	this.fire = new CGFtexture(this.scene, "textures/fire.jpg");
 	this.head_texture = new CGFtexture(this.scene, "textures/head.jpg");

 	//vehicle parts
 	this.base = new MySemiSphere(scene, 1, 20, 20);
 	this.leaf = new MyPatch(scene, 3, 20, 20, [
			[3, 0, 0, 1], 
			[3, 0, 0, 1],
			[3, 0, 0, 1],
			[3, 0, 0, 1],		
	
			[2, 0.8, -1.5, 1], 
			[2, 2, 0, 1],
			[2, 2, 0, 1],
			[2, 0.8, 1.5, 1],

			[1, 1, -1, 1], 
			[1, 1, 0, 1],
			[1, 1, 0, 1],
			[1, 1, 1, 1],

			[1, 0.8, 0, 1], 
			[1, 0.8, 0, 1],
			[1, 0.8, 0, 1],
			[1, 0.8, 0, 1]]);
 	
 	this.caule = new MyCylinder(scene, 1, 0.2, 0.1, 30, 30);
 };

 MyPlant.prototype = Object.create(CGFobject.prototype);
 MyPlant.prototype.constructor = MyPlant;

 MyPlant.prototype.display = function() {
 	this.scene.pushMatrix();
 		this.scene.scale(0.8,0.5,0.8);

 		this.scene.pushMatrix();
 			this.blue_hair.bind();
 			this.scene.scale(0.5,0.5,0.5);
			this.base.display();
			this.blue_hair.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.blue_hair.bind();
 			this.scene.translate(1, 0.7, 0);
 			this.scene.rotate(Math.PI, 0, 1, 0);
 			this.scene.scale(0.3,0.3,0.3);
			this.leaf.display();
			this.blue_hair.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.blue_hair.bind();
 			this.scene.translate(-1, 0.7, 0);
 			this.scene.scale(0.3,0.3,0.3);
			this.leaf.display();
			this.blue_hair.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.blue_hair.bind();
 			this.scene.translate(0,0.4,0);
 			this.scene.rotate(-Math.PI/2, 1, 0, 0);
			this.caule.display();
			this.blue_hair.unbind();
		this.scene.popMatrix();
 		
 		
	this.scene.popMatrix();
 };
