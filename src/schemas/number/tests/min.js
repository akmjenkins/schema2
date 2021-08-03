export default ({ value: v, inclusive = true }) =>
  (value, { resolve, createError }) => {
    const resolved = { value: resolve(v), inclusive: resolve(inclusive) };

    return (
      (resolved.inclusive ? value >= resolved.value : value > resolved.value) ||
      createError({ resolved })
    );
  };
