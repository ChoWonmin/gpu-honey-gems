export default new (class Shader {
  public vertexShader: string = `
    precision highp float;
		uniform float sineTime;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		attribute vec3 position;
		attribute vec3 offset;
		attribute vec4 color;

		varying vec3 vPosition;
		varying vec4 vColor;
		void main(){
      vPosition = offset  + position;
			vColor = color;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
		}
  `;

  public fragmentShader: string = `
    precision highp float;
		uniform float time;
		varying vec3 vPosition;
		varying vec4 vColor;
		void main() {
			vec4 color = vec4( vColor );
			color.r += sin( vPosition.x * 10.0 + time ) * 0.5;
			gl_FragColor = color;
		}
  `;
})();
