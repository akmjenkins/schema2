import {
  nextOptions,
  hasSynchronousError,
  hasOwnProp,
  joinPath,
} from './utils';
import merge from './merge';
import { createResolver } from './resolve';
import resolveSchema from './resolveSchema';
import runTransforms from './runTransforms';
import runTests from './runTests';
import * as warnings from './warnings';

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
const checkInner = (inner, schema, value, options) => {
  const { type } = schema;
  const { warn } = options;

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

  warn(warnings.innerSchemaUnsupported(type));
  return { value, results: [] };
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

  if (!schemas[type]) throw new Error(`No schema found for ${type}`);

  // if we're checking a ref, just return the value
  if (ref) return thisResolver(schema);

  // merge the schema definition with the base schema definition given by schemas[type]
  schema = merge(schemas[type] || {}, schema);

  // if this schema has conditions on it, go check that one instead
  // this could be async - yikesers
  const fork = resolveSchema(schema, thisResolver, options);
  if (fork !== schema) return check(fork, value, options);

  // reduce the transforms to get the final value
  value = runTransforms(schema, value, options, thisResolver);

  // pass in the resolver
  const testResults = runTests(schema, value, options, thisResolver);
  const results = testResults.length ? [[joinPath(path), testResults]] : [];

  // If there are any errors returned here and we are sync, assert, and abortEarly, we can return right away
  if (sync && assert && abortEarly && testResults.length) {
    return { value, results };
  }

  // checkInner must return value and errors - and check must return value and errors!
  const { inner } = schema;
  const { value: innerValue, results: innerResults } = inner
    ? checkInner(inner, schema, value, options)
    : { value, results: [] };

  return { value: innerValue, results: [...results, ...innerResults] };
};

export default check;