export default ({ min, max, inclusive }) =>
  (value, { resolve, createError }) => {
    const resolved = { min: resolve(min), max: resolve(max), inclusive };
    const len = value.length;
    const { max: high, min: low } = resolved;

    return (
      (inclusive ? len <= high && len >= low : len < high && len > low) ||
      createError({ resolved })
    );
  };
