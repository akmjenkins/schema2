export default ({ schema }) =>
  (value, { cast }) =>
    Object.keys(value).reduce(
      (acc, k) => ({ ...acc, [cast(schema, k)]: value[k] }),
      {},
    );
