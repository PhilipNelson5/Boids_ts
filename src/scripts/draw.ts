import IPoint from '@/interfaces/i-point';
import IPrimitave from '@/interfaces/i-primitave';
import Maths from '@/scripts/math';
import Vector from '@/scripts/vector';

export default class Draw {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private world: {width: number; height: number};

  constructor(canvas: HTMLCanvasElement, world: {width: number; height: number}) {
    this.canvas = canvas;
    // eslint-disable-next-line
    this.context = this.canvas.getContext('2d')!;
    this.world = world;
  }

  get width() { return this.canvas.width; }
  get height() { return this.canvas.height; }

  clear() {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.fillStyle = "#cde2e2";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }
  fillCircle(center: IPoint, radius: number, color: string) {
    radius = Maths.lerp(0, this.width, radius / this.world.width)
    center = new Vector(
      Maths.lerp(0, this.width, center.x / this.world.width),
      Maths.lerp(0, this.height, center.y / this.world.height),
    )

    this.context.beginPath();
    this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
  }
  drawCircle(center: IPoint, radius: number, color: string) {
    radius = Maths.lerp(0, this.width, radius / this.world.width)
    center = new Vector(
      Maths.lerp(0, this.width, center.x / this.world.width),
      Maths.lerp(0, this.height, center.y / this.world.height),
    )

    this.context.beginPath();
    this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.context.lineWidth = 4;
    this.context.strokeStyle = color;
    this.context.stroke();
  }
  drawFOV(center: Vector, radius: number, forward: Vector, angle: number, color: string) {
    forward = Vector.normalize(forward);
    radius = Maths.lerp(0, this.width, radius / this.world.width)
    center = new Vector(
      Maths.lerp(0, this.width, center.x / this.world.width),
      Maths.lerp(0, this.height, center.y / this.world.height),
    )

    const start =
      Math.atan(forward.y / forward.x) - (forward.x < 0 ? Math.PI : 0);
    this.context.beginPath();
    this.context.moveTo(
      center.x + forward.x * radius,
      center.y + forward.y * radius
    );
    this.context.arc(center.x, center.y, radius, start, start + angle, false);
    this.context.lineTo(center.x, center.y);
    this.context.moveTo(
      center.x + forward.x * radius,
      center.y + forward.y * radius
    );
    this.context.arc(center.x, center.y, radius, start, start - angle, true);
    this.context.lineTo(center.x, center.y);
    this.context.lineWidth = 4;
    this.context.strokeStyle = color;
    this.context.stroke();
  }
  drawLine(p1: Vector, p2: Vector, color = "#ff0000") {
    p1 = new Vector(
      Maths.lerp(0, this.width, p1.x / this.world.width),
      Maths.lerp(0, this.height, p1.y / this.world.height),
    )
    p2 = new Vector(
      Maths.lerp(0, this.width, p2.x / this.world.width),
      Maths.lerp(0, this.height, p2.y / this.world.height)
    )
    this.context.beginPath();
    this.context.moveTo(p1.x, p1.y);
    this.context.lineTo(p2.x, p2.y);
    this.context.strokeStyle = color;
    this.context.lineWidth = 2;
    this.context.stroke();
  }
  drawPrimative({ verts }: IPrimitave, color: string) {
    this.context.beginPath();
    this.context.moveTo(verts[0].x, verts[0].y);
    for (let i = 1; i < verts.length; ++i) {
      this.context.lineTo(verts[i].x, verts[i].y);
    }
    this.context.fillStyle = color;
    this.context.fill();
  }
}