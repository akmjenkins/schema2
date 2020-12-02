export default (values, message) => (value, { createError, resolve }) => {
  const resolved = values.map(resolve);
  return (
    resolved.includes(value) ||
    createError({ message, params: { values: resolved } })
  );
};
