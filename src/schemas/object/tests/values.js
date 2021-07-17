export default ({ schema, where }) =>
  (value, { is, resolve, createError }) => {
    const s = resolve(schema);
    const w = resolve(where);

    return (
      Object.entries(value)
        .filter(([key]) => !w || is(w, key))
        .every(([, v]) => is(s, v)) ||
      createError({ params: { resolved: { schema: s, where: w } } })
    );
  };
