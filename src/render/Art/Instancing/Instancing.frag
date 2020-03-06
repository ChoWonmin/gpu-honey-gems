precision highp float;
uniform float time;
varying vec3 vPosition;

void main() {
  vec4 color = vec4( 0.0, 15.0 / 255.0, 105.0 / 255.0, 1.0 );
  gl_FragColor = color;
}