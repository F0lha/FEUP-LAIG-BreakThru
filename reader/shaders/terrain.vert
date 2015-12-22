#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D map;
uniform sampler2D HM;

varying vec2 vTextureCoord;


void main() {
    vTextureCoord = aTextureCoord;
	
	vec3 newPosition = aVertexPosition;
	
	newPosition.y += texture2D(HM, aTextureCoord).r * 0.5;

    gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);
}
