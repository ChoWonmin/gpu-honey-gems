precision mediump float;

uniform float maxHeight;

uniform float time;
uniform sampler2D water;
uniform sampler2D grass;
uniform sampler2D stone;
uniform sampler2D snow;

varying vec3 vPosition;
varying vec2 vUv;
varying float vSlope;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float pNoise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {

  float noise = pNoise(vPosition);
  
  if (vSlope > 400.0) {
    gl_FragColor = texture2D(grass, vUv * 10.0);
  } else if (vSlope > 280.0) {
    if(noise > 0.5) {
      gl_FragColor = texture2D(stone, vUv * 10.0);
    } else {
      gl_FragColor = texture2D(grass, vUv * 10.0);
    }
  } else {
    gl_FragColor = texture2D(stone, vUv * 10.0);
  }

  if (vPosition.y > maxHeight * 0.7) {
    gl_FragColor = texture2D(snow, vUv * 10.0);
  } else if (vPosition.y > maxHeight * 0.7 - 20.0) {    
    if(noise > 0.5) {
      gl_FragColor = texture2D(snow, vUv * 10.0);
    } else {
      gl_FragColor = texture2D(grass, vUv * 10.0);
    }
  } else if (vPosition.y < maxHeight * 0.3) {
    gl_FragColor = texture2D(water, vUv * time);
  }

  

  // gl_FragColor = vec4( noise, 0.0, 0.0, 1.0);

}