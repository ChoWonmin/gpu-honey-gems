import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

// @ts-ignore
import vs from '!!raw-loader!./Basis.vert';
// @ts-ignore
import fs from '!!raw-loader!./Basis.frag';
import { Vector3, SphereGeometry, MeshBasicMaterial } from 'three';
import Particle from '@/util/Particle';

@Component({
  components: {
    //
  },
})
export default class Basis extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private controls: any = null;
  private material: any = null;
  private requestAnimationID: number = 0;

  private width: number = -1;
  private height: number = -1;

  private dt: number = 0;
  private airDrag: number = 1200;
  private waterDrag: number = 1000;
  private mass: number = 1200;
  private particles: Particle[] = [];
  private radius: number = 40;

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
      15000,
    );
    this.camera.position.y = 0;
    this.camera.position.z = 7000;

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
    this.scene.dispose();

    const floorTexture = new THREE.TextureLoader().load(
      '/img/texture/water.jpg',
    );
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { type: 'f', value: 0.0 },
        floor: {
          type: 't',
          value: floorTexture,
        },
      },
      transparent: true,
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
    });
    const geometry = new THREE.BoxBufferGeometry(10000, 3000, 3000);

    const floor = new THREE.Mesh(geometry, this.material);
    floor.translateY(-1500);
    this.scene.add(floor);

    for (let i = 0; i < 5; i++) {
      const radius = this.radius * (i + 1);

      const ball = new Particle(
        new SphereGeometry(radius),
        new MeshBasicMaterial({
          color: 0xff0000,
        }),
        new THREE.Vector3(1500 * (i - 2), 4000 + radius, 0),
      );
      ball.radius = radius;
      ball.mass = this.mass;

      this.particles.push(ball);
      this.scene.add(ball.getMesh());
    }
  }

  private frame(dt: number) {
    for (const particle of this.particles) {
      particle.clearForce();

      const gravity = new THREE.Vector3(0, -1, 0).multiplyScalar(
        particle.mass * 9.81,
      );
      particle.addForce(gravity);

      // 항력
      const frontFace = (particle.radius * particle.radius) / 250000;
      const drag =
        particle.mesh.position.y > particle.radius
          ? this.airDrag / 10000000
          : (this.waterDrag / 10000) *
            particle.velocity.length() *
            particle.velocity.length() *
            frontFace;
      const dragForce = particle.velocity.clone().multiplyScalar(-drag);
      particle.addForce(dragForce);

      particle.eval(dt);

      if (particle.mesh.position.y < particle.radius - 3000) {
        particle.mesh.position.y = particle.radius - 3000;
      }
    }
  }

  private reset() {
    for (let i = 0; i < 5; i++) {
      const radius = this.radius * (i + 1);
      this.particles[i].mesh.position = new THREE.Vector3(
        1500 * (i - 2),
        4000 + radius,
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
    this.material.uniforms.time.value += this.dt;

    if (this.play) {
      this.dt += 0.00001;
      this.frame(this.dt);
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
