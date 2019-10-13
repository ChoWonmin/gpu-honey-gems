precision mediump float;

uniform float time;

uniform sampler2D floor;

varying vec3 vPosition;
varying vec2 vUv;

void main() {

  vec4 out_color = texture2D(floor, vUv * 10.0);
  out_color.a = .7;

  gl_FragColor = out_color;
  // gl_FragColor = vec4(out_color.r, out_color.g, out_color.b, 0.1);

}