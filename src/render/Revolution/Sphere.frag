precision mediump float;

uniform float time;
uniform sampler2D sphere;

varying vec3 vPosition;
varying vec2 vUv;

void main() {

  gl_FragColor = texture2D(sphere, vUv);

}