import * as THREE from 'three';
import Particle from './Particle';

export default class Cloth {
  public particles: Particle[] = [];
  public constraints: any[][] = [];
  public w: number = 10;
  public h: number = 10;
  private u: number = 0;
  private v: number = 0;
  private restDistance: number = 25;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;

    let u;
    let v;

    for (v = 0; v <= h; v++) {
      for (u = 0; u <= w; u++) {
        this.particles.push(new Particle(u / w, v / h, 0, 0.01));
      }
    }
    // Structural
    for (v = 0; v < h; v++) {
      for (u = 0; u < w; u++) {
        this.constraints.push([
          this.particles[this.index(u, v)],
          this.particles[this.index(u, v + 1)],
          this.restDistance,
        ]);
        this.constraints.push([
          this.particles[this.index(u, v)],
          this.particles[this.index(u + 1, v)],
          this.restDistance,
        ]);
      }
    }
    for (u = w, v = 0; v < h; v++) {
      this.constraints.push([
        this.particles[this.index(u, v)],
        this.particles[this.index(u, v + 1)],
        this.restDistance,
      ]);
    }
    for (v = h, u = 0; u < w; u++) {
      this.constraints.push([
        this.particles[this.index(u, v)],
        this.particles[this.index(u + 1, v)],
        this.restDistance,
      ]);
    }
  }

  public index(u: number, v: number) {
    return u + v * (this.w + 1);
  }
}
