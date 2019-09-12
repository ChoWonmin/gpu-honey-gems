export default new (class Shader {
  public vertexShader: string = `
    precision highp float;
    precision highp float;

		uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    attribute vec3 position;
    // attribute vec4 color;
    attribute vec2 uv;
    
		varying vec3 vPosition;
    varying vec4 vColor;
    varying vec2 vUv;

		void main(){
      vPosition = position;
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
    uniform sampler2D texture3;
    uniform float time;

    varying vec2 vUv;
		varying vec3 vPosition;
    varying vec4 vColor;
    
		void main() {
      vec2 uv = vUv;
      float sinTime = (sin(time)/2.0 + 0.5) * 0.01;
      vec4 movement = texture2D(texture2, uv) * sinTime;
      
      if (movement.x > 0.005)
        uv.x += movement.x;
      if (movement.y > 0.005)  
        uv.y += movement.y;

      gl_FragColor = texture2D(texture3, uv);
		}
  `;
})();
