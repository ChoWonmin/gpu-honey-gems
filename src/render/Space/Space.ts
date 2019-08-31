import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';

@Component({
  components: {
    //
  },
})
export default class Space extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;

  // private width: number = 0;
  // private height: number = 0;

  private stars: THREE.Mesh[] = [];
  private starsLen: number = 200;

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000,
    );
    this.camera.position.z = 150;

    for (let i = 0; i < this.starsLen; i++) {
      const geometry = new THREE.CircleGeometry(2, 24);
      const material = new THREE.MeshBasicMaterial({ color: 0xefefef });

      const star = new THREE.Mesh(geometry, material);
      star.position.x = Math.random() * this.width - this.width / 2;
      star.position.y = Math.random() * this.height - this.height / 2;
      this.stars.push(star);
      this.scene.add(star);
    }

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setSize(this.width, this.height);

    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  }

  private animate() {
    requestAnimationFrame(this.animate);

    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].position.z -= 0.1;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();
  }
}
