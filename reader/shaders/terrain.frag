#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D map;
uniform sampler2D HM;

void main() {
    gl_FragColor = texture2D(map, vTextureCoord);
}