<template>
  <div>
    <div class="box">
      <div>
        <canvas width="1920" height="1080" ref="main_canvas" id="main_canvas" />
      </div>
      <p class="right">
        {{ (opts.fps_hist.reduce((a, b) => a + b) / opts.fps_hist.length).toFixed(0) }}
        FPS
      </p>
      <div class="container">
        <label for="num_boids">Number of Boids</label>
        <input
          id="num_boids"
          type="range"
          min="1"
          max="500"
          step="1"
          class="slider"
          v-model="opts.num_boids"
        />
        <p>{{ opts.num_boids }}</p>
        <label for="speed">Boid Speed</label>
        <input
          id="speed"
          type="range"
          min="0"
          max="2"
          step=".01"
          class="slider"
          v-model="opts.boid_speed"
        />
        <p>{{ opts.boid_speed }}</p>
        <label for="size">Boid Size</label>
        <input
          id="size"
          type="range"
          min="1"
          max="50"
          step="1"
          class="slider"
          v-model="opts.boid_size"
        />
        <p>{{ opts.boid_size }}</p>
        <div class="bar" />
        <div class="bar" />
        <div class="bar" />
        <label for="field_of_view_deg">Field of View</label>
        <input
          id="field_of_view_deg"
          type="range"
          min="1"
          max="180"
          step="1"
          class="slider"
          v-model="opts.field_of_view_deg"
        />
        <p>{{ opts.field_of_view_deg }}°</p>
        <label for="vision_dist">Vision Distance</label>
        <input
          id="vision_dist"
          type="range"
          min="0"
          max="500"
          step="1"
          class="slider"
          v-model="opts.vision_dist"
        />
        <p>{{ opts.vision_dist }}</p>
        <label for="collision_dist">Collision Avoidance Distance</label>
        <input
          id="collision_dist"
          type="range"
          min="1"
          max="200"
          step="1"
          class="slider"
          v-model="opts.collision_dist"
        />
        <p>{{ opts.collision_dist }}</p>
        <label for="draw_debug">Draw Vision Lines</label>
        <input id="draw_debug" type="checkbox" v-model="opts.draw_debug" />
        <p></p>
        <div class="bar" />
        <div class="bar" />
        <div class="bar" />
        <label for="collision_avoidance_strength">Collision Avoidance Strength</label>
        <input
          id="collision_avoidance_strength"
          type="range"
          min="0"
          max=".02"
          step=".001"
          class="slider"
          v-model="opts.collision_avoidance_strength"
        />
        <p>{{ opts.collision_avoidance_strength }}</p>
        <label for="velocity_align_strength">Velocity Alignment Strength</label>
        <input
          id="velocity_align_strength"
          type="range"
          min="0"
          max=".02"
          step=".001"
          class="slider"
          v-model="opts.velocity_align_strength"
        />
        <p>{{ opts.velocity_align_strength }}</p>
        <label for="center_of_mass_align_strength">Center of Mass Alignment Strength</label>
        <input
          id="center_of_mass_align_strength"
          type="range"
          min="0"
          max=".02"
          step=".001"
          class="slider"
          v-model="opts.center_of_mass_align_strength"
        />
        <p>{{ opts.center_of_mass_align_strength }}</p>
      </div>
      <div class="bar m1em" />
      <div>
        <p class="left">
          <a href="https://en.wikipedia.org/wiki/Boids">Boids</a> are an
          artificial life program, developed by Craig Reynolds, which simulates
          the flocking behaviour of birds. The name "boid" corresponds to a
          shortened version of "bird-oid object", which refers to a bird-like
          object. Boids are an example of emergent behavior; that is, the
          complexity of Boids arises from the interaction of individual agents
          (the boids, in this case) adhering to a set of simple rules. The rules
          applied in the simplest Boids world are as follows:
        </p>
        <ul>
          <li>separation: steer to avoid crowding local flockmates</li>
          <li>alignment: steer towards the average heading of local flockmates</li>
          <li>
            cohesion: steer to move towards the average position (center of
            mass) of local flockmates
          </li>
        </ul>
        <p class="left">
          The blue ring shows how close a flock mate has to get before collision
          avoidance begins.
        </p>
        <p class="left">
          The green region shows the field of view combined with the vision
          distance. Any flock member inside this reigon will be used for
          velocity alignment and center of mass alignment calculations. Red
          lines are also drawn to these flock members.
        </p>
        <p class="left">The red dot is the center of mass.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Component, Vue } from "vue-property-decorator";
import IOptions from "@/interfaces/i-options";
import Boid from "@/scripts/boid";
import Draw from "@/scripts/draw";
import maths from "@/scripts/math";

@Component
export default class Boids extends Vue {
  private opts: IOptions = {
    num_boids: 100,
    boid_speed: 0.45,
    boid_size: 10,
    field_of_view_deg: 120,
    vision_dist: 100,
    collision_dist: 50,
    draw_debug: true,
    collision_avoidance_strength: 0.005,
    velocity_align_strength: 0.01,
    center_of_mass_align_strength: 0.001,
    fps_hist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  };

  private boids: Array<Boid> = [];
  private draw: Draw | null = null;
  private prevTime: number = performance.now();

  private id = 0;

  constructor() {
    super();
    console.log("constructor");
  }

  private update(dt: number): void {
    for (const boid of this.boids) {
      boid.update(dt, this.boids, this.opts);
    }

    this.opts.fps_hist.shift();
    this.opts.fps_hist.push((1 / dt) * 1000);
  }

  private render_frame(): void {
    if (this.draw) this.draw.clear();
    for (const boid of this.boids) {
      boid.render(this.opts);
    }
    if (this.opts.draw_debug) this.boids[0].render_debug(this.opts);
  }

  private animation_loop(time: number): void {
    const dt = time - this.prevTime;
    this.prevTime = time;
    this.update(dt);

    this.render_frame();
    if (this.boids.length < this.opts.num_boids) {
      const more = this.opts.num_boids - this.boids.length;
      const cs = maths.linear_spaced_array(100, 255, more);
      if (this.draw)
        for (let i = 0; i < more; ++i) {
          this.boids.push(
            new Boid(
              { x: 100, y: 100 },
              maths.random_vector(),
              `rgb(0,0,${cs[i]})`,
              false,
              this.draw
            )
          );
        }
    }
    if (this.boids.length > this.opts.num_boids) {
      this.boids.splice(this.opts.num_boids);
    }
    requestAnimationFrame(this.animation_loop);
  }

  mounted() {
    console.log("mounted");

    const canvas = this.$refs.main_canvas as HTMLCanvasElement;
    this.boids = [];
    this.draw = new Draw(canvas);

    const cs = maths.linear_spaced_array(100, 255, this.opts.num_boids);
    for (let i = 0; i < this.opts.num_boids; ++i) {
      this.boids.push(
        new Boid(
          { x: 100, y: 100 },
          maths.random_vector(),
          `rgb(0,0,${cs[i]})`,
          false,
          this.draw
        )
      );
    }
    this.boids[0].debug = true;
    requestAnimationFrame(this.animation_loop);
  }
}
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: max-content auto 12%;
  grid-gap: 5px;
  align-items: center;
  background: #eee;
  border-radius: 10px;
  padding: 10px;
}
.container > label {
  text-align: right;
}
.container > p {
  text-align: left;
}
label {
  margin-right: 1em;
}
p {
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 1em;
}
.slider {
  -webkit-appearance: none;
  height: 5px;
  border-radius: 10px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 15px;
  border-radius: 20%;
  background: #577399;
  cursor: pointer;
}
.slider::-moz-range-thumb {
  width: 10px;
  height: 15px;
  border-radius: 20%;
  background: #577399;
  cursor: pointer;
}
.slider:hover {
  opacity: 1;
}
.box {
  max-width: 1000px;
  margin: 0 auto;
}
.bar {
  background: darkgray;
  height: 2px;
}
canvas {
  max-width: 100%;
  height: auto;
}
.right {
  text-align: right;
}
.left {
  text-align: left;
}
ul {
  text-align: left;
}
.m1em {
  margin: 1em;
}
</style>
