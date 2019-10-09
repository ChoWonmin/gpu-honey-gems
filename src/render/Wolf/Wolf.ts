import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
// @ts-ignore
import * as TDSLoader from 'three-3dsloader';

// @ts-ignore
import vs from '!!raw-loader!./Wolf.vert';
// @ts-ignore
import fs from '!!raw-loader!./Wolf.frag';
import { Vector3 } from 'three';

@Component({
  components: {
    //
  },
})
export default class Wolf extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private controls: any = null;
  private material: any = null;
  private requestAnimationID: number = 0;

  private loader: THREE.ObjectLoader = new TDSLoader();

  private width: number = -1;
  private height: number = -1;
  private start: number = -1;

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.start = Date.now();
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      1,
      150,
    );
    this.camera.position.z = 10;

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { type: 'f', value: 0.0 },
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
    });

    const geometry = new THREE.PlaneBufferGeometry(10, 10);

    const mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(mesh);

    this.loader.load('models/wolf_3ds/Wolf_3ds.3ds', (obj) => {
      this.scene.add(obj);
    });

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setSize(this.width, this.height);

    if (container) {
      container.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
  }

  private animate() {
    this.requestAnimationID = requestAnimationFrame(this.animate);
    this.material.uniforms.time.value = 0.00004 * (Date.now() - this.start);

    this.controls.update();
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
