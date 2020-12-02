import { parts } from '@zuze/interpolate';

/*
relative paths are prefixed by a .

condisder the following structure:

{
  a: {
    b: {
      c: { ref: 'd' },
      d: 'valueOne'
    },
    e: { ref: 'b' },
    f: { ref: '.g' }
  },
  g: 'valueTwo',
  h: {
    i: {
      j: { ref: '..g' }
    }
  }
}

The value at a.b.c would resolve to be valueOne
The value at a.e would resolve to be { c: 'valueOne', d: 'valueOne' }
The value at a.f would resolve to be valueTwo because .g indicates to go up one level (to the level of a,g,h) and resolve g from there
The value at h.i.j would resolve to be valueTwo because ..g indicates to go up one level (to i), then another (to the level of a,g,h) and resolve g from there

*/
const RELATIVE_REGEXP = /^\.+/;

export default (path, currentPath) => {
  const isRelative = path.match(RELATIVE_REGEXP);
  const levels = isRelative ? isRelative[0].length : 0;
  const value = currentPath.slice(0, -(levels + 1)).concat(parts(path));

  return [value, value.reduce((acc, p) => [...acc, 'inner', p], [])];
};
