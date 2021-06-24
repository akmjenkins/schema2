import { get } from '../../../utils';

// path can be supplied if it's an array of objects and we essentially want to act like lodashes uniqBy
export default ({ path }) => {
  const getter = (from) => (path ? get(from, path) : from);
  return (value) => {
    // easiest way to unique an array
    if (!path) return [...new Set(value)];

    return value.filter((a, i, arr) => {
      const val = getter(a);
      return arr.findIndex((b) => getter(b) === val) === i;
    });
  };
};
