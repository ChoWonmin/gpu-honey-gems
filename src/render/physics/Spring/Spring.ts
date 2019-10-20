import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

// @ts-ignore
import vs from '!!raw-loader!./Spring.vert';
// @ts-ignore
import fs from '!!raw-loader!./Spring.frag';
import { Vector3, SphereGeometry, MeshBasicMaterial } from 'three';
import Particle from '@/util/Particle';
import Elastic from '@/util/Elastic';

@Component({
  components: {
    //
  },
})
export default class Spring extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private controls: any = null;
  private requestAnimationID: number = 0;

  private width: number = -1;
  private height: number = -1;

  private ceil: number = 100;
  private airDrag: number = 0.03;
  private mass: number = 0.05;
  private particles: Particle[] = [];
  private elastics: Elastic[] = [];
  private radius: number = 5;

  private dt: number = 0;

  private play: boolean = false;
  private setting: boolean = false;

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.1,
      3000,
    );
    this.camera.position.z = 500;

    this.initObject();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setSize(this.width, this.height);

    if (container) {
      container.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
  }

  private initObject() {
    for (let i = 0; i < 3; i++) {
      const radius = this.radius;

      const ball = new Particle(
        new SphereGeometry(radius),
        new MeshBasicMaterial({
          color: 0xff0000,
        }),
        new THREE.Vector3(100 * (i - 2), this.ceil, 0),
      );
      ball.radius = radius;
      ball.mass = this.mass;

      this.particles.push(ball);
      this.scene.add(ball.getMesh());
    }

    for (let i = 0; i < 2; i++) {
      const elastic = new Elastic(i, i + 1, this.particles);
      this.elastics.push(elastic);
      this.scene.add(elastic.getMesh());
    }
  }

  private frame() {
    for (const particle of this.particles) {
      particle.clearForce();

      const gravity = new THREE.Vector3(0, -1, 0).multiplyScalar(
        particle.mass * 981,
      );
      particle.addForce(gravity);
    }

    for (const elastic of this.elastics) {
      elastic.applyForce();
    }

    for (const particle of this.particles) {
      particle.eval(this.dt);
    }

    for (const elastic of this.elastics) {
      elastic.update();
    }

    this.particles[0].velocity = new THREE.Vector3(0, 0, 0);
    this.particles[0].getMesh().position = new THREE.Vector3(
      -200,
      this.ceil,
      0,
    );
  }

  private reset() {
    this.dt = 0;
    for (let i = 0; i < 3; i++) {
      const radius = this.radius;
      this.particles[i].mesh.position = new THREE.Vector3(
        100 * (i - 2),
        this.ceil,
        0,
      );
      this.particles[i].mass = this.mass;
      this.particles[i].force = new THREE.Vector3(0, 0, 0);
      this.particles[i].velocity = new THREE.Vector3(0, 0, 0);
    }
    this.play = false;

    for (const elastic of this.elastics) {
      elastic.update();
    }
  }

  private dispose() {
    this.scene.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    window.cancelAnimationFrame(this.requestAnimationID);
    // @ts-ignore release force
    this.renderer.domElement = null;
    // @ts-ignore release force
    this.renderer = null;
  }

  private animate() {
    this.requestAnimationID = requestAnimationFrame(this.animate);

    if (this.play) {
      this.dt += 0.0001;
      for (let i = 0; i < 1000; i++) {
        this.frame();
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.init();
    this.animate();
  }

  private beforeDestroy() {
    this.dispose();
  }
}
