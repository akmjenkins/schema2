import { parseOperator, isThenable, joinPath } from './utils';
import errorCreator from './errorCreator';
import * as warnings from './warnings';

export default (schema, value, options, resolve) => {
  // if we are can abortEarly, and we get a synchronous error during validation, then don't waste cycle
  let shouldKeepRunning = true;
  const { assert, sync, warn, multiple, path, is } = options;
  if (!assert) return [];

  // an test must return true, false, or an error message or a Promise resolving to such
  // it cannot throw an error or reject
  // if it does, then schema2 will throw an error

  // schema.tests might be an object!!

  // NOTE: tests could be an object instead of an array
  const results = schema.tests.reduce((acc, t) => {
    if (!shouldKeepRunning) return acc;

    const [name, ...args] = parseOperator(t);
    const fn = options.tests[name];
    if (!fn) {
      warn(warnings.noOperator('test', name));
      return acc;
    }
    const label = schema.label || joinPath(path) || 'field';

    // bunch or warnings we have to go through
    // to let the developer know what they might have screwed up
    const createError = errorCreator(name, label, schema, {
      params: { value },
      ...options,
    });

    // allows a validator to run another test by name - i.e. negate
    const runTest = (name, ...args) =>
      options.tests[name](...args)(value, testOptions);

    const testOptions = {
      sync,
      schemaType: schema.type,
      resolve,
      is: (schema, value) => is(schema, value, { ...options, sync: true }),
      createError,
      runTest,
      name,
      warn: (warning) =>
        warn(
          `Received warning for test ${name} at ${options.path.join(
            '.',
          )} - ${warning}`,
        ),
    };

    try {
      const result = fn(...args)(value, testOptions);

      if (isThenable(result)) {
        if (sync) {
          warn(warnings.syncReturnedAsync(name, label)),
            result
              .then(
                (e) =>
                  e !== true &&
                  warn(warnings.syncReturnedAsyncAndFailed(name, label, e)),
              )
              .catch((err) => {
                // no need to rethrow, this result is ignored anyway
                warn(warnings.syncReturnedAsyncAndThrew(name, label), err);
              });
          return acc;
        }

        return [
          ...acc,
          result
            .then((e) => e || createError())
            .catch((err) => {
              warn(warnings.asyncThrew(name, label));
              throw err;
            }),
        ];
      }

      // if multiple is false
      // and the synchronous test result is not === true,
      // then we have a failed test and can skip the rest
      if (!multiple && result !== true) shouldKeepRunning = false;

      // if the test result is true, just return acc,
      // otherwise return a tuple of an error message and the path
      return result === true ? acc : [...acc, result || createError()];
    } catch (err) {
      warn(warnings.syncThrew(name, label), err);
      throw err;
    }
  }, []);

  return results;
};
