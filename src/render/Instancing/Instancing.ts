import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';

@Component({
  components: {
    //
  }
})
export default class Instancing extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;

  private width: number = -1;
  private height: number = -1;

  private vertexShader: string = `
    precision highp float;
		uniform float sineTime;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		attribute vec3 position;
		attribute vec3 offset;
		attribute vec4 color;
		attribute vec4 orientationStart;
		attribute vec4 orientationEnd;
		varying vec3 vPosition;
		varying vec4 vColor;
		void main(){
			vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position;
			vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) );
			vec3 vcV = cross( orientation.xyz, vPosition );
			vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );
			vColor = color;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
		}
  `;

  private fragmentShader: string = `
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

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      1,
      10
    );
    this.camera.position.z = 2;

    // geometry
    const vector = new THREE.Vector4();
    const instances = 50000;
    const positions = [];
    const offsets = [];
    const colors = [];
    const orientationsStart = [];
    const orientationsEnd = [];

    positions.push(0.025, -0.025, 0);
    positions.push(-0.025, 0.025, 0);
    positions.push(0, 0, 0.025);

    for (let i = 0; i < instances; i++) {
      // offsets
      offsets.push(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      );
      // colors
      colors.push(Math.random(), Math.random(), Math.random(), Math.random());
      // orientation start
      vector.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      vector.normalize();
      orientationsStart.push(vector.x, vector.y, vector.z, vector.w);
      // orientation end
      vector.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      vector.normalize();
      orientationsEnd.push(vector.x, vector.y, vector.z, vector.w);
    }

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.maxInstancedCount = instances; // set so its initalized for dat.GUI, will be set in first draw otherwise
    geometry.addAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.addAttribute(
      'offset',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
    );
    geometry.addAttribute(
      'color',
      new THREE.InstancedBufferAttribute(new Float32Array(colors), 4)
    );
    geometry.addAttribute(
      'orientationStart',
      new THREE.InstancedBufferAttribute(new Float32Array(orientationsStart), 4)
    );
    geometry.addAttribute(
      'orientationEnd',
      new THREE.InstancedBufferAttribute(new Float32Array(orientationsEnd), 4)
    );
    // material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 }
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  }

  private animate() {
    requestAnimationFrame(this.animate);

    const time = performance.now();
    const object = this.scene.children[0];

    object.rotation.y = time * 0.0005;
    object.material.uniforms['time'].value = time * 0.005;
    object.material.uniforms['sineTime'].value = Math.sin(
      object.material.uniforms['time'].value * 0.05
    );

    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();
  }

  private beforeDestroy() {
    console.warn('Instancing BD');
    this.scene.dispose();
    this.renderer.dispose();
  }
}
