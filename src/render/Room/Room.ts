import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
// @ts-ignore
import * as TDSLoader from 'three-3dsloader';

@Component({
  components: {
    //
  },
})
export default class Room extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private controls: any = null;
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private draggable: any = null;
  private moveMouse: THREE.Vector2 =  new THREE.Vector2();

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

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xB6B8DC );

    // camera
    this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 1, 1500);
    this.camera.position.set(-35, 70, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);

    if (container) {
      container.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    // ambient light
    const hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
    this.scene.add(hemiLight);

    // Add directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-30, 50, -30);
    this.scene.add(dirLight);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -70;
    dirLight.shadow.camera.right = 70;
    dirLight.shadow.camera.top = 70;
    dirLight.shadow.camera.bottom = -70;

    this.raycaster = new THREE.Raycaster(); // create once
    const clickMouse = new THREE.Vector2();  // create once
    this.moveMouse = new THREE.Vector2();   // create once


    window.addEventListener('click', (event) => {
      if (this.draggable != null) {
        this.draggable = null as any;
        return;
      }

      // THREE RAYCASTER
      clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const found = this.intersect(clickMouse);
      if (found.length > 0) {
        if (found[0].object.userData.draggable) {
          this.draggable = found[0].object;
        }
      }
    });

    window.addEventListener('mousemove', (event) => {
      this.moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  private intersect(pos: THREE.Vector2) {
    this.raycaster.setFromCamera(pos, this.camera);
    return this.raycaster.intersectObjects(this.scene.children);
  }

  private dragObject() {
    if (this.draggable != null) {
      const foundList = this.intersect(this.moveMouse);
      if (foundList.length > 0) {
        for (const found of foundList) {
          if (!found.object.userData.ground) {
            continue;
          }

          const target = found.point;
          this.draggable.position.x = target.x;
          this.draggable.position.z = target.z;
        }
      }
    }
  }

  private animate() {
    this.dragObject();
    this.requestAnimationID = requestAnimationFrame(this.animate);
    // const time = 0.001 * (Date.now() - this.start);
    // const radius = 6;

    // this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private createFloor() {
    const pos = { x: 0, y: -1, z: 3 };
    const scale = { x: 100, y: 2, z: 100 };

    const blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(),
         new THREE.MeshPhongMaterial({ color: 0x5ea152 }));
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    this.scene.add(blockPlane);

    blockPlane.userData.ground = true;
  }

  private createBox() {
    const scale = { x: 6, y: 6, z: 6 };
    const pos = { x: 15, y: scale.y / 2, z: 15 };

    const box = new THREE.Mesh(new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({ color: 0xDC143C }));
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.castShadow = true;
    box.receiveShadow = true;
    this.scene.add(box);

    box.userData.draggable = true;
    box.userData.name = 'BOX';
  }

  private createSphere() {
    const radius = 4;
    const pos = { x: 15, y: radius, z: -15 };

    const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 32, 32),
        new THREE.MeshPhongMaterial({ color: 0x43a1f4 }));
    sphere.position.set(pos.x, pos.y, pos.z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    this.scene.add(sphere);

    sphere.userData.draggable = true;
    sphere.userData.name = 'SPHERE';
  }

  private createWolf() {
    const scale = { x: 15, y: 15, z: 15 };
    const pos = { x: 25, y: scale.y / 2, z: 5 };

    this.loader.load('models/wolf_3ds/Wolf_3ds.3ds', (obj: THREE.Object3D) => {

      // obj.rotateX(-Math.PI /2)
      obj.position.set(pos.x, pos.y, pos.z);
      obj.scale.set(scale.x, scale.y, scale.z);
      obj.castShadow = true;
      obj.receiveShadow = true;

      obj.userData.draggable = true;
      obj.userData.name = 'WOLF';

      this.scene.add(obj);
    });
  }

  private mounted() {
    this.init();
    this.createFloor();
    this.createBox();
    this.createSphere();
    this.createWolf();

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
