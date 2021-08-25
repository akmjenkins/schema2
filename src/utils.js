export const isObject = (o) =>
  Object.prototype.toString.call(o) === '[object Object]' && !Array.isArray(o);

export const nextOptions = (options, path) => ({
  ...options,
  path: nextPath(options, path),
});
export const nextPath = ({ path }, next) => [...path, next];
export const joinPath = (path, delimiter = '.') => path.join(delimiter);

export const isThenable = (w) => w && typeof w.then === 'function';

export const hasOwnProp = (o, prop) =>
  o && Object.prototype.hasOwnProperty.call(o, prop);

export const isEmpty = (o) => !o || !Object.keys(o).length;

export const hasSynchronousError = (results) =>
  results.some(([, i]) => i.some((e) => e && !isThenable(e)));

// inlined from property-expr
const SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g;
const CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/; // utility to dynamically destructure arrays

export const parts = (path) =>
  path.match(SPLIT_REGEX).map((p) => p.replace(CLEAN_QUOTES_REGEX, '$2'));

export const get = (obj, path, def) =>
  parts(path).reduce((acc, part) => (!acc ? acc : acc[part]), obj) ?? def;

export const createGetOperator =
  (schemaType, operatorType, schemas) => (type) => {
    const op = schemas[schemaType][operatorType][type];
    if (!op) throw new Error(`No ${operatorType} found with type ${type}`);
    return op;
  };

export const canBailOut = ({ assert, abortEarly }, results) =>
  assert && abortEarly && hasSynchronousError(results);

export const defined = (u) => u !== undefined;

const match = /\$\{\s*(.+?)\s*\}/g;
export const interpolate = (subject = '', params = {}, matcher = match) =>
  subject.replace(matcher, (_, t) => {
    return get(params, t);
  });
