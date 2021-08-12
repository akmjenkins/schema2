import { ValidationError, settle, defaults } from './core';

const is = (schema, value, options) => {
  options = defaults(options);
  const { sync } = options;
  try {
    const resolved = settle(schema, value, { ...options, is, assert: true });
    return sync ? true : resolved.then(() => true).catch(() => false);
  } catch (err) {
    if (err instanceof ValidationError) return false;
    throw err;
  }
};

export default is;
