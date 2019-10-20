import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

import { Vector3, SphereGeometry, MeshBasicMaterial } from 'three';
import Cloth from './Cloth';
import Particle from './Particle';

@Component({
  components: {
    //
  },
})
export default class ClothSystem extends Vue {
  private camera: any = null;
  private scene: any = null;
  private renderer: any = null;
  private controls: any = null;
  private requestAnimationID: number = 0;

  private clothGeometry!: THREE.ParametricBufferGeometry;
  private sphere!: THREE.Mesh;
  private object!: THREE.Mesh;

  private params = {
    enableWind: true,
    showBall: false,
    tooglePins: this.togglePins,
  };

  private DAMPING: number = 0.03;
  private DRAG: number = 1 - this.DAMPING;
  private MASS: number = 0.1;
  private restDistance: number = 25;
  private xSegs: number = 10;
  private ySegs: number = 10;
  private cloth: Cloth = new Cloth(this.xSegs, this.ySegs);
  private GRAVITY: number = 981 * 1.4;
  private gravity: THREE.Vector3 = new THREE.Vector3(
    0,
    -this.GRAVITY,
    0,
  ).multiplyScalar(this.MASS);
  private TIMESTEP: number = 18 / 1000;
  private TIMESTEP_SQ: number = this.TIMESTEP * this.TIMESTEP;
  private pins: number[] = [6];
  private windForce: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private ballPosition: THREE.Vector3 = new THREE.Vector3(0, -45, 0);
  private ballSize: number = 60; // 40
  private tmpForce: THREE.Vector3 = new THREE.Vector3();
  private lastTime: number = 0;
  private pinsFormation: number[][] = [];

  private play: boolean = false;
  private setting: boolean = false;
  private diff: THREE.Vector3 = new THREE.Vector3();

  private clothFunction(u: number, v: number, target: THREE.Vector3) {
    const width = this.restDistance * this.xSegs;
    const height = this.restDistance * this.ySegs;

    const x = (u - 0.5) * width;
    const y = (v + 0.5) * height;
    const z = 0;
    target.set(x, y, z);
  }

  private togglePins() {
    this.pins = this.pinsFormation[
      ~~(Math.random() * this.pinsFormation.length)
    ];
  }

  private init() {
    const container = document.getElementById('container') as HTMLElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcce0ff);
    this.scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);

    this.camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    this.camera.position.set(1000, 50, 1500);
    this.scene.add(new THREE.AmbientLight(0x666666));

    const light = new THREE.DirectionalLight(0xdfebff, 1);
    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const d = 300;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.far = 1000;

    this.scene.add(light);

    this.clothGeometry = new THREE.ParametricBufferGeometry(
      this.clothFunction,
      this.cloth.w,
      this.cloth.h,
    );

    const clothMaterial: THREE.Material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      alphaTest: 0.5,
    });

    this.object = new THREE.Mesh(this.clothGeometry, clothMaterial);
    this.object.position.set(0, 0, 0);
    this.object.castShadow = true;
    this.scene.add(this.object);

    this.object.customDepthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      // map: clothTexture,
      alphaTest: 0.5,
    });

    // sphere
    const ballGeo = new THREE.SphereBufferGeometry(this.ballSize, 32, 16);
    const ballMaterial = new THREE.MeshLambertMaterial();
    this.sphere = new THREE.Mesh(ballGeo, ballMaterial);
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = true;
    this.sphere.visible = false;
    this.scene.add(this.sphere);

    // ground

    const groundMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });
    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(20000, 20000),
      groundMaterial,
    );
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    // poles
    const poleGeo = new THREE.BoxBufferGeometry(5, 375, 5);
    const poleMat = new THREE.MeshLambertMaterial();

    const pole1 = new THREE.Mesh(poleGeo, poleMat);
    pole1.position.x = -125;
    pole1.position.y = -62;
    pole1.receiveShadow = true;
    pole1.castShadow = true;
    this.scene.add(pole1);

    const pole2 = new THREE.Mesh(poleGeo, poleMat);
    pole2.position.x = 125;
    pole2.position.y = -62;
    pole2.receiveShadow = true;
    pole2.castShadow = true;
    this.scene.add(pole2);

    const pole3 = new THREE.Mesh(
      new THREE.BoxBufferGeometry(255, 5, 5),
      poleMat,
    );
    pole3.position.y = -250 + 750 / 2;
    pole3.position.x = 0;
    pole3.receiveShadow = true;
    pole3.castShadow = true;
    this.scene.add(pole3);

    const gg = new THREE.BoxBufferGeometry(10, 10, 10);
    const pole4 = new THREE.Mesh(gg, poleMat);
    pole4.position.y = -250;
    pole4.position.x = 125;
    pole4.receiveShadow = true;
    pole4.castShadow = true;
    this.scene.add(pole4);

    const pole5 = new THREE.Mesh(gg, poleMat);
    pole5.position.y = -250;
    pole5.position.x = -125;
    pole5.receiveShadow = true;
    pole5.castShadow = true;
    this.scene.add(pole5);

    // renderer

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (container) {
      container.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.controls.maxPolarAngle = Math.PI * 0.5;
      this.controls.minDistance = 1000;
      this.controls.maxDistance = 5000;
    }
  }

  private simulate(time: number) {
    if (!this.lastTime) {
      this.lastTime = time;
      return;
    }

    let i, j, il, particles, particle, constraints, constraint;
    // Aerodynamics forces

    if (this.params.enableWind) {
      let indx;
      const normal: THREE.Vector3 = new THREE.Vector3();
      const indices: THREE.BufferAttribute = this.clothGeometry.index;
      const normals: THREE.BufferAttribute = this.clothGeometry.attributes
        .normal as THREE.BufferAttribute;

      particles = this.cloth.particles;

      for (i = 0, il = indices.count; i < il; i += 3) {
        for (j = 0; j < 3; j++) {
          indx = indices.getX(i + j);
          normal.fromBufferAttribute(normals, indx);
          this.tmpForce
            .copy(normal)
            .normalize()
            .multiplyScalar(normal.dot(this.windForce));
          particles[indx].addForce(this.tmpForce);
        }
      }
    }

    for (
      particles = this.cloth.particles, i = 0, il = particles.length;
      i < il;
      i++
    ) {
      particle = particles[i];
      particle.addForce(this.gravity);
      particle.integrate(this.TIMESTEP_SQ);
    }
    // Start Constraints
    constraints = this.cloth.constraints;
    il = constraints.length;
    for (i = 0; i < il; i++) {
      constraint = constraints[i];
      this.satisfyConstraints(constraint[0], constraint[1], constraint[2]);
    }
    // Ball Constraints
    this.ballPosition.z = -Math.sin(Date.now() / 600) * 90; // + 40;
    this.ballPosition.x = Math.cos(Date.now() / 400) * 70;

    if (this.params.showBall) {
      this.sphere.visible = true;
      for (
        particles = this.cloth.particles, i = 0, il = particles.length;
        i < il;
        i++
      ) {
        particle = particles[i];
        const pos = particle.position;
        this.diff.subVectors(pos, this.ballPosition);
        if (this.diff.length() < this.ballSize) {
          // collided
          this.diff.normalize().multiplyScalar(this.ballSize);
          pos.copy(this.ballPosition).add(this.diff);
        }
      }
    } else {
      this.sphere.visible = false;
    }

    // Floor Constraints
    for (
      particles = this.cloth.particles, i = 0, il = particles.length;
      i < il;
      i++
    ) {
      particle = particles[i];

      if (particle.position.y < -250) {
        particle.position.y = -250;
      }
    }
    // Pin Constraints
    for (i = 0, il = this.pins.length; i < il; i++) {
      const xy = this.pins[i];
      const p = particles[xy];
      p.position.copy(p.original);
      p.previous.copy(p.original);
    }

    // Floor Constraints
    for (
      particles = this.cloth.particles, i = 0, il = particles.length;
      i < il;
      i++
    ) {
      particle = particles[i];

      if (particle.position.y < -250) {
        particle.position.y = -250;
      }
    }
    // Pin Constraints
    for (i = 0, il = this.pins.length; i < il; i++) {
      const xy = this.pins[i];
      const p = particles[xy];
      p.position.copy(p.original);
      p.previous.copy(p.original);
    }
  }

  private satisfyConstraints(p1: Particle, p2: Particle, distance: number) {
    this.diff.subVectors(p2.position, p1.position);
    const currentDist = this.diff.length();
    if (currentDist === 0) {
      return;
    } // prevents division by 0
    const correction = this.diff.multiplyScalar(1 - distance / currentDist);
    const correctionHalf = correction.multiplyScalar(0.5);

    p1.position.add(correctionHalf);
    p2.position.sub(correctionHalf);
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
      const time = Date.now();
      const windStrength = Math.cos(time / 7000) * 20 + 40;
      this.windForce.set(
        Math.sin(time / 2000),
        Math.cos(time / 3000),
        Math.sin(time / 1000),
      );
      this.windForce.normalize();
      this.windForce.multiplyScalar(windStrength);
      this.simulate(time);

      const p = this.cloth.particles;
      for (let i = 0, il = p.length; i < il; i++) {
        const v = p[i].position;
        this.clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z);
      }
      (this.clothGeometry.attributes
        .position as THREE.BufferAttribute).needsUpdate = true;
      this.clothGeometry.computeVertexNormals();
      this.sphere.position.copy(this.ballPosition);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private mounted() {
    this.pinsFormation.push(this.pins);
    this.pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.pinsFormation.push(this.pins);
    this.pins = [0];
    this.pinsFormation.push(this.pins);
    this.pins = []; // cut the rope ;)
    this.pinsFormation.push(this.pins);
    this.pins = [0, this.cloth.w]; // classic 2 pins
    this.pinsFormation.push(this.pins);
    this.pins = this.pinsFormation[1];
    this.init();
    this.animate();
  }

  private beforeDestroy() {
    this.dispose();
  }
}
