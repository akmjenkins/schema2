import { parseOperator, isThenable, joinPath } from './utils';
import errorCreator from './errorCreator';
import * as warnings from './warnings';

export default (schema, value, options, resolve) => {
  // if we are can abortEarly, and we get a synchronous error during validation, then don't waste cycle
  let shouldKeepRunning = true;
  const { assert, sync, warn, multiple, path } = options;
  if (!assert) return [];

  // an test must return true, false, or an error message or a Promise resolving to such
  // it cannot throw an error or reject
  // if it does, then schema2 will throw an error
  const results = schema.tests.reduce((acc, t) => {
    if (!shouldKeepRunning) return acc;

    const [name, ...args] = parseOperator(t);
    const fn = options.tests[name];
    if (!fn) throw new Error(`No test with name ${name} found`);
    const label = schema.label || joinPath(path) || 'field';

    // bunch or warnings we have to go through
    // to let the developer know what they might have screwed up
    const createError = errorCreator(name, label, schema, options);
    try {
      const result = fn(...args)(value, {
        schemaType: schema.type,
        resolve,
        createError,
        name,
        warn,
      });

      if (isThenable(result)) {
        if (sync) {
          warnings.syncReturnedAsync(warn, name, label);
          result
            .then(
              (e) =>
                e !== true &&
                warnings.syncReturnedAsyncAndFailed(warn, name, label, e),
            )
            .catch((err) =>
              warnings.syncReturnedAsyncAndThrew(warn, name, label, err),
            );
          return acc;
        }

        return [
          ...acc,
          result
            .then((e) => e || createError())
            .catch((err) => {
              warnings.asyncThrew(warn, name, label, err);
              return createError();
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
      warnings.syncThrew(warn, name, label, err);
      return acc;
    }
  }, []);

  return results;
};
