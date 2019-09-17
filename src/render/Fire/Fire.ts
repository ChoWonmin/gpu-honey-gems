import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';

// @ts-ignore
import vs from '!!raw-loader!./Fire.vert';
// @ts-ignore
import fs from '!!raw-loader!./Fire.frag';

@Component({
  components: {
    //
  }
})
export default class Fire extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private controls: any = null;
  private material: any = null;

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
      30,
      this.width / this.height,
      1,
      10000
    );
    this.camera.position.z = 100;

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        tExplosion: {
          type: 't',
          value: new THREE.TextureLoader().load('/img/texture/explosion.png')
        },
        time: { type: 'f', value: 0.0 },
        weight: { type: 'f', value: 10.0 }
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true
    });
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(20, 5),
      this.material
    );
    this.scene.add(mesh);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    this.renderer.setSize(this.width, this.height);

    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  }

  private animate() {
    requestAnimationFrame(this.animate);
    this.material.uniforms['time'].value = 0.00025 * (Date.now() - this.start);

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
