function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export default class Vector {
  x: number;
  y: number;
  z: number;

  static rand(minx = -1, maxx = 1, miny = -1, maxy = 1, minz = -1, maxz = 1): Vector {
    const x = rand(minx, maxx);
    const y = rand(miny, maxy);
    const z = rand(minz, maxz);

    const v = new Vector(x, y, z);
    return v;
  }

  static randNorm(minx = -1, maxx = 1, miny = -1, maxy = 1, minz = -1, maxz = 1): Vector {
    const x = rand(minx, maxx);
    const y = rand(miny, maxy);
    const z = rand(minz, maxz);

    const v = new Vector(x, y, z);
    v.normalize();
    return v;
  }

  static normalize(v: Vector): Vector {
    const vn = new Vector(v.x, v.y, v.z);
    vn.normalize();
    return vn;
  }

  static add(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  static sub(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  static mul(v: Vector, n: number): Vector {
    return new Vector(v.x * n, v.y * n, v.z * n);
  }

  static div(v: Vector, n: number): Vector {
    return new Vector(v.x / n, v.y / n, v.z / n);
  }

  static dist(v1: Vector, v2: Vector): number {
    const x = v1.x - v2.x;
    const y = v1.y - v2.y;
    const z = v1.z - v2.z;
    return Math.sqrt(x*x + y*y + z*z);
  }

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z
  }

  public normalize(): void {
    const m = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    if (Math.abs(m) < 1e-6) return;
    this.x /= m;
    this.y /= m;
    this.z /= m;
  }

  public add(other: Vector): void {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }

  public sub(other: Vector): void {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
  }

  public mul(n: number): void {
    this.x *= n;
    this.y *= n;
    this.z *= n;
  }

  public div(n: number): void {
    this.x /= n;
    this.y /= n;
    this.z /= n;
  }

  public setMag(m: number): void {
    this.normalize();
    this.mul(m);
  }

  public limit(l: number): void {
    const m = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    if (m <= l) return;
    this.setMag(l);
  }
}