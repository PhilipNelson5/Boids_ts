/* eslint-disable @typescript-eslint/camelcase */
import IOptions from "@/interfaces/i-options"
import Maths from "@/scripts/math"
import Draw from '@/scripts/draw';
import graphics from "@/scripts/graphics";
import Vector from "@/scripts/vector";

export default class Boid {
  private static next_id = 0;
  public id: number;
  public pos: Vector;
  public vel: Vector;
  public color: string;
  public debug: boolean;
  public seen: Array<Vector>;
  public com: Vector;
  private draw: Draw;

  constructor({ pos, vel, color, draw, debug = false }:
    { pos: Vector; vel: Vector; color: string; debug?: boolean; draw: Draw }) {
    this.id = Boid.next_id++;
    this.pos = pos;
    this.vel = vel;
    this.color = color;
    this.debug = debug;
    this.draw = draw;
    this.seen = [];
    this.com = new Vector();
  }

  public render({ boid_size, world:{width, height, depth}}: IOptions) {
    const th =
      Math.atan(this.vel.y / this.vel.x) - (this.vel.x < 0 ? Math.PI : 0);
    const pos = new Vector(
      Maths.lerp(0, this.draw.width, this.pos.x / width),
      Maths.lerp(0, this.draw.height, this.pos.y / height),
      Maths.lerp(0, Math.min(this.draw.height, this.draw.width), this.pos.z / depth)
    )
    this.draw.drawPrimative(
      graphics.translatePrimitive(
        graphics.rotatePrimitive(
          graphics.scalePrimitive(graphics.triangle, {
            x: Maths.lerp(0, this.draw.width, boid_size / width) / (pos.z + 50) * 50,
            y: Maths.lerp(0, this.draw.width, boid_size / width) / (pos.z + 50) * 50,
          }),
          th
        ),
        pos
      ),
      this.color
    );

  }

  public render_debug(opts: IOptions) {
    const pos = new Vector(
      Maths.lerp(0, this.draw.width, this.pos.x / opts.world.width),
      Maths.lerp(0, this.draw.height, this.pos.y / opts.world.height)
    )
    // collision distance
    this.draw.drawCircle(this.pos, opts.collision_dist, "#0000ff");

    // center of mass
    if (this.seen.length > 0) this.draw.fillCircle(this.com, 7, "#ff0000");
    if (this.seen.length > 0) this.draw.drawCircle(this.com, 7, "#000");

    // field of view
    this.draw.drawFOV(
      this.pos,
      opts.vision_dist,
      this.vel,
      opts.field_of_view_deg * Math.PI / 180,
      "#1f823f"
    );

    // lines to seen
    for (const other of this.seen) {
      const x = other.x - this.pos.x;
      const y = other.y - this.pos.y;
      const d = Math.sqrt(x * x + y * y);
      if (d <= opts.collision_dist) this.draw.drawLine(other, this.pos, "#ff0000");
      else this.draw.drawLine(other, this.pos, "#1f823f");
    }
  }

  public update(dt: number, boids: Array<Boid>, opts: IOptions): void {
    /* --------------- */
    /* update velocity */
    /* --------------- */

    // Collision Detection
    const seen = [];
    if (this.debug) this.seen = [];
    for (const other of boids) {
      if (this.id == other.id) continue;
      const d = Vector.dist(this.pos, other.pos);

      // other boid is close
      if (d > opts.vision_dist) continue;
      const other_v = Vector.sub(other.pos, this.pos);
      const th = Maths.angle_between(other_v, this.vel);

      // other boid was seen
      if (th > opts.field_of_view_deg * Math.PI / 180) continue;
      seen.push({ other, other_v, th, d });
      if (this.debug) this.seen.push(other.pos);
    }

    const steering = Vector.normalize(this.vel);

    // Collision Avoidance
    const f_collision = new Vector();
    for (const { other_v, th, d } of seen) {
      if (d > opts.collision_dist) continue;

      const diff = Vector.mul(other_v, -1);
      
      diff.div(d*d);
      diff.mul(50);
      f_collision.add(diff);
    }
    f_collision.mul(opts.collision_avoidance_strength);
    f_collision.sub(this.vel);
    steering.add(f_collision);
    // if(this.debug) console.log(JSON.stringify(f_collision));
    
    // Velocity Alignment
    const com = new Vector();
    if (seen.length > 0) {
      const vel_avg = new Vector();
      for (const { other } of seen) {
        vel_avg.add(other.vel);
        com.add(other.pos)
      }

      com.div(seen.length);
      vel_avg.div(seen.length);

      const f_align = Vector.mul(vel_avg, opts.velocity_align_strength);
      f_align.sub(this.vel);
      steering.add(f_align);

      if (this.debug) this.com = com;
    }

    // Center of Mass Alignment
    if (seen.length > 0) {
      const f_cohesion = Vector.sub(com, this.pos);
      f_cohesion.setMag(opts.max_speed);
      f_cohesion.mul(opts.center_of_mass_align_strength);
      steering.add(f_cohesion);
    }

    if (seen.length > 0)
       this.vel.add(steering);
    
    this.vel.limit(opts.max_speed);
    // if(this.debug) console.log(JSON.stringify(this.vel));

    /* --------------- */
    /* update position */
    /* --------------- */
    this.pos.add(this.vel);

    if (this.pos.x > opts.world.width) this.pos.x = 1;
    if (this.pos.x < 0) this.pos.x = opts.world.width-1;
    if (this.pos.y > opts.world.height) this.pos.y = 1;
    if (this.pos.y < 0) this.pos.y = opts.world.height-1;
    if (this.pos.z > opts.world.depth) this.pos.z = 1;
    if (this.pos.z < 0) this.pos.z = opts.world.depth-1;

    // if (this.debug) console.log(JSON.stringify(this.vel), JSON.stringify(this.pos));
  }
}