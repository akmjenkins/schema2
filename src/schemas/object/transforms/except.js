export default ({ keys, values, keysWhere, valuesWhere }) =>
  (value, { is, resolve }) => {
    const k = resolve(keys || []).map(resolve);
    const v = resolve(values || []).map(resolve);

    const checkKey = (key) => Array.isArray;

    return Object.entries(value).reduce((acc, [key, val]) => {}, { ...value });
  };
