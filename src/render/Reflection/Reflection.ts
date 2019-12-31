import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

@Component({
  components: {
    //
  },
})
export default class Reflection extends Vue {
  private camera: any = null;
  private mirrorCamera: any = new THREE.CubeCamera(1, 1000, 500);
  private scene: any = null;
  private renderer: any = null;
  private controls: any = null;
  private material: any = null;
  private requestAnimationID: number = 0;

  private cubePath: string = '/img/texture/cubemap/lycksele/';

  private cubeUrl: string[] = [
    'posx.jpg',
    'negx.jpg',
    'posy.jpg',
    'negy.jpg',
    'posz.jpg',
    'negz.jpg',
  ];
  private cubeLoader: THREE.CubeTextureLoader = new THREE.CubeTextureLoader();

  private width: number = -1;
  private height: number = -1;

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      1,
      5000,
    );
    this.camera.position.set(0, 400, 1000);

    this.scene.background = this.cubeLoader
      .setPath(this.cubePath)
      .load(this.cubeUrl);

    this.mirrorCamera.position.set(0, 100, 0);
    this.scene.add(this.mirrorCamera);

    this.material = new THREE.MeshBasicMaterial({
      envMap: this.mirrorCamera.renderTarget,
    });

    const geometry = new THREE.SphereGeometry(200, 50, 20);

    const mirror = new THREE.Mesh(geometry, this.material);
    mirror.position.set(0, 100, 0);
    this.scene.add(mirror);

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

    this.controls.update();
    this.mirrorCamera.updateCubeMap(this.renderer, this.scene);
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
