
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() {
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	//var error = this.parseGlobalsExample(rootElement);

	var error = this.parseAnimations(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}	
	
	error = this.parseInitials(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}	
	
	error = this.parseIllumination(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}	
	
	error = this.parseLights(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}	
	
	error = this.parseTextures(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}	
	
	error = this.parseMaterials(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}	
	
	error = this.parseLeaves(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseNodes(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}


	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

/*
* Does the parsing of the information of the nodes from the .lsx
*/

MySceneGraph.prototype.parseAnimations= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('ANIMATIONS');
	
	if (elems == null) {
		return "Animations elements is missing.";
	}
	
	var animationsVar = elems[0].getElementsByTagName('ANIMATION');
	
	if (animationsVar == null) {
		return "No animation sources found.";
	}
	
	var nAnimations = animationsVar.length;
	
	this.animationsList = {};
	
	var tempAnimation;
	
	for(var i = 0; i < nAnimations; i++)
	{
		flagError = 0;
		var animationSpan = this.reader.getFloat(animationsVar[i],'span',1); 
		var animationType = this.reader.getString(animationsVar[i],'type',1); 
		
		if(animationType == "linear")
			{
			      var controlPointsList = animationsVar[i].getElementsByTagName('controlpoint');
				  
				  var tempControlPoints = [];
				  
				  for(var j = 0; j < controlPointsList.length;j++)
				  {
					var tempPoint = vec4.fromValues(this.reader.getFloat(controlPointsList[j],'xx'),
													this.reader.getFloat(controlPointsList[j],'yy'),
													this.reader.getFloat(controlPointsList[j],'zz'),1);
					tempControlPoints.push(tempPoint);
				  }
				  if(tempControlPoints.length < 1){
					console.log("Few Points Given");
					flagError = 1;
					}
					if(!flagError)
					tempAnimation = new MyLinearAnimation(this.scene,animationSpan,tempControlPoints);
			}
			
		else if(animationType == "circular")
			{
				var center = this.reader.getVector3(animationsVar[i],'center');
				var radius = this.reader.getFloat(animationsVar[i],'radius');
				var startang = this.reader.getFloat(animationsVar[i],'startang');
				var rotang = this.reader.getFloat(animationsVar[i],'rotang');
				
				tempAnimation = new MyCircularAnimation(this.scene,animationSpan,center,radius,startang,rotang);
			}
		else{
			flagError = 1;
			console.log("An error has occurred");
			}
	
		if(!flagError){
		var animationID = this.reader.getString(animationsVar[i],'id',1); 
		this.animationsList[animationID] = tempAnimation;
		}
	}
	
	
}

MySceneGraph.prototype.parseNodes= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('NODES');
		
	if (elems == null) {
		return "NODES elements is missing.";
	}
	else if (elems.length != 1) {
		return "either zero or more than one 'NODES' element found.";
	}
	
	var rootVar = elems[0].getElementsByTagName('ROOT');
	
	if(rootVar.length != 1)
		return "either zero or more than one 'ROOT' element found.";
		
	this.rootID = this.reader.getString(rootVar[0], 'id');
	
	var nodesVar = elems[0].getElementsByTagName('NODE');
	
	if (nodesVar == null) {
		return "No NODE sources found.";
	}
	
	var nNodes = nodesVar.length;
	
	console.log("No of nodes : " + nNodes);
	
	this.nodesList = {};
	
	for(var i = 0; i < nNodes;i++){
		var tempNode = new MyNode();
		mat4.identity(tempNode.mat);
		
		//material
		var tempMaterial = nodesVar[i].getElementsByTagName('MATERIAL');
		tempNode.material = this.reader.getString(tempMaterial[0],'id',1);
		if(tempNode.material == 'null')
			tempNode.material = null;
		//texture
		var tempTexture = nodesVar[i].getElementsByTagName('TEXTURE');
		tempNode.texture = this.reader.getString(tempTexture[0],'id',1);
		if(tempNode.texture == 'null')
			tempNode.texture = null;
			
		var tempAnimation = nodesVar[i].getElementsByTagName('ANIMATIONREF');
		for(var j = 0; j < tempAnimation.length;j++){
			var id = this.reader.getString(tempAnimation[j],'id',1);
			if(id != 'null')
			tempNode.animationIDList.push(id);
		}
		
		
		var DegreeToRadian = Math.PI / 180; // LSX angle values are given in Degrees
		var tempChildren = nodesVar[i].children;
		
		for(var j = 0; j < tempChildren.length;j++)
		{
			switch(tempChildren[j].tagName){
				case 'TRANSLATION':
				var tempX = this.reader.getFloat(tempChildren[j], 'x', 1);
				var tempY = this.reader.getFloat(tempChildren[j], 'y', 1);
				var tempZ = this.reader.getFloat(tempChildren[j], 'z', 1);
				mat4.translate(tempNode.mat,tempNode.mat,vec3.fromValues(tempX,tempY,tempZ));
				break;
				case 'ROTATION':
				var tempAxis = this.reader.getString(tempChildren[j],'axis',1);
				var tempAngle = this.reader.getFloat(tempChildren[j],'angle',1)*DegreeToRadian;
				switch(tempAxis){
				case 'x':
					mat4.rotate(tempNode.mat,tempNode.mat,tempAngle,[1,0,0]);
					break;
				case 'y':
					mat4.rotate(tempNode.mat,tempNode.mat,tempAngle,[0,1,0]);
					break;
				case 'z':
					mat4.rotate(tempNode.mat,tempNode.mat,tempAngle,[0,0,1]);
					break;
				}
				break;
				case 'SCALE':
				var tempSX = this.reader.getFloat(tempChildren[j], 'sx', 1);
				var tempSY = this.reader.getFloat(tempChildren[j], 'sy', 1);
				var tempSZ = this.reader.getFloat(tempChildren[j], 'sz', 1);
				mat4.scale(tempNode.mat,tempNode.mat,vec3.fromValues(tempSX,tempSY,tempSZ));
				break;
			}
		}
		
		var descVar = nodesVar[i].getElementsByTagName('DESCENDANTS');
		
		if(descVar == null)
			return "DESCENDANTS elements is missing."; 
			
		
			
		var descList = descVar[0].getElementsByTagName('DESCENDANT');
		
		if(descList == null)
			return "DESCENDANT elements is missing."; 
			
		var nDesc = descList.length;
		for(var j = 0; j < nDesc;j++){
			var id = this.reader.getString(descList[j],'id',1);
			tempNode.descendants.push(id);
		}
		var nodeID = this.reader.getString(nodesVar[i],'id',1); 
		this.nodesList[nodeID] = tempNode;
	}
}

/*
* Does the parsing of the information of the leaves from the .lsx
*/

MySceneGraph.prototype.parseLeaves= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('LEAVES');
		
	if (elems == null) {
		return "LEAVES elements is missing.";
	}
	else if (elems.length != 1) {
		return "either zero or more than one 'LEAVES' element found.";
	}
	var leavesVar = elems[0].getElementsByTagName('LEAF');
	
	if (leavesVar == null) {
		return "No LEAF sources found.";
	}
	
	var nLeaves = leavesVar.length;
	
	this.leavesList = {};

	
	for(var i = 0; i < nLeaves;i++){
	
		var tempLeaf = {type:"",args:[]};
		
		var id = this.reader.getString(leavesVar[i],'id',1);
		tempLeaf.type = this.reader.getItem(leavesVar[i], 'type', ['rectangle', 'cylinder', 'sphere', 'triangle','plane', 'patch', 'vehicle','terrain']);
		if(tempLeaf.type  == 'patch')
		{
			var order = this.reader.getInteger(leavesVar[i],'order',1);
			(tempLeaf.args).push(order);
			var partsU = this.reader.getInteger(leavesVar[i],'partsU',1);
			(tempLeaf.args).push(partsU);
			var partsV = this.reader.getInteger(leavesVar[i],'partsV',1);
			(tempLeaf.args).push(partsV);
			
			
		var controlPointsList = leavesVar[i].getElementsByTagName('controlpoint');
		
		if(controlPointsList == null)
			return "Control Points elements is missing."; 
			
		var nControlPoints = controlPointsList.length;
		
		var controlPointsVec = [];
		for(var j = 0; j < nControlPoints;j++){
			var tempPoint = vec3.fromValues(this.reader.getFloat(controlPointsList[j],'x'),
													this.reader.getFloat(controlPointsList[j],'y'),
													this.reader.getFloat(controlPointsList[j],'z'));
			(controlPointsVec).push(tempPoint);
		}
			tempLeaf.args.push(controlPointsVec);
		}
		else if(tempLeaf.type  == 'plane')
		{
			var parts = this.reader.getInteger(leavesVar[i],'parts',1);
			(tempLeaf.args).push(parts);
		}
		else if(tempLeaf.type  == 'vehicle')
		{
			;
		}
		else if(tempLeaf.type  == 'terrain')
		{
			var texture = this.reader.getString(leavesVar[i],'texture',1);
			(tempLeaf.args).push(texture);
			var heightmap = this.reader.getString(leavesVar[i],'heightmap',1);
			(tempLeaf.args).push(heightmap);
		}
		else{
		var args = leavesVar[i].getAttribute('args').match(/\S+/g);
		
		for(var j = 0; j < args.length;j++)
			(tempLeaf.args).push(parseFloat(args[j]));
		
		switch(tempLeaf.type){
		case 'rectangle':
			if(tempLeaf.args.length != 4)
				return "Wrong No of rectangle args";
		break;
		case 'cylinder':
			if(tempLeaf.args.length != 5)
				return "Wrong No of cylinder args";
		break;
		case 'sphere':
			if(tempLeaf.args.length != 3)
				return "Wrong No of sphere args";
		break;
		case 'triangle':
			if(tempLeaf.args.length != 9)
				return "Wrong No of triangle args";
		break;
		}
		}
		this.leavesList[id] = tempLeaf;
		
	}
}

/*
* Does the parsing of the information of the materials from the .lsx
*/

MySceneGraph.prototype.parseMaterials= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('MATERIALS');
		
	if (elems == null) {
		return "MATERIALS elements is missing.";
	}
	else if (elems.length != 1) {
		return "either zero or more than one 'MATERIALS' element found.";
	}
	
	var materialsVal = elems[0].getElementsByTagName('MATERIAL');
	
	if (materialsVal == null) {
		return "No TEXTURE sources found.";
	}
	var nMaterials = materialsVal.length;
	
	this.materialsList = {};
	
	for(var i = 0; i < nMaterials;i++)
		{
			var tempMaterial = {shininess:0,specular:{r:0,g:0,b:0,a:0},diffuse:{r:0,g:0,b:0,a:0},ambient:{r:0,g:0,b:0,a:0},emission:{r:0,g:0,b:0,a:0}};
			
			var id = this.reader.getString(materialsVal[i],'id',1);

			var shininess = materialsVal[i].getElementsByTagName('shininess');
			tempMaterial.shininess = this.reader.getFloat(shininess[0],'value',1);
			
			var specular = materialsVal[i].getElementsByTagName('specular');
			tempMaterial.specular.r = this.reader.getFloat(specular[0],'r',1);
			tempMaterial.specular.g = this.reader.getFloat(specular[0],'g',1);
			tempMaterial.specular.b = this.reader.getFloat(specular[0],'b',1);
			tempMaterial.specular.a = this.reader.getFloat(specular[0],'a',1);
			
			var diffuse = materialsVal[i].getElementsByTagName('diffuse');
			tempMaterial.diffuse.r = this.reader.getFloat(diffuse[0],'r',1);
			tempMaterial.diffuse.g = this.reader.getFloat(diffuse[0],'g',1);
			tempMaterial.diffuse.b = this.reader.getFloat(diffuse[0],'b',1);
			tempMaterial.diffuse.a = this.reader.getFloat(diffuse[0],'a',1);
			
			var ambient = materialsVal[i].getElementsByTagName('ambient');
			tempMaterial.ambient.r = this.reader.getFloat(ambient[0],'r',1);
			tempMaterial.ambient.g = this.reader.getFloat(ambient[0],'g',1);
			tempMaterial.ambient.b = this.reader.getFloat(ambient[0],'b',1);
			tempMaterial.ambient.a = this.reader.getFloat(ambient[0],'a',1);
			
			var emission = materialsVal[i].getElementsByTagName('emission');
			tempMaterial.emission.r = this.reader.getFloat(emission[0],'r',1);
			tempMaterial.emission.g = this.reader.getFloat(emission[0],'g',1);
			tempMaterial.emission.b = this.reader.getFloat(emission[0],'b',1);
			tempMaterial.emission.a = this.reader.getFloat(emission[0],'a',1);
						
			this.materialsList[id] = tempMaterial;
		}
}

/*
* Does the parsing of the information of the texturs from the .lsx
*/

MySceneGraph.prototype.parseTextures= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('TEXTURES');
		
	if (elems == null) {
		return "TEXTURES elements is missing.";
	}
	else if (elems.length != 1) {
		return "either zero or more than one 'TEXTURES' element found.";
	}
	
	var texturesVar = elems[0].getElementsByTagName('TEXTURE');
	
	if (texturesVar == null) {
		return "No TEXTURE sources found.";
	}
	var nTextures = texturesVar.length;
	
	this.textureList = {};
	
	for(var i = 0; i < nTextures;i++)
		{
			var tempTexture = {path: "",amplif_factorS : 0,amplif_factorT : 0};			
			var ID = this.reader.getString(texturesVar[i],'id',1);

			var path = texturesVar[i].getElementsByTagName('file');
			tempTexture.path = this.reader.getString(path[0],'path',1);
			
			var amplif_factor = texturesVar[i].getElementsByTagName('amplif_factor');
			tempTexture.amplif_factorS = this.reader.getFloat(amplif_factor[0],'s',1);
			tempTexture.amplif_factorT = this.reader.getFloat(amplif_factor[0],'t',1);
			
			this.textureList[ID] = tempTexture;
		}
}
 
 /*
* Does the parsing of the information of the lights from the .lsx
*/
 
MySceneGraph.prototype.parseLights= function(rootElement) {
 
	var elems =  rootElement.getElementsByTagName('LIGHTS');
		
	if (elems == null) {
		return "LIGHTS elements is missing.";
	}
	else if (elems.length != 1) {
		return "either zero or more than one 'LIGHTS' element found.";
	}
	
	var lightsVar = elems[0].getElementsByTagName('LIGHT');
	
	if (lightsVar == null) {
		return "No LIGHT sources found.";
	}
	
	var nLights = lightsVar.length;
	
	this.lights = [];
	
	for (var i=0; i< nLights; i++)
	{
		var idLight = this.reader.getString(lightsVar[i],'id',1);
		
		var TempLight = new MyLight();
		
		//enable Value
		var enableVal = lightsVar[i].getElementsByTagName('enable');
		TempLight.enableV = this.reader.getBoolean(enableVal[0],'value',1);

		//positions
		var position = lightsVar[i].getElementsByTagName('position');
		TempLight.positionX = this.reader.getFloat(position[0],'x',1);
		TempLight.positionY = this.reader.getFloat(position[0],'y',1);
		TempLight.positionZ = this.reader.getFloat(position[0],'z',1);
		TempLight.positionW = this.reader.getFloat(position[0],'w',1);
		
		//ambient
		var ambient = lightsVar[i].getElementsByTagName('ambient');
		TempLight.ambientR = this.reader.getFloat(ambient[0],'r',1);
		TempLight.ambientG = this.reader.getFloat(ambient[0],'g',1);
		TempLight.ambientB = this.reader.getFloat(ambient[0],'b',1);
		TempLight.ambientA = this.reader.getFloat(ambient[0],'a',1);
		
		//diffuse
		var diffuse = lightsVar[i].getElementsByTagName('diffuse');
		TempLight.diffuseR = this.reader.getFloat(diffuse[0],'r',1);
		TempLight.diffuseG = this.reader.getFloat(diffuse[0],'g',1);
		TempLight.diffuseB = this.reader.getFloat(diffuse[0],'b',1);
		TempLight.diffuseA = this.reader.getFloat(diffuse[0],'a',1);
		
		//specular
		var specular = lightsVar[i].getElementsByTagName('specular');
		TempLight.specularR = this.reader.getFloat(specular[0],'r',1);
		TempLight.specularG = this.reader.getFloat(specular[0],'g',1);
		TempLight.specularB = this.reader.getFloat(specular[0],'b',1);
		TempLight.specularA = this.reader.getFloat(specular[0],'a',1);
		
		this.lights[idLight] = TempLight;
	};
 }

 /*
* Does the parsing of the information of the illumination from the .lsx
*/
 
MySceneGraph.prototype.parseIllumination= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('ILLUMINATION');
	
	if (elems == null) {
		return "ILLUMINATION elements is missing.";
	}
	else if (elems.length != 1) {
		return "either zero or more than one 'ILLUMINATION' element found.";
	}

	//ambient
	var ambient = elems[0].getElementsByTagName('ambient');
	this.ambientR = this.reader.getFloat(ambient[0],'r',1);
	this.ambientG = this.reader.getFloat(ambient[0],'g',1);
	this.ambientB = this.reader.getFloat(ambient[0],'b',1);
	this.ambientA = this.reader.getFloat(ambient[0],'a',1);
	
	//background
	var backgroundVar = elems[0].getElementsByTagName('background');
	
	this.background = [];
	this.background[0] = this.reader.getFloat(backgroundVar[0],'r',1);
	this.background[1] = this.reader.getFloat(backgroundVar[0],'g',1);
	this.background[2] = this.reader.getFloat(backgroundVar[0],'b',1);
	this.background[3] = this.reader.getFloat(backgroundVar[0],'a',1);

}

/*
* Does the parsing of the information of the initials from the .lsx
*/

MySceneGraph.prototype.parseInitials= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('INITIALS');
			
	if (elems == null) {
		return "ILLUMINATION elements is missing.";
	}
	else if (elems.length != 1) {
		return "either zero or more than one 'ILLUMINATION' element found.";
	}
	
	//frustum
	var frustum = elems[0].getElementsByTagName('frustum');
	this.near = this.reader.getFloat(frustum[0],'near',1);
	this.far = this.reader.getFloat(frustum[0],'far',1);
	
	//translation
	var translation = elems[0].getElementsByTagName('translation');
	this.translationX = this.reader.getFloat(translation[0],'x',1);
	this.translationY = this.reader.getFloat(translation[0],'y',1);
	this.translationZ = this.reader.getFloat(translation[0],'z',1);
	
	
	//rotations
	this.rotationList = [];
	var DegreeToRadian = Math.PI / 180; // LSX angle values are given in Degrees
	
	var rotation = elems[0].getElementsByTagName('rotation');
	
	
	var nRotation = rotation.length;	
	
	for(var i = 0; i < nRotation; i++){
		var tempRotation = {axis:null,angle:null};
		tempRotation.axis = this.reader.getString(rotation[i],'axis',1);
		tempRotation.angle = this.reader.getFloat(rotation[i],'angle',1) * DegreeToRadian;
		this.rotationList.push(tempRotation);	
		}
		
	//scaling
	var scale = elems[0].getElementsByTagName('scale');
	this.sx = this.reader.getFloat(scale[0],'sx',1);
	this.sy = this.reader.getFloat(scale[0],'sy',1);
	this.sz = this.reader.getFloat(scale[0],'sz',1);
	
	//reference
	var reference = elems[0].getElementsByTagName('reference');
	this.length = this.reader.getFloat(reference[0],'length',1);

}
 
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


