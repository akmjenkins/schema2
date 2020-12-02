import { parseOperator } from './utils';

export default (schema, value, options) => {
  const { warn, strict } = options;
  const { type, transforms } = schema;

  if (!transforms.length || value === null || value === undefined || strict)
    return value;
  return transforms.reduce((acc, t) => {
    const [name, ...args] = parseOperator(t);
    const fn = options.transforms[name];
    if (!fn) throw new Error(`No transform with name ${name} found`);
    return fn(...args)(acc, value, { type, warn });
  }, value);
};
