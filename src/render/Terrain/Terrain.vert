precision lowp float;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

uniform sampler2D heightMap;

uniform float time;
uniform float maxHeight;

attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

void main() {

  vUv = uv;
  vPosition = position;
  vPosition.y += maxHeight * texture2D(heightMap, vUv).y;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

}

