precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

uniform sampler2D heightMap;

uniform float maxHeight;

attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

varying vec3 vPosition;
varying vec2 vUv;
varying float vSlope;

float getVariance(float mean, float[4] samples) {

  float len = 4.0;
  float sum = 0.0;

  for(int i=0; i<4; i++) {
    sum += (mean - samples[i]) * (mean - samples[i]);
  }

  return sum / 4.0;
}

float isFlat(vec2 pos) {

  float len = 4.0;
  float sum = 0.0;

  float samples[4];
  samples[0] = texture2D(heightMap, vec2(vUv.x + 1.0, vUv.y)).y;
  samples[1] = texture2D(heightMap, vec2(vUv.x - 1.0, vUv.y)).y;
  samples[2] = texture2D(heightMap, vec2(vUv.x, vUv.y + 1.0)).y;
  samples[3] = texture2D(heightMap, vec2(vUv.x, vUv.y - 1.0)).y;

  for(int i=0; i<4; i++) {
    sum += (vPosition.y - samples[i]);
  }

  return sum;
}

void main() {

  vUv = uv;
  vPosition = position;
  vPosition.y += maxHeight * texture2D(heightMap, vUv).y;

  float samples[4];

  samples[0] = texture2D(heightMap, vec2(vUv.x + 1.0, vUv.y)).y;
  samples[1] = texture2D(heightMap, vec2(vUv.x - 1.0, vUv.y)).y;
  samples[2] = texture2D(heightMap, vec2(vUv.x, vUv.y + 1.0)).y;
  samples[3] = texture2D(heightMap, vec2(vUv.x, vUv.y - 1.0)).y;

  // vSlope = getVariance(vPosition.y, samples) / 100.0;
  vSlope = isFlat(vUv);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

}

