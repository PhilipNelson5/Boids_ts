import IPoint from '@/interfaces/i-point';
import IPrimitave from '@/interfaces/i-primitave';

export default class Draw {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // this.canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
    // if (!this.context)
    // throw new Error(`2d context not supported or canvas already initialized`);
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
    this.context.beginPath();
    this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
  }
  drawCircle(center: IPoint, radius: number, color: string) {
    this.context.beginPath();
    this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    this.context.lineWidth = 4;
    this.context.strokeStyle = color;
    this.context.stroke();
  }
  drawFOV(center: IPoint, radius: number, forward: IPoint, angle: number, color: string) {
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
  drawLine(p1: IPoint, p2: IPoint) {
    this.context.beginPath();
    this.context.moveTo(p1.x, p1.y);
    this.context.lineTo(p2.x, p2.y);
    this.context.strokeStyle = "#ff0000";
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