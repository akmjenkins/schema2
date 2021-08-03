export default ({ min, max, inclusive = true }) =>
  (value, { resolve, createError }) => {
    const resolved = {
      min: resolve(min),
      max: resolve(max),
      inclusive: resolve(inclusive),
    };

    return (
      (inclusive
        ? value <= resolved.max && value >= resolved.min
        : value < resolved.max && value > resolved.min) ||
      createError({ resolved })
    );
  };
