import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

// @ts-ignore
import vs from '!!raw-loader!./Moon.vert';
// @ts-ignore
import fs from '!!raw-loader!./Moon.frag';
import { Vector3 } from 'three';

@Component({
  components: {
    //
  },
})
export default class Moon extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private controls: any = null;
  private material: any = null;
  private requestAnimationID: number = 0;

  private width: number = -1;
  private height: number = -1;
  private start: number = -1;

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 1, 1500);
    this.camera.position.y = 128;
    this.camera.position.z = -128;

    const cosmosTexture = new THREE.TextureLoader().load('/img/texture/cosmos.jpg');
    cosmosTexture.wrapS = THREE.RepeatWrapping;
    cosmosTexture.wrapT = THREE.RepeatWrapping;

    const moonTexture = new THREE.TextureLoader().load('/img/texture/snow.jpg');
    moonTexture.wrapS = THREE.RepeatWrapping;
    moonTexture.wrapT = THREE.RepeatWrapping;

    const space = new THREE.Mesh(
      new THREE.SphereBufferGeometry(256, 32, 32),
      new THREE.RawShaderMaterial({
        uniforms: {
          time: { type: 'f', value: 0.0 },
          cosmos: {
            type: 't',
            value: cosmosTexture,
          },
        },
        vertexShader: vs,
        fragmentShader: fs,
        side: THREE.DoubleSide,
      }),
    );
    this.scene.add(space);

    const moon = new THREE.Mesh(
      new THREE.SphereBufferGeometry(16, 32, 32),
      new THREE.RawShaderMaterial({
        uniforms: {
          time: { type: 'f', value: 0.0 },
          cosmos: {
            type: 't',
            value: moonTexture,
          },
        },
        vertexShader: vs,
        fragmentShader: fs,
        side: THREE.DoubleSide,
      }),
    );
    this.scene.add(moon);

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
