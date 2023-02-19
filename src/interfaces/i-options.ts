export default interface IOptions {
  boid_size: number;
  max_speed: number;
  center_of_mass_align_strength: number;
  collision_avoidance_strength: number;
  collision_dist: number;
  draw_debug: boolean;
  field_of_view_deg: number;
  fps_hist: Array<number>;
  num_boids: number;
  velocity_align_strength: number;
  vision_dist: number;
  world: {width: number, height: number, depth: number};
}