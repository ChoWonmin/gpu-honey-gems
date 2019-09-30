precision lowp float;

uniform sampler2D grass;

varying vec2 vUv;
float PI = 3.14159265358979;

void main() {

  gl_FragColor = texture2D(grass, vUv);
}