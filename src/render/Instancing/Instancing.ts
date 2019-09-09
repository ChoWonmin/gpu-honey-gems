import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import Shader from './Shader';

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
    geometry.maxInstancedCount = instances;
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
      vertexShader: Shader.vertexShader,
      fragmentShader: Shader.fragmentShader,
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
    object.material.uniforms['time'].value = time * 0.05;
    object.material.uniforms['sineTime'].value = Math.sin(
      object.material.uniforms['time'].value * 0.1
    );

    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();
  }

  private beforeMount() {
    console.warn('Instancing BD');
    this.scene.dispose();
    this.renderer.dispose();
  }
}
