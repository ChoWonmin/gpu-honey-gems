precision highp float;

uniform float maxHeight;

uniform sampler2D grass;
uniform sampler2D stone;
uniform sampler2D snow;

varying vec3 vPosition;
varying vec2 vUv;
varying float vSlope;
float PI = 3.14159265358979;

void main() {

  if (vSlope > 0.2) {
    gl_FragColor = texture2D(stone, vUv * 10.0);
  } else {
    gl_FragColor = texture2D(grass, vUv * 10.0);
  }

  if (vPosition.y > maxHeight * 4. / 5.) {
    gl_FragColor = texture2D(snow, vUv * 10.0);
  } else if (vPosition.y > maxHeight * 4. / 5. - 30.0) {
    gl_FragColor = (texture2D(snow, vUv * 10.0) + texture2D(stone, vUv * 10.0)) / 2.0;
  } 

  

}