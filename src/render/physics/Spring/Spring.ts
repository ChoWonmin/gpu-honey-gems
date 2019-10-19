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

  private dt: number = 0;
  private airDrag: number = 1200;
  private waterDrag: number = 1000;
  private mass: number = 1200;
  private particles: Particle[] = [];
  private elastics: Elastic[] = [];
  private radius: number = 50;

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
      1,
      25000,
    );
    this.camera.position.y = 0;
    this.camera.position.z = 10000;

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
    for (let i = 0; i < 2; i++) {
      const radius = this.radius;

      const ball = new Particle(
        new SphereGeometry(radius),
        new MeshBasicMaterial({
          color: 0xff0000,
        }),
        new THREE.Vector3(1500 * (i - 2), 2000, 0),
      );
      ball.radius = radius;
      ball.mass = this.mass;

      this.particles.push(ball);
      this.scene.add(ball.getMesh());
    }

    for (let i = 0; i < 1; i++) {
      const elastic = new Elastic(i, i + 1, this.particles);
      this.elastics.push(elastic);
      // this.scene.add(elastic.getMesh());
    }
  }

  private frame() {
    for (const particle of this.particles) {
      particle.clearForce();

      const gravity = new THREE.Vector3(0, -1, 0).multiplyScalar(
        particle.mass * 9.81,
      );
      particle.addForce(gravity);

      // 항력
      // const frontFace = (particle.radius * particle.radius) / 250000;
      // const drag =
      //   particle.mesh.position.y > particle.radius
      //     ? this.airDrag / 10000000
      //     : (this.waterDrag / 10000) *
      //       particle.velocity.length() *
      //       particle.velocity.length() *
      //       frontFace;
      // const dragForce = particle.velocity.clone().multiplyScalar(-drag);
      // particle.addForce(dragForce);
    }

    for (const elastic of this.elastics) {
      elastic.applyForce(this.particles);
    }

    for (const particle of this.particles) {
      particle.eval();
    }

    this.particles[0].velocity = new THREE.Vector3(0, 0, 0);
    this.particles[0].getMesh().position = new THREE.Vector3(-3000, 2000, 0);
  }

  private reset() {
    for (let i = 0; i < 2; i++) {
      const radius = this.radius;
      this.particles[i].mesh.position = new THREE.Vector3(
        1500 * (i - 2),
        2000,
        0,
      );
      this.particles[i].mass = this.mass;
      this.particles[i].force = new THREE.Vector3(0, 0, 0);
      this.particles[i].velocity = new THREE.Vector3(0, 0, 0);
    }
    this.play = false;
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
    this.dt += 0.001;

    if (this.play) {
      this.frame();
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
