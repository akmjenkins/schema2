import settle from './settle';
import defaults from './defaults';

export const validate = (schema, value, options) =>
  settle(schema, value, { ...defaults(options), assert: true });

export const is = (schema, value, options) => {
  options = defaults(options);
  const { sync } = options;
  try {
    const resolved = settle(schema, value, { ...options, assert: true });
    return sync ? true : resolved.then(() => true).catch(() => false);
  } catch (err) {
    return false;
  }
};

export const cast = (schema, value, options) =>
  settle(schema, value, { ...defaults(options), coerce: true, assert: false });

export { createValidator, createTransform, isThenable, isRef } from './utils';
