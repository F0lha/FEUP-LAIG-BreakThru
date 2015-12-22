function Terrain(scene, texturePath, HMPath) {
	CGFobject.call(this,scene);
	
	//default appearance for now
	this.terrainMaterial = new CGFappearance(scene);
	
	this.terrainMaterial.setAmbient(0.2, 0.2, 0.2, 1.0);
    this.terrainMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.terrainMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.terrainMaterial.setShininess(10.0);
	this.terrainMaterial.setEmission(0.0, 0.0, 0.0, 1.0);
	
	this.texture = new CGFtexture(scene,texturePath);
	
	//this.terrainMaterial.setTexture(this.texture);
    //this.terrainMaterial.setTextureWrap('REPEAT', 'REPEAT');
	
	this.HM = new CGFtexture(scene,HMPath);
	this.terrainShader = new CGFshader(scene.gl,"shaders/terrain.vert","shaders/terrain.frag");
	this.terrainShader.setUniformsValues({HM: 1});
	this.terrainShader.setUniformsValues({map: 0});
	
	this.plane = new Plane(scene,50);
}
	
Terrain.prototype = Object.create(CGFobject.prototype);
Terrain.prototype.constructor =Terrain;

Terrain.prototype.display = function() {

    this.terrainMaterial.apply();
    this.scene.setActiveShader(this.terrainShader);
	
    this.scene.pushMatrix();
	this.HM.bind(1);
	this.texture.bind(0);
	this.plane.display();
	this.scene.setActiveShader(this.scene.defaultShader);
	this.scene.popMatrix();
	
    
};