import * as THREE from 'three';
import Particle from './Particle';
import {
  CylinderBufferGeometry,
  CylinderGeometry,
  MeshBasicMaterial,
} from 'three';

export default class Elastic {
  public geometry: THREE.Geometry = new THREE.Geometry();
  public material: THREE.Material = new THREE.LineBasicMaterial({
    color: 0xff0000,
  });
  public line: THREE.Line = new THREE.Line(this.geometry, this.material);

  public ks: number = 50;
  public kd: number = 1;
  private i: number = 0;
  private j: number = 0;
  private length: number = 0;

  private particles: Particle[] = [];

  constructor(i: number, j: number, particles: Particle[]) {
    this.i = i;
    this.j = j;

    this.particles = particles;

    const iPos = this.particles[this.i].mesh.position.clone();
    const jPos = this.particles[this.j].mesh.position.clone();

    this.length = iPos.distanceTo(jPos);

    this.geometry.vertices.push(iPos);
    this.geometry.vertices.push(jPos);
  }

  public getMesh() {
    return this.line;
  }

  public applyForce() {
    const iPos = this.particles[this.i].mesh.position.clone();
    const jPos = this.particles[this.j].mesh.position.clone();

    const iv = this.particles[this.i].velocity;
    const jv = this.particles[this.j].velocity;

    const dx: THREE.Vector3 = iPos.add(jPos.multiplyScalar(-1));
    const dv: THREE.Vector3 = iv.add(jv.multiplyScalar(-1));

    const lx: number = dx.length();

    const viscous: number = this.ks * (lx - this.length);
    const damp: number = this.kd * (dv.dot(dx) / lx);

    const spring: number = -(viscous + damp) / lx;

    const force: THREE.Vector3 = dx.multiplyScalar(spring);

    this.particles[this.i].addForce(force);
    this.particles[this.j].addForce(force.multiplyScalar(-1));
  }

  public update() {
    this.geometry.vertices[0] = this.particles[this.i].getMesh().position;
    this.geometry.vertices[1] = this.particles[this.j].getMesh().position;
    this.geometry.verticesNeedUpdate = true;
  }
}
