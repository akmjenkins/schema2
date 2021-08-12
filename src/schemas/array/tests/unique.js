import { get } from '../../../utils';

const getter = (what) => (from) => what ? get(from, what) : from;

// path can be supplied if it's an array of objects and we essentially want to act like lodashes uniqBy
export default ({ path }) => {
  return (value, { createError, resolve }) => {
    const resolved = { path: resolve(path) };

    // easiest way to unique an array
    return (
      [...new Set(value.map(getter(resolved.path)))].length === value.length ||
      createError({ resolved })
    );
  };
};
