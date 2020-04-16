/* eslint-disable @typescript-eslint/camelcase */
import IPoint from "@/interfaces/i-point"
import IOptions from "@/interfaces/i-options"
import maths from "@/scripts/math"
import Draw from '@/scripts/draw';
import graphics from "@/scripts/graphics";

export default class Boid {
  private static next_id = 0;
  public id: number;
  public pos: IPoint;
  public vel: IPoint;
  public color: string;
  public debug: boolean;
  public seen: Array<IPoint>;
  public com: IPoint;
  private draw: Draw;

  constructor(
    pos: IPoint, vel: IPoint, color: string, debug: boolean, draw: Draw) {
    this.id = Boid.next_id++;
    this.pos = pos;
    this.vel = vel;
    this.color = color;
    this.debug = debug;
    this.draw = draw;
    this.seen = [];
    this.com = { x: 0, y: 0 };
  }

  public render({ boid_size }: IOptions) {
    const th =
      Math.atan(this.vel.y / this.vel.x) - (this.vel.x < 0 ? Math.PI : 0);
    this.draw.drawPrimative(
      graphics.translatePrimitive(
        graphics.rotatePrimitive(
          graphics.scalePrimitive(graphics.triangle, {
            x: boid_size,
            y: boid_size,
          }),
          th
        ),
        this.pos
      ),
      this.color
    );
  }

  public render_debug(opts: IOptions) {
    this.draw.drawCircle(this.pos, opts.collision_dist, "#0000ff");
    if (this.seen.length > 0) this.draw.fillCircle(this.com, 7, "#ff0000");
    if (this.seen.length > 0) this.draw.drawCircle(this.com, 7, "#000");
    this.draw.drawFOV(
      this.pos,
      opts.vision_dist,
      this.vel,
      opts.field_of_view_deg * Math.PI / 180,
      "#1f823f"
    );
    for (const pos of this.seen) {
      const x = pos.x - this.pos.x;
      const y = pos.y - this.pos.y;
      const d = Math.sqrt(x * x + y * y);
      if (d < opts.vision_dist) this.draw.drawLine(pos, this.pos);
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
      const x = this.pos.x - other.pos.x;
      const y = this.pos.y - other.pos.y;
      const d = Math.sqrt(x * x + y * y);

      if (d > opts.vision_dist) continue;

      const other_v = {
        x: other.pos.x - this.pos.x,
        y: other.pos.y - this.pos.y,
      };
      const th = maths.angle_between(other_v, this.vel);

      // other boid was seen
      if (th > opts.field_of_view_deg * Math.PI / 180) continue;
      if (this.debug) this.seen.push(other.pos);

      seen.push({ other, other_v, th, d });
    }

    // Collision Avoidance
    for (const { other_v, th, d } of seen) {
      if (d > opts.collision_dist) continue;

      if (maths.cross_product(other_v, this.vel) < 0) {
        this.vel = maths.rotate_vector(
          this.vel,
          -th * dt * opts.collision_avoidance_strength
        );
      } else {
        this.vel = maths.rotate_vector(
          this.vel,
          th * dt * opts.collision_avoidance_strength
        );
      }
    }

    // Velocity Alignment
    const com = { x: 0, y: 0 };
    if (seen.length > 0) {
      const vel_avg = { x: 0, y: 0 };
      for (const { other } of seen) {
        vel_avg.x += other.vel.x;
        vel_avg.y += other.vel.y;
        com.x += other.pos.x;
        com.y += other.pos.y;
      }

      vel_avg.x /= seen.length;
      vel_avg.y /= seen.length;
      com.x /= seen.length;
      com.y /= seen.length;

      const th = maths.angle_between(vel_avg, this.vel);
      if (maths.cross_product(vel_avg, this.vel) > 0) {
        this.vel = maths.rotate_vector(
          this.vel,
          -th * dt * opts.velocity_align_strength
        );
      } else {
        this.vel = maths.rotate_vector(
          this.vel,
          th * dt * opts.velocity_align_strength
        );
      }
    }
    if (this.debug) this.com = com;

    // Center of Mass Alignment
    if (seen.length > 0) {
      const com_v = { x: com.x - this.pos.x, y: com.y - this.pos.y };
      const th = maths.angle_between(com_v, this.vel);
      if (maths.cross_product(com_v, this.vel) > 0) {
        this.vel = maths.rotate_vector(
          this.vel,
          -th * dt * opts.center_of_mass_align_strength
        );
      } else {
        this.vel = maths.rotate_vector(
          this.vel,
          th * dt * opts.center_of_mass_align_strength
        );
      }
    }

    /* --------------- */
    /* update position */
    /* --------------- */
    this.pos = {
      x: this.pos.x + this.vel.x * dt * opts.boid_speed,
      y: this.pos.y + this.vel.y * dt * opts.boid_speed,
    };

    if (this.pos.x > this.draw.width) this.pos = { x: 0, y: this.pos.y };
    if (this.pos.x < 0) this.pos = { x: this.draw.width, y: this.pos.y };
    if (this.pos.y > this.draw.height) this.pos = { x: this.pos.x, y: 0 };
    if (this.pos.y < 0) this.pos = { x: this.pos.x, y: this.draw.height };
  }
}