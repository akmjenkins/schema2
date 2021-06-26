import { nextOptions, hasOwnProp, joinPath, canBailOut } from '../utils';
import merge from './merge';
import { createResolver } from './resolve';
import resolveSchema from './resolveSchema';
import runTransforms from './runTransforms';
import runTests from './runTests';

const reduceInner = (acc, key, { assert, abortEarly }, checker) => {
  if (canBailOut({ assert, abortEarly }, acc.results)) return acc;

  const { value, results } = checker();

  const isArray = Array.isArray(acc.value);

  // mimic yup behavior - only include the property if it has a value or it exists in the value being cast/validated
  const shouldInclude = isArray || value || hasOwnProp(acc.value, key);

  return {
    value: isArray
      ? [...acc.value, value]
      : shouldInclude
      ? { ...acc.value, [key]: value }
      : acc.value,
    results: [...acc.results, ...results],
  };
};

// inner "check"ing of schemas
const checkInner = (schema, value, options) => {
  const { type, inner } = schema;

  if (type === 'array') {
    value = value || [];
    const isTuple = Array.isArray(inner);
    return (isTuple ? inner : value).reduce(
      (acc, schemaOrRef, idx) =>
        reduceInner(acc, idx, options, () =>
          check(
            isTuple ? schemaOrRef : inner,
            value[idx],
            nextOptions(options, idx),
          ),
        ),
      { value: [], results: [] },
    );
  }

  if (type === 'object') {
    return Object.entries(inner).reduce(
      (acc, [key, schemaOrRef]) =>
        reduceInner(acc, key, options, () =>
          check(schemaOrRef, acc.value[key], nextOptions(options, key)),
        ),
      { value: value || {}, results: [] },
    );
  }

  return { value, results: [] };
};

// accepts a schema, value, and options
// always returns the cast value and an array of test results like this { value, results }
const check = (schema, value, options) => {
  const { schemas, path, assert, strict } = options;

  const resolver =
    options.resolver ||
    (options.resolver = createResolver(schema, value, options, check));

  const thisResolver = resolver(path);

  const { type, ref, inner } = schema;

  // if we're checking a ref, just return the value
  if (ref) return thisResolver(schema);

  // merge with the "base" schema for this type
  schema = merge(schemas[type]?.base || {}, schema);

  // check if this is a conditional schema
  const fork = resolveSchema(schema, thisResolver, options);
  if (fork !== schema) return check(fork, value, options);

  // run the transforms to get the final value if strict is false
  if (!strict) value = runTransforms(schema, value, options, thisResolver);

  // assert only if necessary
  const testResults = assert
    ? runTests(schema, value, options, thisResolver)
    : [];
  const results = testResults.length ? [[joinPath(path), testResults]] : [];

  // If there are any errors returned here and we have a synchronous error we can return early
  if (canBailOut(options, results)) return { value, results };

  const { value: innerValue = value, results: innerResults = [] } = inner
    ? checkInner(schema, value, options)
    : {};

  return { value: innerValue, results: [...results, ...innerResults] };
};

export default check;
