import { createGetOperator, isThenable, joinPath } from '../utils';
import errorCreator from './errorCreator';

export default (schema, value, options, resolve) => {
  const { sync, multiple, path, is, schemas } = options;
  const {
    tests,
    nullable,
    type: schemaType,
    label = joinPath(path) || 'field',
  } = schema;

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

    // we have a synchronous error, we can stop here if multiple is false and abortEarly is true
    // really thinking hard about getting rid of the multiple option
    if (!multiple) shouldKeepRunning = false;

    return [...acc, returnResult(result)];
  }, []);
};
