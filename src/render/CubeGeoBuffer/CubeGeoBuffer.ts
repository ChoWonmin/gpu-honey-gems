import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';

@Component({
  components: {
    //
  }
})
export default class Fractal extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private cube: THREE.Line = new THREE.Line();
  private requestAnimationID: number = 0;

  private width: number = -1;
  private height: number = -1;

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      27,
      this.width / this.height,
      1,
      4000
    );
    this.camera.position.z = 2750;

    const segments: number = 10000;
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors
    });
    const positions = [];
    const colors = [];
    const r = 800;
    for (let i = 0; i < segments; i++) {
      const x = Math.random() * r - r / 2;
      const y = Math.random() * r - r / 2;
      const z = Math.random() * r - r / 2;
      // positions
      positions.push(x, y, z);
      // colors
      colors.push(x / r + 0.5);
      colors.push(y / r + 0.5);
      colors.push(z / r + 0.5);
    }
    geometry.addAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    geometry.computeBoundingSphere();
    this.cube = new THREE.Line(geometry, material);
    this.scene.add(this.cube);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setSize(this.width, this.height);

    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  }

  private animate() {
    this.requestAnimationID = requestAnimationFrame(this.animate);

    const time = Date.now() * 0.001;

    this.cube.rotation.x = time * 0.25;
    this.cube.rotation.y = time * 0.5;

    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();
  }

  private beforeDestroy() {
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
