export const createValidator = (fn, opts = {}) => {
  const {
    allowUndefined = false,
    onlySchemas = [],
    allowNull = false,
    preCheck,
  } = opts;
  return (...args) => (value, schemaStuff) => {
    const { schemaType, warn } = schemaStuff;
    if (value === undefined && !allowUndefined) return true;
    if (value === null && !allowNull) return true;
    if (preCheck && !preCheck(value)) return true;
    if (onlySchemas.length && !onlySchemas.includes(schemaType)) {
      warn(`Attempted to use validator ${name} on ${schemaType} - ignoring`);
      return true;
    }
    return fn(...args)(value, schemaStuff, passError(schemaStuff.createError));
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
    warn(`Attempted to use transform ${name} on ${schemaType} - ignoring`);
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

export const isRef = (o) => o && Object.prototype.hasOwnProperty.call(o, 'ref');

export const joinPath = (path) => path.join('.');

export const isEmpty = (o) => !o || !Object.keys(o).length;

export const hasSynchronousError = (results) =>
  results.length && results.some(([, i]) => i.some((e) => e && !isThenable(e)));

export const reduceInner = (acc, key, { assert, abortEarly }, checker) => {
  if (assert && abortEarly && hasSynchronousError(acc.results)) return acc;

  const { value, results } = checker();

  return {
    value: Array.isArray(acc.value)
      ? [...acc.value, value]
      : { ...acc.value, [key]: value },
    results: !results.length ? acc.results : [...acc.results, ...results],
  };
};

export const passError = (createError) => (error = {}, rest = {}) =>
  createError(typeof error === 'string' ? error : { ...rest, error });
