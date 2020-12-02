export default (against, message) => async (
  value,
  { createError, resolve },
) => {
  const resolved = resolve(against);
  return (
    value !== resolved || createError({ message, params: { value: resolved } })
  );
};
