import base from './base';
import tersity from './tersity';

export default (...args) =>
  [base, tersity].reduce(
    (acc, f) => ({
      ...acc,
      [f.name]: f(...args),
    }),
    {},
  );
