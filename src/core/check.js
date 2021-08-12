import { nextOptions, joinPath } from '../utils';
import merge from './merge';
import { createResolver } from './resolve';
import resolveSchema from './resolveSchema';
import runTransforms from './runTransforms';
import runTests from './runTests';

// accepts a schema, value, and options
// always returns the cast value and an array of test results like this { value, results }
const check = (schema, value, options) => {
  if (!schema)
    throw new Error(
      `A schema must contain a type of ref property ${options.path}`,
    );

  const { schemas, path, assert, strict } = options;

  const resolver =
    options.resolver ||
    (options.resolver = createResolver(schema, value, options, check));

  const thisResolver = resolver(path);

  const { type, ref } = schema;

  // if we're checking a ref, just return the value
  if (ref) return thisResolver(schema);

  // merge with the "base" schema for this type
  schema = merge(schemas[type]?.base || {}, schema);

  // check if this is a conditional schema
  const fork = resolveSchema(schema, thisResolver, options);
  if (fork !== schema) return check(fork, value, options);

  // run the transforms to get the final value if strict is false
  let typeError;
  if (!strict) {
    try {
      value = runTransforms(schema, value, options, thisResolver);
    } catch (err) {
      if (!assert || !(err instanceof TypeError)) throw err;
      typeError = err;
      value = null;
    }
  }

  // assert only if necessary
  const testResults = assert
    ? runTests(schema, value, options, thisResolver, typeError)
    : [];
  const results = testResults.length ? [[joinPath(path), testResults]] : [];

  // no custom parser provided by the schema definition (array/object), we're done
  const parser = schemas[type].parser;
  if (!parser || typeError) return { value, results };
  const nextChecker = (s, v, path) => check(s, v, nextOptions(options, path));

  const { value: parsedValue = value, results: parsedResults = [] } = parser(
    schema,
    value,
    options,
    nextChecker,
  );

  return { value: parsedValue, results: [...results, ...parsedResults] };
};

export default check;
