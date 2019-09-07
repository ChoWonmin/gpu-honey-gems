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
      75,
      this.width / this.height,
      0.1,
      1000,
    );
    this.camera.position.z = 500;

    for (let i = 0; i < this.starsLen; i++) {
      const geometry = new THREE.CircleGeometry(2, 8);
      const material = new THREE.MeshBasicMaterial({ color: 0xefefef });

      const star = new THREE.Mesh(geometry, material);
      star.position.x = (Math.random() - 0.5) * 1000;
      star.position.y = (Math.random() - 0.5) * 500;
      star.position.z = -(Math.random() - 0.5) * 500;

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

    for (const star of this.stars) {
      star.position.z += 5;
      if (star.position.z > 450) {
        star.position.x = (Math.random() - 0.5) * 1000;
        star.position.y = (Math.random() - 0.5) * 500;
        star.position.z = Math.random() * 500 - 500;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();
  }
}
