 function MyPlant(scene, type) {
 	CGFobject.call(this,scene);
 	this.type = type;
 	//materials
 	this.leaf_texture = new CGFtexture(this.scene, "textures/leaftexture.jpg");
 	this.caule_texture = new CGFtexture(this.scene, "textures/cauletexture.jpg");
 	this.base_texture = new CGFtexture(this.scene, "textures/basetexture.jpg");

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
 	
 	this.caule = new MyCylinder(scene, 1, 0.15, 0.05, 30, 30);
 	this.head = new MyHead(scene, type);
 	this.crown = new MyCoroa(scene);
 };

 MyPlant.prototype = Object.create(CGFobject.prototype);
 MyPlant.prototype.constructor = MyPlant;

 MyPlant.prototype.display = function() {
 	this.scene.pushMatrix();
 		//this.scene.scale(0.5,0.5,0.5);

 		this.scene.pushMatrix();
 			this.base_texture.bind();
 			this.scene.scale(0.3,0.25,0.3);
			this.base.display();
			this.base_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.leaf_texture.bind();
 			this.scene.translate(0.95, 0.4, 0);
 			this.scene.rotate(Math.PI, 0, 1, 0);
 			this.scene.scale(0.3,0.2,0.3);
			this.leaf.display();
			this.leaf_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.leaf_texture.bind();
 			this.scene.translate(-0.95, 0.4, 0);
 			this.scene.scale(0.3,0.2,0.3);
			this.leaf.display();
			this.leaf_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.caule_texture.bind();
 			this.scene.translate(0,0.06,0);
 			this.scene.rotate(-Math.PI/2, 1, 0, 0);
			this.caule.display();
			this.caule_texture.unbind();
		this.scene.popMatrix();

		this.scene.pushMatrix();
 			this.scene.translate(0,1.3,0);
 			this.scene.rotate(Math.PI/8, 1, 0, 0);
			this.head.display();
		this.scene.popMatrix();
		if(this.type == 5){
			this.scene.pushMatrix();
	 			this.scene.translate(0, 1.6, -0.4);
	 			this.scene.scale(0.4, 0.4, 0.4);
	 			this.scene.rotate(-Math.PI/6, 1, 0, 0);
				this.crown.display();
			this.scene.popMatrix();	
		}
 		
 		
	this.scene.popMatrix();
 };
