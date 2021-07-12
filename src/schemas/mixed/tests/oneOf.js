export default ({ values }) =>
  (value, { resolve, createError }) => {
    const resolved = { values: values.map(resolve) };
    return (
      resolved.values.some((v) => v === value) ||
      createError({ params: { resolved } })
    );
  };
