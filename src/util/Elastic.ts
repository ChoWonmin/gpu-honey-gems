import * as THREE from 'three';
import Particle from './Particle';
import {
  CylinderBufferGeometry,
  CylinderGeometry,
  MeshBasicMaterial,
} from 'three';

export default class Elastic {
  public geometry: THREE.Geometry = new CylinderGeometry(
    1000,
    1000,
    1000,
    1000,
  );
  public material: THREE.Material = new MeshBasicMaterial({
    color: 0xff0000,
  });
  public mesh: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  public ks: number = 10;
  public kd: number = 3;
  private i: number = 0;
  private j: number = 0;
  private length: number = 0;

  constructor(i: number, j: number, particles: Particle[]) {
    this.i = i;
    this.j = j;

    const iPos = particles[this.i].mesh.position.clone();
    const jPos = particles[this.j].mesh.position.clone();

    this.length = iPos.add(jPos.multiplyScalar(-1)).length();
  }

  public getMesh() {
    return this.mesh;
  }

  public applyForce(particles: Particle[]) {
    const iPos = particles[this.i].mesh.position.clone();
    const jPos = particles[this.j].mesh.position.clone();

    const dx: THREE.Vector3 = iPos.add(jPos.multiplyScalar(-1));
    const dv: THREE.Vector3 = iPos.add(jPos.multiplyScalar(-1));

    const lx: number = dx.length();

    const spring: number =
      -(this.ks * (lx - this.length) + (dv.dot(dx) * this.kd) / lx) / lx;
    const force: THREE.Vector3 = dx.multiplyScalar(spring);

    particles[this.i].addForce(force);
    particles[this.j].addForce(force.multiplyScalar(-1));
  }
}
