precision mediump float;

uniform sampler2D sphereTexture;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(sphereTexture, vUv);

}