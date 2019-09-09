export default new (class Shader {
  public vertexShader: string = `
    precision highp float;
    precision highp float;

		uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float sineTime;
    
    attribute vec3 position;
    // attribute vec4 color;
    attribute vec2 uv;
    
		varying vec3 vPosition;
    varying vec4 vColor;
    varying vec2 vUv;

		void main(){
      vPosition = vec3(position.x, position.y + sineTime, position.z);
      // vColor = color;
      
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
		}
  `;

  public fragmentShader: string = `
    precision highp float;
    precision highp float;
    
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform float sineTime;

    varying vec2 vUv;
		varying vec3 vPosition;
    varying vec4 vColor;
    
		void main() {
      vec2 muv = vec2(vUv.x + sineTime, vUv.y + sineTime);
      movement = texture2D(texture2, muv);
      gl_FragColor = texture2D(texture1, vUv);
		}
  `;
})();
