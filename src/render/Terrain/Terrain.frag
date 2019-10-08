precision highp float;

uniform float maxHeight;

uniform float time;
uniform sampler2D water;
uniform sampler2D grass;
uniform sampler2D stone;
uniform sampler2D snow;

varying vec3 vPosition;
varying vec2 vUv;
varying float vSlope;

void main() {

  if (vSlope < 0.003) {
    gl_FragColor = texture2D(water, vUv * time);
  } else if (vSlope < 0.02) {
    gl_FragColor = texture2D(grass, vUv * 10.0);
  } else {
    gl_FragColor = texture2D(stone, vUv * 10.0);
  }

  if (vPosition.y > maxHeight * 0.7) {
    gl_FragColor = texture2D(snow, vUv * 10.0);
  } else if (vPosition.y > maxHeight * 0.7 - 10.0) {
    gl_FragColor = mix(texture2D(snow, vUv * 10.0) , texture2D(stone, vUv * 10.0), vPosition.y / (maxHeight * 0.7 - 10.0) );
  } 

}