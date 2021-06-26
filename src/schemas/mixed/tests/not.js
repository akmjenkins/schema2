export default ({ value: v }) => (value, { resolve, createError }) => {
  const resolved = { value: resolve(v) };
  return value !== resolved.value || createError({ params: { resolved } });
};
