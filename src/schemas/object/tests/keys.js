export default ({ schema }) =>
  (value, { is, resolve, createError }) => {
    const s = resolve(schema);
    return (
      Object.keys(value).every((v) => is(schema, v)) ||
      createError({ params: { resolved: { schema: s } } })
    );
  };
