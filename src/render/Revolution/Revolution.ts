import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

// @ts-ignore
import vs from '!!raw-loader!./Sphere.vert';
// @ts-ignore
import fs from '!!raw-loader!./Sphere.frag';
// @ts-ignore
import cosmosFs from '!!raw-loader!./shader/Cosmos.frag';

// @ts-ignore
import fireVs from '!!raw-loader!./shader/Fire.vert';
// @ts-ignore
import fireFs from '!!raw-loader!./shader/Fire.frag';

import { Vector3 } from 'three';

@Component({
  components: {
    //
  },
})
export default class Revolution extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private controls: any = null;
  private requestAnimationID: number = 0;

  private width: number = -1;
  private height: number = -1;
  private start: number = Date.now();

  private sun: any = null;
  private sunDistance: number = 700;
  private earth: any = null;
  private moonDistance: number = 57;
  private moon: any = null;
  private speed: number = 0.01;

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 1, 15000);
    this.camera.position.y = 512;
    this.camera.position.z = -512;

    const cosmosTexture = new THREE.TextureLoader().load('/img/texture/cosmos.jpg');
    cosmosTexture.wrapS = THREE.RepeatWrapping;
    cosmosTexture.wrapT = THREE.RepeatWrapping;

    const space = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1024, 32, 32),
      new THREE.RawShaderMaterial({
        uniforms: {
          time: { type: 'f', value: 0.0 },
          cosmos: {
            type: 't',
            value: cosmosTexture,
          },
        },
        vertexShader: vs,
        fragmentShader: cosmosFs,
        side: THREE.DoubleSide,
      }),
    );

    this.sun = new THREE.Mesh(
      new THREE.IcosahedronGeometry(200, 5),
      new THREE.RawShaderMaterial({
        uniforms: {
          tExplosion: {
            type: 't',
            value: new THREE.TextureLoader().load('/img/texture/explosion.png'),
          },
          time: { type: 'f', value: 0.0 },
          weight: { type: 'f', value: 100.0 },
        },
        vertexShader: fireVs,
        fragmentShader: fireFs,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    );

    this.earth = new THREE.Mesh(
      new THREE.SphereBufferGeometry(32, 32, 32),
      new THREE.RawShaderMaterial({
        uniforms: {
          time: { type: 'f', value: 0.0 },
          sphere: {
            type: 't',
            value: new THREE.TextureLoader().load('/img/texture/earth.jpg'),
          },
        },
        vertexShader: vs,
        fragmentShader: fs,
      }),
    );

    this.earth.position.x = Math.cos((Date.now() * this.speed) / 365) * this.sunDistance;
    this.earth.position.z = Math.sin((Date.now() * this.speed) / 365) * this.sunDistance;

    this.moon = new THREE.Mesh(
      new THREE.SphereBufferGeometry(8.5, 32, 32),
      new THREE.RawShaderMaterial({
        uniforms: {
          time: { type: 'f', value: 0.0 },
          sphere: {
            type: 't',
            value: new THREE.TextureLoader().load('/img/texture/snow.jpg'),
          },
        },
        vertexShader: vs,
        fragmentShader: fs,
      }),
    );
    this.moon.position.x =
      Math.cos(Date.now() * this.speed) * this.moonDistance + this.earth.position.x;
    this.moon.position.z =
      Math.sin(Date.now() * this.speed) * this.moonDistance + this.earth.position.z;

    this.scene.add(space);
    this.scene.add(this.sun);
    this.scene.add(this.earth);
    this.scene.add(this.moon);

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

    this.earth.position.x = Math.cos((Date.now() * this.speed) / 365) * this.sunDistance;
    this.earth.position.z = Math.sin((Date.now() * this.speed) / 365) * this.sunDistance;

    this.moon.position.x =
      Math.cos(Date.now() * this.speed) * this.moonDistance + this.earth.position.x;
    this.moon.position.z =
      Math.sin(Date.now() * this.speed) * this.moonDistance + this.earth.position.z;

    this.sun.material.uniforms.time.value = 0.0004 * (Date.now() - this.start);

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
