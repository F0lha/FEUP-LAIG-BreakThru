/**
 * MyInterface
 * @constructor
 */
 
 
function MyInterface() {
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

	this.player1Play = false;
	this.player2Play = false;
	
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 


};

MyInterface.prototype.updateInterface = function(){
	if(this.scene.Player1Difficulty != "Human" && !this.player1Play && this.scene.Board.currentPlayer == 0){
		this.scene.Board.resetSelection();
		this.button1 = this.player1.add(this.scene, "PLAY");
		this.player1Play = true;
	}
	else if((this.scene.Player1Difficulty == "Human" && this.player1Play)|| (this.scene.Board.currentPlayer != 0 && this.player1Play))
	{
		this.player1.remove(this.button1);
		this.player1Play = false;
	}
	
		
	if(this.scene.Player2Difficulty != "Human" && !this.player2Play && this.scene.Board.currentPlayer == 1){
		this.scene.Board.resetSelection();
		this.button2 = this.player2.add(this.scene, "PLAY");
		this.player2Play = true;
	}
	else if((this.scene.Player2Difficulty == "Human" && this.player2Play)|| (this.scene.Board.currentPlayer != 1  && this.player2Play))
	{
		this.player2.remove(this.button2);
		this.player2Play = false;
	}
}

MyInterface.prototype.onGraphLoaded = function(){
	this.gui.add(this.scene, 'Controls');	

	// add a group of controls (and open/expand by default)
	
	var lights=this.gui.addFolder("Luzes");
	for(id in this.scene.lightsInterface)
	{
		lights.add(this.scene.lightsInterface,id,this.scene.lightsInterface[id]);
	}
	
	this.player1=this.gui.addFolder("Player1");
	this.player1.open();
	
	this.player1.add(this.scene, 'Player1Difficulty', this.scene.player1Dificulty);
	
	
	
	this.player2=this.gui.addFolder("Player2");
	this.player2.open();
	
	this.player2.add(this.scene, 'Player2Difficulty', this.scene.player2Dificulty);
	
	//restartButton
	
	this.gui.add(this.scene, "RESETBOARD");
	

	return true;
}