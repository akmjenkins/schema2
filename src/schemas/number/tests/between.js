export default ({ min, max, inclusive }) => (
  value,
  { resolve, createError },
) => {
  const resolved = { min: resolve(min), max: resolve(max), inclusive };

  return (
    (inclusive
      ? value <= resolved.max && value >= resolved.min
      : value < resolved.max && value > resolved.min) ||
    createError({ resolved })
  );
};
