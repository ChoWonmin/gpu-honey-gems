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
  private light: THREE.Light = new THREE.PointLight(0xffffff, 3.5, 15);
  private light2: THREE.Light = new THREE.PointLight(0xffffff, 3.5, 15);

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
      45,
      this.width / this.height,
      1,
      1000,
    );
    this.camera.position.z = 20;
    this.material = new THREE.MeshBasicMaterial({
      color: 0x9f9dba,
    });

    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.3, 12, 6),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }),
    );
    // @ts-ignore
    sphere.material.color.multiplyScalar(1.5);

    this.light.castShadow = true;
    // @ts-ignore
    this.light.shadow.camera.near = 1;
    // @ts-ignore
    this.light.shadow.camera.far = 60;
    this.light.shadow.bias = -0.005;
    this.light.add(sphere);

    this.light2.castShadow = true;
    // @ts-ignore
    this.light2.shadow.camera.near = 1;
    // @ts-ignore
    this.light2.shadow.camera.far = 60;
    this.light2.shadow.bias = -0.005;
    this.light2.add(sphere.clone());
    this.scene.add(this.light);
    this.scene.add(this.light2);

    const plane = new THREE.Mesh(
      new THREE.BoxBufferGeometry(20, 20, 20),
      new THREE.MeshPhongMaterial({
        color: 0x3b3b3b,
        shininess: 10,
        specular: 0x444444,
        side: THREE.BackSide,
      }),
    );
    plane.castShadow = true;
    plane.receiveShadow = true;
    this.scene.add(plane);

    this.loader.load('models/wolf_3ds/Wolf_3ds.3ds', (obj: THREE.Object3D) => {
      obj.scale = new THREE.Vector3(5, 5, 5);
      obj.translateZ(-2);
      obj.castShadow = true;
      obj.receiveShadow = true;

      this.scene.add(obj);
    });

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;

    this.renderer.setSize(this.width, this.height);

    if (container) {
      container.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
  }

  private animate() {
    this.requestAnimationID = requestAnimationFrame(this.animate);
    const time = 0.001 * (Date.now() - this.start);
    const radius = 6;

    this.light.position.set(
      radius * Math.sin(time),
      0,
      radius * Math.cos(time),
    );
    this.light2.position.set(
      0,
      radius * Math.cos(time),
      radius * Math.sin(time),
    );

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
