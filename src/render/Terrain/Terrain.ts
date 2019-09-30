import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

// @ts-ignore
import vs from '!!raw-loader!./Terrain.vert';
// @ts-ignore
import fs from '!!raw-loader!./Terrain.frag';
import { Vector3 } from 'three';

@Component({
  components: {
    //
  },
})
export default class Terrain extends Vue {
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
    const worldWidth = 256;
    const worldDepth = 256;
    const container = document.getElementById('container') as HTMLElement;

    this.start = Date.now();
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      1,
      15000,
    );
    this.camera.position.y = 1000;
    this.camera.position.z = 2000;

    const grass_texture = new THREE.TextureLoader().load(
      '/img/texture/grass.jpg',
    );

    grass_texture.wrapS = THREE.RepeatWrapping;
    grass_texture.wrapT = THREE.RepeatWrapping;

    const ston_texture = new THREE.TextureLoader().load(
      '/img/texture/stones.jpg',
    );

    ston_texture.wrapS = THREE.RepeatWrapping;
    ston_texture.wrapT = THREE.RepeatWrapping;

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { type: 'f', value: 0.0 },
        weight: { type: 'f', value: 10.0 },
        grass: {
          type: 't',
          value: grass_texture,
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
    });

    const geometry = new THREE.PlaneBufferGeometry(
      7500,
      7500,
      worldWidth,
      worldDepth,
    );
    geometry.rotateX(-Math.PI / 2);

    for (let i = 0; i < geometry.attributes.position.array.length; i++) {
      if (i % 3 == 1) {
        geometry.attributes.position.array[i] += Math.random() * 150;
      }
    }

    const mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(mesh);

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
    this.material.uniforms.time.value = 0.0004 * (Date.now() - this.start);

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