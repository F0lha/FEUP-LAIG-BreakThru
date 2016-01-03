 function MyHead(scene, type) {
 	CGFobject.call(this,scene);

 	//materials
 	switch(type){
 		case 1:
 			this.head_texture = new CGFtexture(this.scene, "textures/plantHead1.png");
 			this.inside_texture = new CGFtexture(this.scene, "textures/insidetexture1.png");
 			break; 	
 		case 2:
 			this.head_texture = new CGFtexture(this.scene, "textures/plantHead2.png");
 			this.inside_texture = new CGFtexture(this.scene, "textures/insidetexture2.png");
 			break;
 		case 5:
 			this.head_texture = new CGFtexture(this.scene, "textures/plantHead2.png");
 			this.inside_texture = new CGFtexture(this.scene, "textures/insidetexture2.png");
 			break;
 		default :
			this.head_texture = new CGFtexture(this.scene, "textures/plantHead1.png");
 			this.inside_texture = new CGFtexture(this.scene, "textures/insidetexture1.png");
 			break;
 	}

 	//vehicle parts
 	this.head = new MySemiSphere(scene, 1, 50, 50); 	
 	this.headbot = new MyCylinder(scene, 0, 1, 0, 50, 50);
 	this.dentadura = new MyDentadura(scene, type);
 };

 MyHead.prototype = Object.create(CGFobject.prototype);
 MyHead.prototype.constructor = MyHead;

 MyHead.prototype.display = function() {
 	var degToRad = Math.PI / 180.0;
 	this.scene.pushMatrix();
 		//this.scene.scale(0.5,0.5,0.5);
 		//top
 		this.scene.pushMatrix();
 			this.scene.rotate(-30*degToRad, 1, 0, 0);

	 		this.scene.pushMatrix();
	 			this.head_texture.bind();
	 			this.scene.scale(0.5,0.5,0.5);
	 			this.scene.scale(0.9975,0.9975,0.9975);
	 			this.scene.rotate(-60*degToRad, 1, 0, 0);
				this.head.display();
				this.head_texture.unbind();
			this.scene.popMatrix();

			this.scene.pushMatrix();
	 			this.inside_texture.bind();
	 			this.scene.scale(0.5,0.5,0.5);
	 			this.scene.rotate(30*degToRad, 1, 0, 0);
				this.headbot.display();
				this.inside_texture.unbind();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.rotate(-80*degToRad, 1, 0, 0);	
				this.scene.rotate(180*degToRad, 0, 0, 1);
				this.scene.rotate(-4*degToRad, 0, 1, 0);
				this.dentadura.display();
			this.scene.popMatrix();

		this.scene.popMatrix();
		//bot
		this.scene.pushMatrix();
	 		this.scene.rotate(0*degToRad, 1, 0, 0);

			this.scene.pushMatrix();
	 			this.head_texture.bind();
	 			this.scene.scale(0.5,0.5,0.5);
	 			this.scene.rotate(160*degToRad, 1, 0, 0);
				this.head.display();
				this.head_texture.unbind();
			this.scene.popMatrix();

			this.scene.pushMatrix();
	 			this.inside_texture.bind();
	 			this.scene.scale(0.5,0.5,0.5);
	 			this.scene.rotate(-110*degToRad, 1, 0, 0);
				this.headbot.display();
				this.inside_texture.unbind();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.dentadura.display();
			this.scene.popMatrix();

		this.scene.popMatrix();

 		
 		
	this.scene.popMatrix();
 };
