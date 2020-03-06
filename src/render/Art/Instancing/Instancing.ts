import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import Shader from './Shader';

// @ts-ignore
import vs from '!!raw-loader!./Instancing.vert';
// @ts-ignore
import fs from '!!raw-loader!./Instancing.frag';

@Component({
  components: {
    //
  },
})
export default class Instancing extends Vue {
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

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.z = 80;

    // geometry
    const vector = new THREE.Vector4();
    const instances = 50000;
    const positions = [];
    const offsets = [];
    const colors = [];
    const sphere = [];

    positions.push(0.5, -0.5, 0);
    positions.push(-0.5, 0.5, 0);
    positions.push(0, 0, 0.5);

    for (let i = 0; i < instances; i++) {
      let offX = Math.random() * 40;
      let offY = Math.random() * 40;
      const offZ = Math.random() * 20 - 10;

      if (offY > 28) {
        if (offX < 12) {
          offY = 28 + Math.random() * offX;
        } else if (offX > 28) {
          offY = 28 - Math.random() * (offX - 40);
        }
      } else {
        if (offX > 12 && offX < 28) {
          if (offX < 20) {
            offX = Math.random() * 12;
          } else {
            offX = Math.random() * 12 + 28;
          }
        }
      }

      offX -= 20;
      offY -= 20;

      // offsets
      offsets.push(offX, offY, offZ);

      // orientation start
      vector.set(
        Math.cos(Math.random() * 2 * Math.PI),
        Math.sin(Math.random() * 2 * Math.PI),
        Math.cos(Math.random() * 2 * Math.PI),
        Math.random() * 2 - 1,
      );
      vector.normalize();
      sphere.push(vector.x, vector.y, vector.z, vector.w);
    }

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.maxInstancedCount = instances;
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute(
      'offset',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3),
    );
    geometry.addAttribute(
      'sphere',
      new THREE.InstancedBufferAttribute(new Float32Array(sphere), 4),
    );

    // material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 },
      },
      vertexShader: vs,
      fragmentShader: fs,
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

    object.rotation.y = time * 0.0005;
    object.material.uniforms.time.value = time * 0.05;
    object.material.uniforms.sineTime.value = Math.sin(object.material.uniforms.time.value * 0.005);

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
