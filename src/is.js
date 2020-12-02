import settle from './settle';
export default (schema, value, options) => {
  const { sync } = options;
  try {
    const resolved = settle(schema, value, { ...options, assert: true });
    return sync ? true : resolved.then(() => true).catch(() => false);
  } catch (err) {
    return false;
  }
};
