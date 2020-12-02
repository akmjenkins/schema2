export default (against, message) => (value, { createError, resolve }) => {
  const resolved = resolve(against);
  return (
    value === resolved || createError({ message, params: { value: resolved } })
  );
};
