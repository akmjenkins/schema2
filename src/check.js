import { nextOptions, reduceInner, joinPath } from './utils';
import merge from './merge';
import { createResolver } from './resolve';
import resolveSchema from './resolveSchema';
import runTransforms from './runTransforms';
import runTests from './runTests';
import * as warnings from './warnings';

// inner "check"ing of schemas
const checkInner = (inner, schema, value, options) => {
  const { type } = schema;
  const { warn } = options;

  if (type === 'array') {
    value = value || [];
    const isTuple = Array.isArray(inner);
    return (isTuple ? inner : value).reduce(
      (acc, v, i) => {
        return reduceInner(acc, i, options, () =>
          check(isTuple ? v : inner, value[i], nextOptions(options, i)),
        );
      },
      { value: [], results: [] },
    );
  }

  if (type === 'object') {
    return Object.entries(inner).reduce(
      (acc, [key, schemaOrRef]) => {
        return reduceInner(acc, key, options, () =>
          check(schemaOrRef, (value || {})[key], nextOptions(options, key)),
        );
      },
      { value: {}, results: [] },
    );
  }

  warnings.innerSchemaUnsupported(warn, type);
};

// accepts a schema, value, and options
// always returns the cast value and an array of test results like this { value, results }
const check = (schema, value, options) => {
  const { schemas, path, sync, assert, abortEarly } = options;

  const resolver =
    options.resolver ||
    (options.resolver = createResolver(schema, value, options, check));

  const thisResolver = resolver(path);

  const { type, ref } = schema;

  // if we're checking a ref, just return the value
  if (ref) return thisResolver(schema);

  // merge the schema definition with the base schema definition given by schemas[type]
  schema = merge(schemas[type] || {}, schema);

  // if this schema has conditions on it, go check that one instead
  // this could be async - yikesers
  const fork = resolveSchema(schema, thisResolver, options);
  if (fork !== schema) return check(fork, value, options);

  // reduce the transforms to get the final value
  value = runTransforms(schema, value, options);

  // pass in the resolver
  const testResults = runTests(schema, value, options, thisResolver);
  const results = testResults.length ? [[joinPath(path), testResults]] : [];

  // If there are any errors returned here and we are sync, assert, and abortEarly, we can return right away
  if (sync && assert && abortEarly && testResults.length)
    return { value, results };

  // checkInner must return value and errors - and check must return value and errors!
  const { inner } = schema;
  const { value: innerValue, results: innerResults } = inner
    ? checkInner(inner, schema, value, options)
    : { value, results: [] };

  value = innerValue !== undefined ? innerValue : schema.default;

  return { value, results: [...results, ...innerResults] };
};

export default check;
