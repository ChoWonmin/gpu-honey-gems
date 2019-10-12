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
  private airDrag: number = 0.03;
  private particles: Particle[] = [];

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
    this.camera.position.y = 500;
    this.camera.position.z = 5000;

    const floorTexture = new THREE.TextureLoader().load(
      '/img/texture/floor.png',
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
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
    });
    const geometry = new THREE.PlaneBufferGeometry(15000, 15000);
    geometry.rotateX(Math.PI / 2);
    const floor = new THREE.Mesh(geometry, this.material);
    this.scene.add(floor);

    for (let i = -2; i < 3; i++) {
      const ball = new Particle(
        new SphereGeometry(100 * (i + 3)),
        new MeshBasicMaterial({
          color: 0x9f9dba,
        }),
        new THREE.Vector3(1500 * i, 2000, 0),
      );

      this.particles.push(ball);
      this.scene.add(ball.getMesh());
    }

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setSize(this.width, this.height);

    if (container) {
      container.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
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
      // const drag =
      // this.airDrag * particle.velocity.length() * particle.velocity.length();

      // const air = particle.velocity.clone().multiplyScalar(-this.airDrag);
      // particle.addForce(air);

      particle.eval();

      if (particle.mesh.position.y < 100) {
        particle.mesh.position.y = 100;
      }
    }
  }

  private animate() {
    this.requestAnimationID = requestAnimationFrame(this.animate);
    this.dt += 0.001;
    this.material.uniforms.time.value += this.dt;

    this.frame();

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
