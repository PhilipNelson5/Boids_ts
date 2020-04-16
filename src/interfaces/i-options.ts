export default interface IOptions {
  num_boids: number;
  boid_speed: number;
  boid_size: number;
  field_of_view_deg: number;
  vision_dist: number;
  collision_dist: number;
  draw_debug: boolean;
  collision_avoidance_strength: number;
  velocity_align_strength: number;
  center_of_mass_align_strength: number;
  fps_hist: Array<number>;
}