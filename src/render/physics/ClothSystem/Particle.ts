import * as THREE from 'three';

export default class Particle {
  public position: THREE.Vector3 = new THREE.Vector3();
  public original: THREE.Vector3 = new THREE.Vector3();
  public previous: THREE.Vector3 = new THREE.Vector3();
  private a: THREE.Vector3 = new THREE.Vector3(0, 0, 0); // acceleration
  private mass: number = 0.5;
  private invMass: number = 1 / this.mass;
  private tmp: THREE.Vector3 = new THREE.Vector3();
  private tmp2: THREE.Vector3 = new THREE.Vector3();

  constructor(x: number, y: number, z: number, mass: number) {
    this.mass = mass;
    // init
    this.clothFunction(x, y, this.position); // position
    this.clothFunction(x, y, this.previous); // previous
    this.clothFunction(x, y, this.original);
  }

  public addForce(force: THREE.Vector3) {
    this.a.add(this.tmp2.copy(force).multiplyScalar(this.invMass));
  }

  public integrate(timesq: number) {
    const newPos = this.tmp.subVectors(this.position, this.previous);
    newPos.multiplyScalar(0.97).add(this.position);
    newPos.add(this.a.multiplyScalar(timesq));
    this.tmp = this.previous;
    this.previous = this.position;
    this.position = newPos;
    this.a.set(0, 0, 0);
  }

  public clothFunction(u: number, v: number, target: THREE.Vector3) {
    const width = 250;
    const height = 250;

    const x = (u - 0.5) * width;
    const y = (v + 0.5) * height;
    const z = 0;
    target.set(x, y, z);
  }
}
