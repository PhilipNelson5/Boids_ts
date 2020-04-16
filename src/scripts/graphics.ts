/* eslint-disable @typescript-eslint/camelcase */
import IPoint from "@/interfaces/i-point"
import IPrimitave from "@/interfaces/i-primitave"

/**
 * Make a regular polygon centered around (0, 0) with verticies
 * distance one from the origin
 *
 * @param {Integer} n The number of verticies of the regular polygon
 */
function makeRegularPrimitive(n: number): IPrimitave {
  const verts: Array<IPoint> = [];
  const dth = (2 * Math.PI) / n;

  for (let i = 0; i < n; ++i) {
    verts.push({ x: 0.1 * Math.cos(i * dth), y: 0.1 * Math.sin(i * dth) });
  }

  return {
    center: { x: 0, y: 0 },
    verts: verts,
  };
}

/**
 * Translate a point by a distance
 *
 * @param {Point} point - The point to translate
 * @param {Point} distance - A vector representing the distance to translate the point by
 * @return {Object} New point translated by distance
 */
function translatePoint(point: IPoint, distance: IPoint): IPoint {
  return { x: point.x + distance.x, y: point.y + distance.y };
}

/**
 * translate a primitive by a distance
 *
 * @param {Object} primitive {
 *   @member {Point} center - Center of the polygon
 *   @member {Point[]} verts - Array of verticies (must have 2+)
 * }
 * @param {Point} distance - A vector representing the distance to translate the point by
 * @return {Object} New primitive translated by distance
 */
function translatePrimitive(primitive: IPrimitave, distance: IPoint): IPrimitave {
  const newPrim: IPrimitave = {
    center: { x: 0, y: 0 },
    verts: []
  };

  newPrim.center = translatePoint(primitive.center, distance);

  for (let i = 0; i < primitive.verts.length; ++i) {
    newPrim.verts[i] = translatePoint(primitive.verts[i], distance);
  }

  return newPrim;
}

/**
 * Scales a primitive by an ammount in the x and y
 *
 * @param {Object} primitive {
 *   @member {Point} center - Center of the polygon
 *   @member {Point[]} verts - Array of verticies (must have 2+)
 * }
 * @param {Point} scale - Scale in the x and y directions
 */
function scalePrimitive(primitive: IPrimitave, scale: IPoint): IPrimitave {
  let newPrim;
  if (primitive.center.x === 0 && primitive.center.y === 0) {
    newPrim = JSON.parse(JSON.stringify(primitive));
  } else {
    newPrim = translatePrimitive(primitive, {
      x: -primitive.center.x,
      y: -primitive.center.y,
    });
  }

  for (let i = 0; i < newPrim.verts.length; ++i) {
    newPrim.verts[i].x *= scale.x;
    newPrim.verts[i].y *= scale.y;
  }

  if (primitive.center.x === 0 && primitive.center.y === 0) {
    return newPrim;
  } else {
    return translatePrimitive(newPrim, {
      x: primitive.center.x,
      y: primitive.center.y,
    });
  }
}

/**
 * Rotates a primitive by a number of radians
 *
 * @param {Object} primitive {
 *   @member {Point} center - Center of the polygon
 *   @member {Point[]} verts - Array of verticies (must have 2+)
 * }
 * @param {Number} angle - The angle in Radians to rotate the primitive
 */
function rotatePrimitive(primitive: IPrimitave, angle: number): IPrimitave {
  let newPrim;
  if (primitive.center.x === 0 && primitive.center.y === 0) {
    newPrim = JSON.parse(JSON.stringify(primitive));
  } else {
    newPrim = translatePrimitive(primitive, {
      x: -primitive.center.x,
      y: -primitive.center.y,
    });
  }

  const sina = Math.sin(angle);
  const cosa = Math.cos(angle);
  for (let i = 0; i < newPrim.verts.length; ++i) {
    const newx = newPrim.verts[i].x * cosa - newPrim.verts[i].y * sina;
    const newy = newPrim.verts[i].x * sina + newPrim.verts[i].y * cosa;
    newPrim.verts[i].x = newx;
    newPrim.verts[i].y = newy;
  }

  if (primitive.center.x === 0 && primitive.center.y === 0) {
    return newPrim;
  } else {
    return translatePrimitive(newPrim, {
      x: primitive.center.x,
      y: primitive.center.y,
    });
  }
}

export default {
  makeRegularPrimitive,
  translatePoint,
  translatePrimitive,
  scalePrimitive,
  rotatePrimitive,
  triangle: {
    center: { x: 0, y: 0 },
    verts: [
      { x: 1, y: 0 },
      { x: -0.866, y: 0.5 },
      { x: -0.866, y: -0.5 },
    ],
  } as IPrimitave,

};
