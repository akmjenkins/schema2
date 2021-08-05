import { createGetOperator, isThenable, joinPath } from '../utils';
import errorCreator from './errorCreator';

export default (schema, value, options, resolve, castError) => {
  const { sync, multiple, path, is, schemas } = options;
  const {
    tests,
    nullable,
    type: schemaType,
    typeError,
    label = joinPath(path) || 'field',
  } = schema;

  // if there's a castError we're done
  if (castError)
    return [
      errorCreator({
        type: 'typeCheck',
        label,
        schema,
        params: { subject: value },
      })(typeError),
    ];

  // null/undefined values are special cases and will not be run through tests
  if (value === null || value === undefined)
    return nullable
      ? []
      : [
          errorCreator({
            type: 'notNullable',
            label,
            schema,
            params: { subject: value },
          })(),
        ];

  const getOperator = createGetOperator(schemaType, 'tests', schemas);

  // allows us to stop validation if multiple is false (default)
  // not the same as abortEarly
  let shouldKeepRunning = true;

  // tests can be an array or an object

  return tests.reduce((acc, { type, error, ...args }) => {
    if (!shouldKeepRunning) return acc;

    // bunch or warnings we have to go through
    // to let the developer know what they might have screwed up
    const createError = errorCreator({
      type,
      label,
      schema,
      params: { subject: value, ...args },
      error,
    });

    const testOptions = {
      sync,
      resolve,
      is: (schema, value) => is(schema, value, { ...options, sync: true }),
      createError,
      // allows a validator to run another test on this value by name - i.e. negate
      runTest: ({ type, ...args }) =>
        getOperator(type)(args)(value, testOptions),
    };

    try {
      const result = getOperator(type)(args)(value, testOptions);

      // test passed
      if (result === true) return acc;

      const returnResult = (r) => r || createError();

      // if the result is a promise
      if (isThenable(result)) {
        // and we are running in synchronous mode throw an error
        if (sync)
          throw new Error(
            `Synchronous validation included an async test ${type} at ${label}`,
          );

        return [...acc, result.then(returnResult)];
      }

      // synchronous error - shouldKeepRunning is true is multiple is false OR the error is the typeCheck error
      shouldKeepRunning = !multiple;

      return [...acc, returnResult(result)];
    } catch (err) {
      if (sync) throw err;
      return [...acc, Promise.reject(err)];
    }
  }, []);
};
