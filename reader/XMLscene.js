
function XMLscene() {
    CGFscene.call(this);
	
	
	this.currTimer = 0;
	this.timerLastUpdate = 0;
	
	//interface
	
	
	this.Player1Difficulty = "Human";
	this.Player2Difficulty = "Human";
	
	this.playerDificulty = ["Human", "Easy", "Hard"];

	this.flag = true;
	this.state = "PROCESSING";
	this.board = [];
	this.texturesList = {};
	this.interface = null;
	this.app = null;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);
	
	this.interF = null;
	
    this.initCameras();
	
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	
	this.axis=new CGFaxis(this);
	
	this.setPickEnabled(true);
	
		
	this.textShader=new CGFshader(this.gl, "shaders/font.vert", "shaders/font.frag");

	// set number of rows and columns in font texture
	this.textShader.setUniformsValues({'dims': [16, 16]});
	
	this.appearance = new CGFappearance(this);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(120);

	// font texture: 16 x 16 characters
	// http://jens.ayton.se/oolite/files/font-tests/rgba/oolite-font.png
	this.fontTexture = new CGFtexture(this, "textures/oolite-font.png");
	this.appearance.setTexture(this.fontTexture);
};
/*
*	Sets the background color and global ambient lighting
*/
XMLscene.prototype.initIllumination = function () {
	//BackGround
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	//Ambient  
	this.setGlobalAmbientLight(this.graph.ambientR, this.graph.ambientG, this.graph.ambientB, this.graph.ambientA);
}
/*
*	Applies the inital transformations to the scene
*/
XMLscene.prototype.initialTransformations = function () {

	var initMatrix = mat4.create();
	
	mat4.identity(initMatrix);
	
	//translation
	mat4.translate(initMatrix,initMatrix,[this.graph.translationX,this.graph.translationY,this.graph.translationZ]);
	
	//rotation
	for(var i = 0; i < this.graph.rotationList.length;i++)
	{
		switch(this.graph.rotationList[i].axis)
		{
			case 'x':
				mat4.rotate(initMatrix, initMatrix, this.graph.rotationList[i].angle, [1,0,0]);
				break;
			case 'y':
				mat4.rotate(initMatrix, initMatrix, this.graph.rotationList[i].angle, [0,1,0]);
				break;
			case 'z':
				mat4.rotate(initMatrix, initMatrix, this.graph.rotationList[i].angle, [0,0,1]);
				break;
			default :
				console.log("Error in the rotation Axis");
				break;
		}
	}
	//scaling
	mat4.scale(initMatrix,initMatrix,[this.graph.sx,this.graph.sy,this.graph.sz]);
		
	this.multMatrix(initMatrix);
}

/*
*	Creates the CGFtextures based on the previously parsed information
*/
XMLscene.prototype.loadTextures = function () {

var loadedTexture;
var tempTexture;
for(var id in this.graph.textureList)
	{
		tempTexture = this.graph.textureList[id];
		loadedTexture = new CGFtexture(this,tempTexture.path);
		
		this.texturesList[id] = loadedTexture;
	}
}

/*
*	Creates the CGFappearance based on the previously parsed information
*/
XMLscene.prototype.loadMaterials = function () {

	this.materialList = {};
	var i = 0;
	
	for(id in this.graph.materialsList){
		var loadedMaterial = new CGFappearance(this);
		var tempMaterial = this.graph.materialsList[id];
		loadedMaterial.setShininess(tempMaterial.shininess);
		loadedMaterial.setSpecular(tempMaterial.specular.r,tempMaterial.specular.g,tempMaterial.specular.b,tempMaterial.specular.a);
		loadedMaterial.setDiffuse(tempMaterial.diffuse.r,tempMaterial.diffuse.g,tempMaterial.diffuse.b,tempMaterial.diffuse.a);
		loadedMaterial.setAmbient(tempMaterial.ambient.r,tempMaterial.ambient.g,tempMaterial.ambient.b,tempMaterial.ambient.a);
		loadedMaterial.setEmission(tempMaterial.emission.r,tempMaterial.emission.g,tempMaterial.emission.b,tempMaterial.emission.a);
		this.materialList[id] = loadedMaterial;
		i++;
	}
}

/*
* Creates the primitives based on the previously parsed information
*/
XMLscene.prototype.loadPrimitives = function () {
	this.primitiveList = {};
    for (id in this.graph.leavesList) {
    	var tempLeaf = this.graph.leavesList[id];
    	switch (tempLeaf.type) {
    		case "rectangle":
    			this.primitiveList[id] = new MyQuad(this, tempLeaf.args[0], tempLeaf.args[1], tempLeaf.args[2], tempLeaf.args[3]);
    			break;
    		case "triangle":
    			this.primitiveList[id] = new MyTriangle(this, tempLeaf.args[0], tempLeaf.args[1], tempLeaf.args[2], tempLeaf.args[3], tempLeaf.args[4], 
tempLeaf.args[5], tempLeaf.args[6], tempLeaf.args[7], tempLeaf.args[8]);
				break;
    		case "cylinder":
				this.primitiveList[id] = new MyCylinder(this, tempLeaf.args[0], tempLeaf.args[1], tempLeaf.args[2], tempLeaf.args[3], tempLeaf.args[4]);
				break;
			case "sphere":
				this.primitiveList[id] = new MySphere(this, tempLeaf.args[0], tempLeaf.args[1], tempLeaf.args[2], tempLeaf.args[3]);
				break;
			case "plane":
				this.primitiveList[id] = new Plane(this, tempLeaf.args[0]);
				break;
			case "patch":
				this.primitiveList[id] = new MyPatch(this, tempLeaf.args[0],tempLeaf.args[1],tempLeaf.args[2],tempLeaf.args[3]);
				break;
			case "vehicle":
    			this.primitiveList[id] = new MyVehicle(this);  
				break;
			case "terrain":
				this.primitiveList[id] = new Terrain(this, tempLeaf.args[0],tempLeaf.args[1]);
				break;
    	}
    }

}

/*
*	Creates the CGFlight based on the previously parsed information
*/
XMLscene.prototype.initLights = function () {
	
	this.lightsInterface = {};
	var i = 0;
	for (light in this.graph.lights)
	{		
		var tempLight = new CGFlight(this,i);
		
		if(this.graph.lights[light].enableV == true)
			tempLight.enable();
		else tempLight.disable();
				
		tempLight.setPosition(this.graph.lights[light].positionX,this.graph.lights[light].positionY,this.graph.lights[light].positionZ,this.graph.lights[light
].positionW);
		tempLight.setAmbient(this.graph.lights[light].ambientR,this.graph.lights[light].ambientG,this.graph.lights[light].ambientB,this.graph.lights[light].
ambientA);
		tempLight.setDiffuse(this.graph.lights[light].diffuseR,this.graph.lights[light].diffuseG,this.graph.lights[light].diffuseB,this.graph.lights[light].
diffuseA);
		tempLight.setSpecular(this.graph.lights[light].specularR,this.graph.lights[light].specularG,this.graph.lights[light].specularB,this.graph.lights[light
].specularA);
	
		tempLight.setVisible(true);
		
		tempLight.update();
		this.lightsInterface[light] = this.graph.lights[light].enableV;
		this.lights[light] = tempLight;
		i++;
	}	
	
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {

	

	this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;

	//new axis
    this.axis = new CGFaxis(this, this.graph.length);
	
	this.enableTextures(true);
	
	this.initIllumination();

	this.initLights();	
	
	//this.loadPrimitives();
	
	//this.loadMaterials();
	
	//this.loadTextures();
	
	//this.loadAnimations();
	
	this.setUpdatePeriod(50/6);
		
	this.RESETBOARD();
	
	if (this.interF != null)
	    this.interF.onGraphLoaded();
	
};

/*
*	Reset Board and Initialize it
*/
XMLscene.prototype.RESETBOARD = function() {

	this.state = "PROCESSING";

	this.Board = null;
	
	this.Board = new Board(this);
	
	var self = this;
	
	this.initBoard(
        function(matrix){
        self.Board.init(matrix);
        }
    );
	this.getPlays(this.Board,function(listPlays) {
					self.Board.parsingPlays(listPlays);
					self.state = "IDLE";
	});

}

/*
*	Returns array of coord from pick
*/
XMLscene.prototype.pickToCoord = function(pick) {

			var Y = (Math.floor(pick/11))+1;
			var X = (pick % 11)+1;
			var coord = new Array(X,Y);

return coord;

}

/*
*	Makes request to PROLOG to check if game has finished
*/
XMLscene.prototype.continueGame = function (self,callback, callbackObj){

	self.state = "PROCESSING"; // waiting for requests

	var board = matrixToList(self.Board.matrix);

	getPrologRequest("continue("+board+")",function(data) {
	
	var answer = data.target.response;
	
	if (typeof callback === "function") {
              callback.apply(callbackObj,[answer]);
        }
	},true);
}
/*
*	Makes the Bot Hard Play in PROLOG server and returns the NewBoard
*/
	XMLscene.prototype.makeHardPlay = function (self,callback, callbackObj){

	self.state = "PROCESSING"; // waiting for requests

	var board = matrixToList(self.Board.matrix);

	getPrologRequest("playBest("+board+","+self.Board.currentPlayer+","+ self.Board.currentCostLeft +")",function(data) {
	
	var temp = listToMatrix(data.target.response);
	
	var matrix = temp[0];
	
	self.Board.updateCostLeft(temp[1]);
	
	if (typeof callback === "function") {
              callback.apply(callbackObj,[self,matrix]);
        }
	},true);

}

/*
*	Makes the Bot Easy Play in PROLOG server and returns the NewBoard
*/
XMLscene.prototype.makeEasyPlay = function (self,callback, callbackObj){

	self.state = "PROCESSING"; // waiting for requests

	var board = matrixToList(self.Board.matrix);

	getPrologRequest("playRandom("+board+","+self.Board.currentPlayer+","+ self.Board.currentCostLeft +")",function(data) {
	
	var temp = listToMatrix(data.target.response);
	
	var matrix = temp[0];
	
	self.Board.updateCostLeft(temp[1]);
	
	if (typeof callback === "function") {
              callback.apply(callbackObj,[self,matrix]);
        }
	},true);

}

/*
*	Makes the play in PROLOG server and returns the NewBoard
*/
XMLscene.prototype.makePlays = function (self,finalPick,callback, callbackObj){

	var initC = this.pickToCoord(self.Board.selectedID);
	var finalC = this.pickToCoord(finalPick);


	var board = matrixToList(self.Board.matrix);

getPrologRequest("makePlay("+board+","+initC[0]+","+initC[1]+","+finalC[0]+","+finalC[1]+")",function(data) {
	
	var matrix = listToMatrix(data.target.response);
	
	self.Board.updateCostLeft(self.Board.costMove[self.Board.currentIDFromList]);
	
	if (typeof callback === "function") {
              callback.apply(callbackObj,[self,matrix]);
        }
	},true);

}

/*
*	Gets the possible plays from PROLOG based on current player
*/
XMLscene.prototype.getPlays = function (Board,callback, callbackObj){

var board = matrixToList(Board.matrix);

getPrologRequest("getPlays("+board+","+Board.currentPlayer+","+ Board.currentCostLeft + ")",function(data) {
	
	var playList = data.target.response;
	if (typeof callback === "function") {
              callback.apply(callbackObj,[playList]);
        }
	},true);

}

/*
*	Initializes the Board, connecting to PROLOG
*/
XMLscene.prototype.initBoard = function (callback, callbackObj){

	getPrologRequest("initialize",function(data) {
	
	var matrix = listToMatrix(data.target.response);
	if (typeof callback === "function") {
              callback.apply(callbackObj,[matrix]);
        }
	},true);
}

/*
*  Gets list of pieces based on picking
*/
XMLscene.prototype.getListOfPicking = function (pick){

				var coord = this.pickToCoord(pick);
				var coordStr = coord.toString();
					
				var list = this.getIdPieceLocation(coordStr);

		return list;
}

/*
*	Returns true if the current pick is a possible destination, false if not
*/
XMLscene.prototype.isADest = function (pick,list){

			var coord = this.pickToCoord(pick);
			var coordStr = coord.toString();
			
			for(id in list)
				{
					var tempCoord = this.Board.destLocation[list[id]];
					
					this.Board.currentIDFromList = list[id];
					
					if(tempCoord.toString() == coordStr)
						return true;
				}
				
		return false;
}

XMLscene.prototype.putBoardAndGetPlays = function (self,matrix){
							self.Board.newMatrix(matrix);
							self.continueGame(self,function(answer) {
								if(answer == 1){
									self.Board.gameOver = true;
									self.Board.resetSelection();
									}
								else 
									{
										self.Board.resetSelection();
										self.state = "ANIMATION";
									}
							});
							if(!self.Board.gameOver){
							self.Board.updateBoard();
							self.getPlays(self.Board,function(listPlays) {
								self.Board.parsingPlays(listPlays);
								});
								}

}

/*
*	Process the Picking
*/
XMLscene.prototype.Picking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
			var obj = this.pickResults[i][0];
			if (obj)
			{
				var pick = this.pickResults[i][1] - 1;	
				//State machine for picking
				switch(this.state){
				case "IDLE":
					var list = this.getListOfPicking(pick);
					
					if(list.length != 0){
						this.Board.defineSelection(pick,list);
						this.state = "PRESSED";
						}
					break;
				case "PROCESSING":
				// waiting for requests	
					break;
					
				case "PRESSED":
					if(this.Board.selectedID == pick){ //reset selection
						this.Board.resetSelection();
						}
					else if(this.isADest(pick,this.Board.listSelected))
						{
							var self = this;
						
							this.makePlays(self,pick,this.putBoardAndGetPlays);
						}
						break;
				default: 
					break;
				}				
			}
		}
		this.pickResults.splice(0,this.pickResults.length);
		}	
	}
}

/*
* 	Returns the list of the Movable Pieces
*/
XMLscene.prototype.getIdPieceLocation = function (coord) {

var list = [];

	for(id in this.Board.piecesLocation)
		{
			var temp = this.Board.piecesLocation[id].toString();
			if(temp == coord)
				list.push(parseInt(id));
		}
	return list;
}

/*	
*	Creates Animations and sets them for each node
*/ 
XMLscene.prototype.loadAnimations = function () {

	for(nodeID in this.graph.nodesList)
		{
			for(var i = 0; i < this.graph.nodesList[nodeID].animationIDList.length;i++)
				{
					this.graph.nodesList[nodeID].animationList.push(Object.create(this.graph.animationsList[this.graph.nodesList[nodeID].animationIDList[i]]));
				}
		}
}
	
/*	
*	Creates MyInterface and sets it as the project interface
*/ 
XMLscene.prototype.setInterface = function (interF) {

	this.interF = interF;

}
/*
*	Updates the lights
*	Function is called in the display function
*/
XMLscene.prototype.displayLights = function () {

		for(id in this.lightsInterface)
		{
		if(this.lightsInterface[id])
			this.lights[id].enable();
		else this.lights[id].disable();
		}

		for(id in this.lights){
			this.lights[id].update();
		}

}


/*
*	Bot Play
*/
XMLscene.prototype.PLAY = function () {
	if(this.state == "IDLE")
	{
		var self = this;
		
		switch(this.Board.currentPlayer){
		
			case 0:
				if(this.Player1Difficulty == "Easy")
					{
						this.makeEasyPlay(self,this.putBoardAndGetPlays);
					}
				else if(this.Player1Difficulty == "Hard")
					{
						this.makeHardPlay(self,this.putBoardAndGetPlays);
					}
				break;
			case 1:
				if(this.Player2Difficulty == "Easy")
					{
						this.makeEasyPlay(self,this.putBoardAndGetPlays);
					}
				else if(this.Player2Difficulty == "Hard")
					{
						this.makeHardPlay(self,this.putBoardAndGetPlays);
					}
				break;
		
		}
	
	
	}
}
	
	
/*
*	Default display function
*/	
XMLscene.prototype.display = function () {

	// ---- BEGIN Background, camera and axis setup

	
	// Clear image and depth buffer every time we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
	
	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		//this.initialTransformations();
		
		this.interF.updateInterface();
		
		if(!this.Board.gameOver &&  this.state != "ANIMATION"){
			if(this.Board.currentPlayer == 0 && this.Player1Difficulty == "Human"){
				this.setPickEnabled(true);
				this.Picking();
				this.clearPickRegistration();
			}
			else if(this.Board.currentPlayer == 1 && this.Player2Difficulty == "Human"){
				this.setPickEnabled(true);
				this.Picking();
				this.clearPickRegistration();
			}	
			else{
				//bot plays
				this.setPickEnabled(false);
			}}
		else {
		this.setPickEnabled(false);
		}
			
		// Draw axis
		if (this.axis.length != 0) 
			this.axis.display();
			
		this.displayLights();
		
		//this.drawNode(this.graph.rootID,'null','null');
		
		this.pushMatrix();
		
		//this.translate(200,200,200);
				
		this.Board.display();
		
		this.popMatrix();

	};

};

//recursively called function to draw the node descendants as its drawing the current node

XMLscene.prototype.drawNode = function(nodeID,prevMaterial,prevTexture){

	//If this node is a primitive then it is displayed
	if(this.primitiveList[nodeID] != null)
	{	
		var currentApperance = null;
		if (prevMaterial != null && prevMaterial != "null")
			currentApperance = this.materialList[prevMaterial];
		else currentApperance = new CGFappearance(this);
		
		var flag = 0;
		var tempTexture = null;
		if (prevTexture != null &&  prevTexture != "null")
		{
			flag = 1;
			var texture = this.graph.textureList[prevTexture];
			tempTexture = this.texturesList[prevTexture];
			this.primitiveList[nodeID].applyAmplifFactors(texture.amplif_factorS,texture.amplif_factorT);
			currentApperance.setTexture(tempTexture);
		}
		currentApperance.apply();
		this.primitiveList[nodeID].display();
		if(flag)
			currentApperance.setTexture(tempTexture);
		
		
		
		return; // end recursive
	}
	else {
	var currNode = this.graph.nodesList[nodeID];
	if(currNode == null){
		return;}
	//applying this nodes properties
	
	
	
	var descedentsMaterial, descedentsTexture;
	
	if(currNode.material == "null"|| currNode.material == null)
		descedentsMaterial = prevMaterial;
	else descedentsMaterial = currNode.material;
	if(currNode.texture == "clear")
		descedentsTexture = "null";
	else if(currNode.texture == "null" || currNode.texture == null)
		descedentsTexture = prevTexture;
	else 
		descedentsTexture = currNode.texture;
	
	this.pushMatrix();
		
	this.multMatrix(currNode.mat);

	this.animate(currNode);
	
	
	var nDescendants= currNode.descendants.length; 
	
	for(var i = 0; i < nDescendants;i++){
		this.drawNode(currNode.descendants[i],descedentsMaterial,descedentsTexture);
		}
	}
	this.popMatrix();
}

XMLscene.prototype.animate = function (currNode) {

	for(var i = 0; i <= currNode.currentAnimation;i++){
	if(currNode.animationList[i] == null)
		continue;
	var delta = this.currTimer - this.timerLastUpdate;
	
	if(delta > 0 && this.currTimer != 0 && this.timerLastUpdate != 0){
		var Matrix = currNode.animationList[i].getMatrix(delta);

		this.multMatrix(Matrix);
		}
	
	if(currNode.animationList[currNode.currentAnimation].getFinished() == true)
		if(currNode.currentAnimation == currNode.animationList.length - 1)
			;
		else currNode.currentAnimation++;
	}
}

XMLscene.prototype.update = function (currTime) {

	if(this.timerLastUpdate == 0){
	this.currTime = currTime;
	this.timerLastUpdate = currTime-1;
	}
	else{
		this.timerLastUpdate = this.currTimer;
		this.currTimer = currTime;
}
		this.Board.delta = this.currTimer - this.timerLastUpdate;

}