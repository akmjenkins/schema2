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

export const createTransform = (fn, opts = {}) => (...args) => (
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

export const isThenable = (w) => w && typeof w.then === 'function';

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
