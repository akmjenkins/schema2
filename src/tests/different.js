export default (against, message) => (value, { createError, resolve }) => {
  const resolved = resolve({ ref: against });
  return (
    value !== resolved || createError({ message, params: { value: against } })
  );
};
