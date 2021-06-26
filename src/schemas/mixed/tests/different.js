export default ({ ref }) => (value, { resolve, createError }) => {
  const resolved = { ref: resolve({ ref }) };
  return value !== resolved.ref || createError({ params: { resolved } });
};
