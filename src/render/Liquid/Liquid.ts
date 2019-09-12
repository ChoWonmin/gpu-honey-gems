import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import Shader from './Shader';

@Component({
  components: {
    //
  }
})
export default class Liquid extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private controls: any = null;

  private stars: THREE.Mesh[] = [];
  private starsLen: number = 400;
  private width: number = -1;
  private height: number = -1;

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      30,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    const geometry = new THREE.PlaneGeometry(4, 4);
    const vertices = new Float32Array([
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,

      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0
    ]);
    const colors = new Float32Array([
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      1,

      1,
      0,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      1
    ]);

    // geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // geometry.addAttribute('color', new THREE.BufferAttribute(colors, 4));
    // const uvs = geometry.attributes.uv.array;
    // geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const texture1 = new THREE.TextureLoader().load('/img/texture/texture.jpg');

    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;

    const texture2 = new THREE.TextureLoader().load('/img/texture/firemap.jpg');
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        texture1: {
          type: 't',
          value: texture1
        },
        texture2: {
          type: 't',
          value: texture2
        },
        time: { value: 1.0 }
      },
      vertexShader: Shader.vertexShader,
      fragmentShader: Shader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true
    });

    const plane = new THREE.Mesh(geometry, material);

    this.scene.add(plane);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    this.renderer.setSize(this.width, this.height);
    // this.controls = new THREE.OrbitControls(
    //   this.camera,
    //   this.renderer.domElement
    // );

    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  }

  private animate() {
    requestAnimationFrame(this.animate);
    const time = performance.now();
    const object = this.scene.children[0];

    object.material.uniforms['time'].value = time * 0.005;
    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();
  }

  private beforeDestroy() {
    this.scene.dispose();
    this.renderer.dispose();
  }
}
