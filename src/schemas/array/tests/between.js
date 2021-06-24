export default ({ min, max, inclusive }) => (
  value,
  { resolve, createError },
) => {
  const resolved = { min: resolve(min), max: resolve(max), inclusive };
  const len = value.length;

  return (
    (inclusive
      ? len <= resolved.max && len >= resolved.min
      : len < resolved.max && len > resolved.min) || createError({ resolved })
  );
};
