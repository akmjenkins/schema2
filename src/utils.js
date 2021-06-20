export const createValidator = (fn, opts = {}) => {
  const {
    allowUndefined = false, // this thing right here!!!! why?
    onlySchemas = [],
    allowNull = false,
    preCheck,
  } = opts;
  return (...args) => (value, schemaStuff) => {
    const { schemaType, warn, createError } = schemaStuff;
    if (value === undefined && !allowUndefined) return true;
    if (value === null && !allowNull) return true;
    if (preCheck && !preCheck(value)) return true;
    if (onlySchemas.length && !onlySchemas.includes(schemaType)) {
      warn(
        `Attempted to use validator for ${onlySchemas} on ${schemaType} - ignoring`,
      );
      return true;
    }
    return fn(...args)(value, schemaStuff, passError(createError));
  };
};

export const createTransform = (fn, opts) => (...args) => (
  value,
  originalValue,
  schemaStuff,
) => {
  const { onlySchemas = [] } = opts;
  const { warn, schemaType } = schemaStuff;
  if (onlySchemas.length && !onlySchemas.includes(schemaType)) {
    warn(
      `Attempted to use transform for ${onlySchemas} on ${schemaType} - ignoring`,
    );
    return value;
  }
  return fn(...args)(value, originalValue, schemaStuff);
};

export const parseOperator = (op) => (Array.isArray(op) ? op : [op]);

export const checkSchema = (type, schemas) => {
  if (!schemas[type])
    throw new Error(
      `Unsupported schema ${type} found. You must pass custom schemas via options`,
    );
};

export const nextOptions = (options, path) => ({
  ...options,
  path: nextPath(options, path),
});

export const nextPath = ({ path }, next) => [...path, next];

// a validator must always return true, false, or use createError(), or a promise that results to true, false, or use createError()
// if a validator throws an error, then it screws everything up

const isValidationError = (o) => o && o.__validationError;

export const isThenable = (w) => w && typeof w.then === 'function';

export const collectErrors = (fn) => {
  const result = fn();
  const done = (v) => (v && !isValidationError(v) ? [] : [v]);
  return isThenable(result) ? result.then(done) : done(result);
};
export const isObject = (o) =>
  Object.prototype.toString.call(o) === '[object Object]';

export const createTypeCheck = (fn) => () => (value, { createError }) =>
  value === undefined || fn(value) || createError({ name: 'typeError' });

export const hasOwnProp = (o, prop) =>
  o && Object.prototype.hasOwnProperty.call(o, prop);

export const isRef = (o) => hasOwnProp(o, 'ref');

export const joinPath = (path) => path.join('.');

export const isEmpty = (o) => !o || !Object.keys(o).length;

export const hasSynchronousError = (results) =>
  results.length && results.some(([, i]) => i.some((e) => e && !isThenable(e)));

export const reduceInner = (acc, key, { assert, abortEarly }, checker) => {
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

export const passError = (createError) => (error = {}, rest = {}) =>
  createError(typeof error === 'string' ? error : { ...rest, error });

export const includeTransforms = (transformMap, onlySchemas) =>
  Object.entries(transformMap).reduce(
    (acc, [name, transform]) => ({
      ...acc,
      [name]: createTransform(transform, { name, onlySchemas }),
    }),
    {},
  );
