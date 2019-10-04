precision lowp float;

uniform sampler2D grass;
uniform sampler2D snow;

varying vec3 vPosition;
varying vec2 vUv;
float PI = 3.14159265358979;

void main() {

  if (vPosition.y > 130.0) {
    gl_FragColor = texture2D(snow, vUv * 10.0);
  } else {
    gl_FragColor = texture2D(grass, vUv * 10.0);
  }

  
}