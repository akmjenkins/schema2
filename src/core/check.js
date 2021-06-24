import {
  nextOptions,
  hasSynchronousError,
  hasOwnProp,
  joinPath,
} from '../utils';
import merge from './merge';
import { createResolver } from './resolve';
import resolveSchema from './resolveSchema';
import runTransforms from './runTransforms';
import runTests from './runTests';

const reduceInner = (acc, key, { assert, abortEarly }, checker) => {
  if (assert && abortEarly && hasSynchronousError(acc.results)) return acc;

  const { value, results } = checker();

  // mimic yup behavior - only include the property if it has a value or it exists in the value being cast/validated
  const shouldInclude =
    Array.isArray(acc.value) || value || hasOwnProp(acc.value, key);

  return {
    value: Array.isArray(acc.value)
      ? [...acc.value, value]
      : shouldInclude
      ? { ...acc.value, [key]: value }
      : acc.value,
    results: !results.length ? acc.results : [...acc.results, ...results],
  };
};

// inner "check"ing of schemas
const checkInner = (schema, value, options) => {
  const { type, inner } = schema;

  if (type === 'array') {
    value = value || [];
    const isTuple = Array.isArray(inner);
    return (isTuple ? inner : value).reduce(
      (acc, v, i) =>
        reduceInner(acc, i, options, () =>
          check(isTuple ? v : inner, value[i], nextOptions(options, i)),
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
  const { schemas, path, sync, assert, abortEarly, strict } = options;

  const resolver =
    options.resolver ||
    (options.resolver = createResolver(schema, value, options, check));

  const thisResolver = resolver(path);

  const { type = 'mixed', ref } = schema;

  if (!schemas[type]) throw new Error(`No schema found for ${type}`);

  // if we're checking a ref, just return the value
  if (ref) return thisResolver(schema);

  schema = merge(schemas[type]?.base || {}, schema);

  // if this schema has conditions on it, go check that one instead
  // this could be async - yikesers
  const fork = resolveSchema(schema, thisResolver, options);
  if (fork !== schema) return check(fork, value, options);

  // run the transforms to get the final value if strict is false
  if (!strict) value = runTransforms(schema, value, options, thisResolver);

  // assert only if necessary
  const testResults = assert
    ? runTests(schema, value, options, thisResolver)
    : [];
  const results = testResults.length ? [[joinPath(path), testResults]] : [];

  // If there are any errors returned here and we are sync, assert, and abortEarly, we can return right away
  if (sync && assert && abortEarly && testResults.length) {
    return { value, results };
  }

  const { value: innerValue, results: innerResults } = schema.inner
    ? checkInner(schema, value, options)
    : { value, results: [] };

  return { value: innerValue, results: [...results, ...innerResults] };
};

export default check;
