export default ({ schema }) =>
  (value, { is, resolve, createError }) => {
    const resolved = { schema: resolve(schema) };
    return is(resolved.schema, value) || createError({ params: { resolved } });
  };
