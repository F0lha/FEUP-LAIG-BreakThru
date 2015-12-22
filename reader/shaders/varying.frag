#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;

void main() {
	gl_FragColor = vec4(0.5,0.5,0.3,1);
}