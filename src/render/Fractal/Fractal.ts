import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import Shader from './Shader';

@Component({
  components: {
    //
  },
})
export default class Fractal extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private requestAnimationID: number = 0;

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
      10,
    );
    this.camera.position.z = 2;

    // geometry
    const vector = new THREE.Vector4();
    const instances = 1;
    const positions = [];
    const offsets = [];
    const colors = [];

    positions.push(1, 1, 0);
    positions.push(0.5, 0.5, -0.1);
    positions.push(0, 0, 0);

    for (let i = 0; i < instances; i++) {
      // offsets
      offsets.push(Math.random() - 0.5, Math.random() - 0.5, 0);
      // colors
      colors.push(Math.random(), Math.random(), Math.random(), 1);
    }

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.maxInstancedCount = instances;
    geometry.addAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.addAttribute(
      'offset',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3),
    );
    geometry.addAttribute(
      'color',
      new THREE.InstancedBufferAttribute(new Float32Array(colors), 4),
    );

    // material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 },
      },
      vertexShader: Shader.vertexShader,
      fragmentShader: Shader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
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
    this.requestAnimationID = requestAnimationFrame(this.animate);

    const time = performance.now();
    const object = this.scene.children[0];

    // object.rotation.y = time * 0.0005;
    // object.material.uniforms['time'].value = time * 0.005;
    // object.material.uniforms['sineTime'].value = Math.sin(
    //   object.material.uniforms['time'].value * 0.05
    // );

    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();
  }

  private beforeMount() {
    this.scene.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    window.cancelAnimationFrame(this.requestAnimationID);
    // @ts-ignore release force
    this.renderer.domElement = null;
    // @ts-ignore release force
    this.renderer = null;
  }
}
