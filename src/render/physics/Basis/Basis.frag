precision mediump float;

uniform float time;

uniform sampler2D floor;

varying vec3 vPosition;
varying vec2 vUv;

void main() {

  gl_FragColor = texture2D(floor, vUv * 10.0);

}