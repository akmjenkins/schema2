export default ({ value: v, inclusive }) => (
  value,
  { resolve, createError },
) => {
  const resolved = { value: resolve(v), inclusive };

  return (
    (inclusive ? value <= resolved.value : value < resolved.value) ||
    createError({ resolved })
  );
};
