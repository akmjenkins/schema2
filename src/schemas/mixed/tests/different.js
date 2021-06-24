export default ({ value: ref }) => (value, { resolve, createError }) => {
  const resolved = { value: resolve({ ref }) };
  return value !== resolved || createError({ params: { resolved } });
};
