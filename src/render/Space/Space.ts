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

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setSize(container.clientWidth, container.clientHeight);

    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  }

  private mounted() {
    this.init();
  }
}
