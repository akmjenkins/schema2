import { get } from '@zuze/interpolate';
import { createTypeCheck } from '../utils';

const arrayTransform = () => (val) => {
  if (typeof val === 'string')
    try {
      val = JSON.parse(val);
    } catch (err) {
      val = null;
    }

  return Array.isArray(val) ? val : null;
};
const arrayTypeCheck = createTypeCheck(Array.isArray);

export const schema = {
  transforms: ['arrayTransform'],
  tests: ['arrayTypeCheck'],
};

export const tests = {
  arrayTypeCheck,
};

// rejector is a schema or schemas
// export const compact = (rejector) => (value, originalValue, options) =>
//   value.filter((v) => matches(rejector, v, options));

export const unique = (path) => {
  const getter = (from) => (path ? get(from, path) : from);
  return (value) => {
    // easiest way to unique an array
    if (!path) return Array.from(new Set(value));

    return value.filter((a, i, arr) => {
      const val = getter(a);
      return arr.findIndex((b) => getter(b) === val) === i;
    });
  };
};

export const transforms = {
  arrayTransform,
  //   compact: restrictOperatorToSchema(['array'], compact),
  //   unique: restrictOperatorToSchema(['array'], unique),
};
