/*function MyInterface(scene) {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application) {
	
	CGFinterface.prototype.init.call(this, application);
	
	this.gui = new dat.GUI();

	this.gui.add(this.scene, 'GUI');	
	
	var lights=this.gui.addFolder("Luzes");
	lights.open();
	var i = 0;
	for(light in this.scene.graph.lights)
		{
		var string = "Luz " + i;
		lights.add(this.scene, string);
		}

	return true;
};

*/

/**
 * MyInterface
 * @constructor
 */
 
 
function MyInterface(scene) {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 

	this.gui.add(this.scene, 'Controls');	

	// add a group of controls (and open/expand by defult)
	
	var lights=this.gui.addFolder("Luzes");
	for(id in this.scene.lightsInterface)
	{
		lights.add(this.scene.lightsInterface,id,this.scene.lightsInterface[id]);
	}

	return true;
};