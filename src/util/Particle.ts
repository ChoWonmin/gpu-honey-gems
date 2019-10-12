import * as THREE from 'three';

export default class Particle {
  public geometry: THREE.Geometry;
  public material: THREE.Material;
  public mesh: THREE.Mesh;

  public velocity: THREE.Vector3;

  public mass: number;
  public force: THREE.Vector3;

  constructor(
    geometry: THREE.Geometry,
    material: THREE.Material,
    position: THREE.Vector3,
    velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    mass: number = 1,
    force: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
  ) {
    this.geometry = geometry;
    this.material = material;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(position.x, position.y, position.z);

    this.velocity = velocity;
    this.mass = mass;
    this.force = force;
  }

  public clearForce() {
    this.force.set(0, 0, 0);
  }

  public addForce(force: THREE.Vector3) {
    this.force.copy(this.force.clone().add(force));
  }

  public eval(dt: number) {
    // this.velocity += force / mass * dt;
    // this.mesh.position += velocity * dt;

    this.velocity.add(this.force.clone().multiplyScalar(1 / (this.mass * dt)));
    this.mesh.position.add(this.velocity.clone().multiplyScalar(dt));
  }

  public getMesh() {
    return this.mesh;
  }
}
