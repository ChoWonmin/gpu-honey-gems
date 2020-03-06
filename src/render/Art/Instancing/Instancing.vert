precision highp float;

uniform float sineTime;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute vec4 sphere;
varying vec3 vPosition;


void main() {

  vPosition = offset + position;
  // vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position;

  vPosition = sphere.xyz * 10.0;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

}