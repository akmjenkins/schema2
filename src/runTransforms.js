import { parseOperator } from './utils';
import * as warnings from './warnings';

export default (schema, value, options, resolve) => {
  const { warn, strict, is } = options;
  const { type, transforms } = schema;

  // transforms might be an object

  const run =
    !transforms.length || value === null || value === undefined || strict
      ? []
      : transforms;

  return run.reduce((acc, t) => {
    const [name, ...args] = parseOperator(t);
    // args could contain refs, just like in tests
    const fn = options.transforms[name];
    if (!fn) {
      warn(warnings.noOperator('transform', name));
      return acc;
    }

    const transformOptions = {
      schemaType: type,
      warn: (warning) =>
        warn(
          `Received warning for transform ${name} at ${options.path.join(
            '.',
          )} - ${warning}`,
        ),
      resolve,
      is: (schema, value) => is(schema, value, { ...options, sync: true }),
    };

    return fn(...args)(acc, value, transformOptions);
  }, value);
};
